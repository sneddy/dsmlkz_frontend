"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/hooks/use-translation"
import { getSupabaseClient } from "@/lib/supabase-client"
import { toast } from "@/shared/lib/hooks/use-toast"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()

  const gradientBorderStyle = {
    borderWidth: "4px",
    borderStyle: "solid",
    borderImage: "linear-gradient(to right, #FFEB3B, #00AEC7) 1",
  }

  useEffect(() => {
    // Check if we have the necessary tokens in the URL
    const accessToken = searchParams.get("access_token")
    const refreshToken = searchParams.get("refresh_token")

    if (!accessToken || !refreshToken) {
      setError(t("auth.invalidResetLink"))
    }
  }, [searchParams, t])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (password !== confirmPassword) {
      setError(t("auth.passwordsDoNotMatch"))
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError(t("auth.passwordTooShort"))
      setLoading(false)
      return
    }

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) {
        setError(error.message)
      } else {
        toast({
          title: t("auth.passwordUpdated"),
          description: t("auth.passwordUpdatedDescription"),
        })

        setTimeout(() => {
          router.push("/auth/signin")
        }, 2000)
      }
    } catch (error: any) {
      setError(error.message || t("auth.genericError"))
    } finally {
      setLoading(false)
    }
  }

  if (error && error === t("auth.invalidResetLink")) {
    return (
      <div className="container flex items-center justify-center min-h-[80vh] py-8">
        <Card className="w-full max-w-md" style={gradientBorderStyle}>
          <CardHeader>
            <CardTitle className="text-destructive">{t("auth.error")}</CardTitle>
            <CardDescription>{t("auth.invalidResetLink")}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              onClick={() => router.push("/auth/forgot-password")}
              className="w-full bg-[#00AEC7] hover:bg-[#00AEC7]/90 text-white"
            >
              {t("auth.sendResetLink")}
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-8">
      <Card className="w-full max-w-md" style={gradientBorderStyle}>
        <CardHeader>
          <CardTitle className="text-[#00AEC7]">{t("auth.resetPassword")}</CardTitle>
          <CardDescription>{t("auth.resetPasswordDescription")}</CardDescription>
        </CardHeader>
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
                disabled={loading}
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
                disabled={loading}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-[#00AEC7] hover:bg-[#00AEC7]/90 text-white" disabled={loading}>
              {loading ? t("auth.updating") : t("auth.updatePassword")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
