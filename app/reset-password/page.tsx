"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/hooks/use-translation"
import { toast } from "@/components/ui/use-toast"
import { getSupabaseClient } from "@/lib/supabase-client"
import { useRouter, useSearchParams } from "next/navigation"

export default function ResetPassword() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { t } = useTranslation()
  const supabase = getSupabaseClient()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Проверяем, есть ли хэш для сброса пароля в URL
  useEffect(() => {
    // Supabase добавляет параметры в URL после редиректа
    const hasResetParams = searchParams?.has("code")

    if (!hasResetParams) {
      toast({
        title: t("auth.error"),
        description: t("auth.invalidResetLink"),
        variant: "destructive",
      })
    }
  }, [searchParams, t])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError(t("auth.passwordsDoNotMatch"))
      return
    }

    if (password.length < 8) {
      setError(t("auth.passwordTooShort"))
      return
    }

    setLoading(true)

    try {
      // Используем Supabase API для обновления пароля
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        throw error
      }

      setSuccess(true)
      toast({
        title: t("auth.passwordUpdated"),
        description: t("auth.passwordUpdatedDescription"),
      })

      // Перенаправляем на страницу входа после успешного сброса пароля
      setTimeout(() => {
        router.push("/signin")
      }, 2000)
    } catch (err: any) {
      console.error("Error updating password:", err)
      setError(err.message || t("auth.genericError"))
    } finally {
      setLoading(false)
    }
  }

  const gradientBorderStyle = {
    borderWidth: "4px",
    borderStyle: "solid",
    borderImage: "linear-gradient(to right, #FFEB3B, #00AEC7) 1",
  }

  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-8">
      <Card className="w-full max-w-md" style={gradientBorderStyle}>
        <CardHeader>
          <CardTitle className="text-[#00AEC7]">{t("auth.resetPassword")}</CardTitle>
          <CardDescription>{t("auth.resetPasswordDescription")}</CardDescription>
        </CardHeader>
        {success ? (
          <CardContent className="space-y-4">
            <p className="text-center text-[#00AEC7] font-medium">{t("auth.passwordUpdated")}</p>
            <p className="text-center text-sm text-muted-foreground">{t("auth.redirectingToSignIn")}</p>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">{t("auth.newPassword")}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-[#00AEC7]/30 focus-visible:ring-[#FFEB3B]/50 focus-visible:border-[#00AEC7]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">{t("auth.confirmPassword")}</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="border-[#00AEC7]/30 focus-visible:ring-[#FFEB3B]/50 focus-visible:border-[#00AEC7]"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full bg-[#00AEC7] hover:bg-[#00AEC7]/90 text-white" disabled={loading}>
                {loading ? t("auth.updating") : t("auth.updatePassword")}
              </Button>
              <div className="text-center text-sm">
                <Link href="/signin" className="text-[#00AEC7] hover:underline">
                  {t("auth.backToSignIn")}
                </Link>
              </div>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  )
}
