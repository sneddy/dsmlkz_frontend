"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useTranslation } from "@/hooks/use-translation"
import { toast } from "@/components/ui/use-toast"
import { ProfileImageUpload } from "@/components/profile-image-upload"
import { NicknameChecker } from "@/components/nickname-checker"
import { CityAutocomplete } from "@/components/city-autocomplete"
import { WordCounter } from "@/components/word-counter"
import { getSupabaseClient } from "@/lib/supabase-client"

interface ProfileFormProps {
  initialProfile: any
  isCreateMode: boolean
  isOffline: boolean
}

export function ProfileForm({ initialProfile, isCreateMode, isOffline }: ProfileFormProps) {
  // Initialize form data with trimmed values from the database
  const [formData, setFormData] = useState({
    nickname: initialProfile?.nickname?.trim() || "",
    first_name: initialProfile?.first_name?.trim() || "",
    last_name: initialProfile?.last_name?.trim() || "",
    birthday: initialProfile?.birthday?.trim() || "",
    current_city: initialProfile?.current_city?.trim() || "",
    university: initialProfile?.university?.trim() || "",
    relevant_company: initialProfile?.relevant_company?.trim() || "",
    relevant_position: initialProfile?.relevant_position?.trim() || "",
    about_you: initialProfile?.about_you?.trim() || "",
    motivation: initialProfile?.motivation?.trim() || "",
    linkedin: initialProfile?.linkedin?.trim() || "",
    other_links: initialProfile?.other_links?.trim() || "",
    avatar_url: initialProfile?.avatar_url || "",
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [tempImageFile, setTempImageFile] = useState<File | null>(null)

  // Validation states
  const [isNicknameValid, setIsNicknameValid] = useState(true)
  const [isAboutYouValid, setIsAboutYouValid] = useState(!!initialProfile?.about_you)
  const [isMotivationValid, setIsMotivationValid] = useState(!!initialProfile?.motivation)

  const { user, updateProfile } = useAuth()
  const router = useRouter()
  const { t } = useTranslation()

  // Don't trim during typing - just update the state directly
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Don't trim during city selection - just update the state directly
  const handleCityChange = (value: string) => {
    setFormData((prev) => ({ ...prev, current_city: value }))
  }

  const handleAvatarUploaded = (url: string, file?: File | null) => {
    setFormData((prev) => ({ ...prev, avatar_url: url }))
    if (file) {
      setTempImageFile(file)
    }
  }

  const validateForm = () => {
    // Check required fields
    if (!formData.nickname || !formData.first_name || !formData.last_name || !formData.current_city) {
      setError(t("profile.requiredFieldsError"))
      toast({
        title: "Validation Error",
        description: t("profile.requiredFieldsError"),
        variant: "destructive",
      })
      return false
    }

    // Check nickname validity
    if (!isNicknameValid) {
      setError(t("profile.nicknameError"))
      toast({
        title: "Validation Error",
        description: t("profile.nicknameError"),
        variant: "destructive",
      })
      return false
    }

    // Check about_you word count
    const aboutYouWords = formData.about_you.trim().split(/\s+/).filter(Boolean).length
    if (aboutYouWords < 10) {
      setError(t("profile.textLengthError"))
      toast({
        title: "Validation Error",
        description: t("profile.textLengthError"),
        variant: "destructive",
      })
      return false
    }

    // Check motivation word count
    const motivationWords = formData.motivation.trim().split(/\s+/).filter(Boolean).length
    if (motivationWords < 10) {
      setError(t("profile.textLengthError"))
      toast({
        title: "Validation Error",
        description: t("profile.textLengthError"),
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check if offline
    if (isOffline) {
      setError(t("profile.offlineError"))
      toast({
        title: "Network Error",
        description: t("profile.offlineError"),
        variant: "destructive",
      })
      return
    }

    // Validate form
    if (!validateForm()) {
      return
    }

    setError(null)
    setSuccess(false)
    setSaving(true)

    try {
      // Apply trimming to all string fields before submission and handle empty birthday
      const trimmedFormData = Object.entries(formData).reduce(
        (acc, [key, value]) => {
          if (typeof value === "string") {
            if (key === "birthday" && value.trim() === "") {
              // Если birthday пустой, установим его как null
              acc[key] = null
            } else if (key !== "avatar_url") {
              acc[key] = value.trim()
            } else {
              acc[key] = value
            }
          } else {
            acc[key] = value
          }
          return acc
        },
        {} as Record<string, any>,
      )

      // Добавим логирование для отладки
      console.log("Trimmed form data to submit:", trimmedFormData)

      // Сначала обновляем профиль без изображения
      const { error: updateError } = await updateProfile(trimmedFormData)

      if (updateError) {
        throw updateError
      }

      // Если это создание профиля и есть временный файл изображения, загружаем его
      if (isCreateMode && tempImageFile && user) {
        try {
          const supabase = getSupabaseClient()
          const fileExt = "webp"
          const fileName = `profile-${Date.now()}.${fileExt}`
          const filePath = `${user.id}/${fileName}`

          // Загружаем файл в Supabase Storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(filePath, tempImageFile, {
              cacheControl: "3600",
              upsert: true,
            })

          if (uploadError) {
            console.error("Error uploading avatar during profile creation:", uploadError)
          } else {
            // Получаем публичный URL
            const {
              data: { publicUrl },
            } = supabase.storage.from("avatars").getPublicUrl(uploadData.path)

            // Сохраняем метаданные аватара в таблицу avatars
            const { error: insertError } = await supabase.from("avatars").insert({
              user_id: user.id,
              url: publicUrl,
              file_name: fileName,
              file_size: tempImageFile.size,
              content_type: tempImageFile.type,
              is_current: true,
            })

            if (insertError) {
              console.error("Error inserting avatar metadata:", insertError)
            } else {
              // Обновляем профиль с URL аватара
              await updateProfile({ avatar_url: publicUrl })
            }
          }
        } catch (avatarError) {
          console.error("Error processing avatar during profile creation:", avatarError)
          // Не прерываем процесс создания профиля из-за ошибки с аватаром
        }
      }

      setSuccess(true)
      toast({
        title: isCreateMode ? t("profile.createSuccess") : t("profile.updateSuccess"),
        description: isCreateMode ? t("profile.createSuccessDescription") : t("profile.updateSuccessDescription"),
      })

      // Redirect after successful save
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (err: any) {
      console.error("Error saving profile:", err)
      setError(err.message || t("profile.updateError"))
      toast({
        title: "Error",
        description: err.message || t("profile.updateError"),
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="p-3 text-sm text-white bg-red-500 rounded-md">{error}</div>}
      {success && (
        <div className="p-3 text-sm text-white bg-green-500 rounded-md">
          {isCreateMode ? t("profile.createSuccess") : t("profile.updateSuccess")}
        </div>
      )}

      {/* Profile Image Upload */}
      <div className="flex justify-center mb-6">
        <ProfileImageUpload
          currentImageUrl={formData.avatar_url}
          onImageUploaded={handleAvatarUploaded}
          isRegistration={isCreateMode}
        />
      </div>

      {/* Personal Information Section */}
      <div className="space-y-1 mb-6">
        <h3 className="text-lg font-semibold text-[#00AEC7]">Personal Information</h3>
        <div className="h-1 w-20 bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="nickname" className="flex items-center">
            {t("profile.nickname")} <span className="text-red-500 ml-1">*</span>
            <div className="ml-auto">
              <NicknameChecker
                nickname={formData.nickname}
                currentUserId={user?.id || ""}
                initialNickname={initialProfile?.nickname}
                onChange={setIsNicknameValid}
              />
            </div>
          </Label>
          <Input
            id="nickname"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            required
            className="border-[#00AEC7]/30 focus-visible:ring-[#FFF32A]/50 focus-visible:border-[#00AEC7]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="first_name">
            {t("profile.firstName")} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
            className="border-[#00AEC7]/30 focus-visible:ring-[#FFF32A]/50 focus-visible:border-[#00AEC7]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">
            {t("profile.lastName")} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
            className="border-[#00AEC7]/30 focus-visible:ring-[#FFF32A]/50 focus-visible:border-[#00AEC7]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="birthday">{t("profile.birthday")}</Label>
          <Input
            id="birthday"
            name="birthday"
            type="date"
            value={formData.birthday}
            onChange={handleChange}
            className="border-[#00AEC7]/30 focus-visible:ring-[#FFF32A]/50 focus-visible:border-[#00AEC7]"
          />
        </div>
        <div className="space-y-2">
          <CityAutocomplete
            value={formData.current_city}
            onChange={handleCityChange}
            required={true}
            label={
              <>
                {t("profile.currentCity")} <span className="text-red-500">*</span>
              </>
            }
          />
        </div>
      </div>

      {/* Professional Information Section */}
      <div className="space-y-1 mt-8 mb-6">
        <h3 className="text-lg font-semibold text-[#00AEC7]">Professional Information</h3>
        <div className="h-1 w-20 bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="university">{t("profile.university")}</Label>
          <Input
            id="university"
            name="university"
            value={formData.university}
            onChange={handleChange}
            className="border-[#00AEC7]/30 focus-visible:ring-[#FFF32A]/50 focus-visible:border-[#00AEC7]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="relevant_company">{t("profile.company")}</Label>
          <Input
            id="relevant_company"
            name="relevant_company"
            value={formData.relevant_company}
            onChange={handleChange}
            className="border-[#00AEC7]/30 focus-visible:ring-[#FFF32A]/50 focus-visible:border-[#00AEC7]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="relevant_position">{t("profile.position")}</Label>
          <Input
            id="relevant_position"
            name="relevant_position"
            value={formData.relevant_position}
            onChange={handleChange}
            className="border-[#00AEC7]/30 focus-visible:ring-[#FFF32A]/50 focus-visible:border-[#00AEC7]"
          />
        </div>
      </div>

      {/* About You Section */}
      <div className="space-y-1 mt-8 mb-6">
        <h3 className="text-lg font-semibold text-[#00AEC7]">About You</h3>
        <div className="h-1 w-20 bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] rounded-full"></div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="about_you">
            {t("profile.aboutYou")} <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="about_you"
            name="about_you"
            value={formData.about_you}
            onChange={handleChange}
            rows={4}
            required
            className="border-[#00AEC7]/30 focus-visible:ring-[#FFF32A]/50 focus-visible:border-[#00AEC7]"
          />
          <p className="text-xs text-muted-foreground">{t("profile.aboutYouMinWords")}</p>
          <WordCounter text={formData.about_you} minWords={10} onChange={setIsAboutYouValid} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="motivation">
            {t("profile.motivation")} <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="motivation"
            name="motivation"
            value={formData.motivation}
            onChange={handleChange}
            rows={4}
            required
            placeholder={t("profile.motivationHint")}
            className="border-[#00AEC7]/30 focus-visible:ring-[#FFF32A]/50 focus-visible:border-[#00AEC7]"
          />
          <p className="text-xs text-muted-foreground">{t("profile.motivationMinWords")}</p>
          <WordCounter text={formData.motivation} minWords={10} onChange={setIsMotivationValid} />
        </div>
      </div>

      {/* Social Links Section */}
      <div className="space-y-1 mt-8 mb-6">
        <h3 className="text-lg font-semibold text-[#00AEC7]">Social Links</h3>
        <div className="h-1 w-20 bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="linkedin">{t("profile.linkedin")}</Label>
          <Input
            id="linkedin"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/username"
            className="border-[#00AEC7]/30 focus-visible:ring-[#FFF32A]/50 focus-visible:border-[#00AEC7]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="other_links">{t("profile.otherLinks")}</Label>
          <Input
            id="other_links"
            name="other_links"
            value={formData.other_links}
            onChange={handleChange}
            placeholder={t("profile.otherLinksPlaceholder")}
            className="border-[#00AEC7]/30 focus-visible:ring-[#FFF32A]/50 focus-visible:border-[#00AEC7]"
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full mt-8 bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] hover:from-[#FFF32A]/90 hover:to-[#00AEC7]/90 text-black font-medium"
        disabled={saving || isOffline}
      >
        {saving ? t("profile.saving") : isCreateMode ? t("profile.createProfile") : t("profile.saveChanges")}
      </Button>
    </form>
  )
}
