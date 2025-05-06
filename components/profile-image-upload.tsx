"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { BlobImage } from "@/components/ui/blob-image"
import { Upload, X, Loader2, Camera } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import { useSupabase } from "@/contexts/supabase-context"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/components/ui/use-toast"
import imageCompression from "browser-image-compression"

// Обновим интерфейс компонента, чтобы добавить новые параметры
interface ProfileImageUploadProps {
  onImageUploaded?: (url: string, file?: File | null) => void
  currentImageUrl?: string
  isRegistration?: boolean
}

// Функция для проверки, является ли URL сг��нерированным аватаром
const isGeneratedAvatar = (url: string | null | undefined): boolean => {
  if (!url) return true
  return url.includes("dicebear.com") || url.includes("api.dicebear")
}

// Добавим параметр isRegistration, чтобы изменить поведение при регистрации
export function ProfileImageUpload({
  onImageUploaded,
  currentImageUrl,
  isRegistration = false,
}: ProfileImageUploadProps) {
  const { user, profile } = useAuth()
  const { supabase } = useSupabase()
  const { t } = useTranslation()
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [tempFile, setTempFile] = useState<File | null>(null) // Добавляем состояние для временного хранения файла

  // Проверяем, является ли текущий аватар сгенерированным
  const isGenerated = isGeneratedAvatar(imageUrl)

  useEffect(() => {
    if (currentImageUrl) {
      setImageUrl(currentImageUrl)
    } else if (profile?.avatar_url) {
      setImageUrl(profile.avatar_url)
    }
  }, [currentImageUrl, profile])

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return
      }

      const file = event.target.files[0]

      // Validate file format
      if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
        toast({
          title: "Error",
          description: "Unsupported image format. Please use JPEG, PNG, WebP, or GIF.",
          variant: "destructive",
        })
        return
      }

      // Check original file size (still keep this as a pre-check)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: t("profile.imageTooLarge"),
          variant: "destructive",
        })
        return
      }

      setUploading(true)

      // Compression options
      const options = {
        maxSizeMB: 1, // Max file size in MB
        maxWidthOrHeight: 800, // Max width or height in pixels
        useWebWorker: true, // Use web worker for better performance
        fileType: "image/webp", // Convert to WebP for better compression
      }

      // Compress the image
      const compressedFile = await imageCompression(file, options)

      console.log(
        `Original size: ${(file.size / 1024).toFixed(2)} KB, Compressed size: ${(compressedFile.size / 1024).toFixed(2)} KB`,
      )

      // Если это регистрация, просто сохраняем файл временно и создаем временный URL
      if (isRegistration) {
        setTempFile(compressedFile)
        const tempUrl = URL.createObjectURL(compressedFile)
        setImageUrl(tempUrl)

        if (onImageUploaded) {
          // Передаем файл вместе с URL
          onImageUploaded(tempUrl, compressedFile)
        }

        setUploading(false)
        return
      }

      // Обычная логика загрузки для существующего профиля
      const fileExt = "webp" // Always use WebP extension for better compression
      const fileName = `profile-${Date.now()}.${fileExt}`
      const filePath = `${user?.id}/${fileName}`

      // Upload the compressed file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, compressedFile, {
          cacheControl: "3600",
          upsert: true,
        })

      if (uploadError) {
        throw uploadError
      }

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(uploadData.path)

      // Save avatar metadata to the avatars table
      const { error: insertError } = await supabase.from("avatars").insert({
        user_id: user?.id,
        url: publicUrl,
        file_name: fileName,
        file_size: compressedFile.size,
        content_type: compressedFile.type,
        is_current: true,
      })

      if (insertError) {
        throw insertError
      }

      // Update any existing avatars to not be current
      const { error: updateError } = await supabase
        .from("avatars")
        .update({ is_current: false })
        .eq("user_id", user?.id)
        .neq("url", publicUrl)

      if (updateError) {
        console.error("Error updating other avatars:", updateError)
      }

      setImageUrl(publicUrl)

      if (onImageUploaded) {
        onImageUploaded(publicUrl)
      }

      toast({
        title: "Success",
        description: t("profile.imageUploaded"),
        variant: "default",
      })
    } catch (error: any) {
      console.error("Error uploading image:", error)
      toast({
        title: "Error",
        description: error.message || t("profile.imageUploadError"),
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const removeImage = async () => {
    if (isRegistration) {
      setImageUrl(null)
      setTempFile(null)
      if (onImageUploaded) {
        onImageUploaded("", null)
      }
      return
    }

    if (!user?.id) return

    try {
      setUploading(true)

      // Update the current avatar to not be current
      const { error } = await supabase
        .from("avatars")
        .update({ is_current: false })
        .eq("user_id", user.id)
        .eq("is_current", true)

      if (error) {
        throw error
      }

      setImageUrl(null)

      if (onImageUploaded) {
        onImageUploaded("")
      }

      toast({
        title: "Success",
        description: "Profile image removed successfully",
      })
    } catch (error: any) {
      console.error("Error removing image:", error)
      toast({
        title: "Error",
        description: error.message || "Error removing image",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  // Add this useEffect to clean up blob URLs
  useEffect(() => {
    return () => {
      // Clean up any blob URLs when component unmounts
      if (imageUrl && imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imageUrl)
      }
    }
  }, [imageUrl])

  // Определяем размеры в зависимости от типа аватара
  const avatarSize = isGenerated ? "h-16 w-16" : "h-32 w-32"
  const containerSize = isGenerated ? "h-20 w-20" : "h-36 w-36"
  const buttonSize = isGenerated ? "h-8 w-8" : "h-10 w-10"
  const iconSize = isGenerated ? "h-4 w-4" : "h-5 w-5"
  const removeButtonSize = isGenerated ? "h-6 w-6" : "h-8 w-8"
  const removeIconSize = isGenerated ? "h-3 w-3" : "h-4 w-4"

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <BlobImage
          src={
            imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.first_name} ${profile?.last_name}`
          }
          alt="Profile"
          width={isGenerated ? 64 : 128}
          height={isGenerated ? 64 : 128}
          className={`rounded-full ${avatarSize} object-cover border-2 border-primary bg-white`}
        />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-full">
          <Button
            variant="ghost"
            size="icon"
            className={`${buttonSize} rounded-full bg-black/50 text-white hover:bg-black/70`}
            onClick={() => document.getElementById("profile-image-upload")?.click()}
            disabled={uploading}
          >
            <Camera className={iconSize} />
          </Button>
        </div>

        {imageUrl && (
          <Button
            variant="destructive"
            size="icon"
            className={`absolute -top-2 -right-2 ${removeButtonSize} rounded-full`}
            onClick={removeImage}
            disabled={uploading}
            type="button" // Добавляем type="button", чтобы предотвратить отправку формы
          >
            <X className={removeIconSize} />
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => document.getElementById("profile-image-upload")?.click()}
          disabled={uploading}
          className="flex items-center gap-2"
          type="button" // Добавляем type="button", чтобы предотвратить отправку формы
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {"Загрузка..."}
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              {"Загрузить изображение"}
            </>
          )}
        </Button>
        <input id="profile-image-upload" type="file" accept="image/*" onChange={uploadImage} className="hidden" />
      </div>
    </div>
  )
}
