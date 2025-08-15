"use client"

export const dynamic = "force-dynamic"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/hooks/use-translation"
import { useRouter } from "next/navigation"

export default function SignUp() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [status, setStatus] = useState("")
  const { signUp, loading, user } = useAuth()
  const { t } = useTranslation()
  const router = useRouter()

  const gradientBorderStyle = {
    borderWidth: "4px",
    borderStyle: "solid",
    borderImage: "linear-gradient(to right, #FFEB3B, #00AEC7) 1",
  }

  useEffect(() => {
    if (user) {
      setStatus(t("auth.alreadySignedIn"))
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    }
  }, [user, router, t])

  // Изменим обработчик отправки формы, чтобы использовать универсальное сообщение
  // и не раскрывать информацию о существовании аккаунта

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setStatus("")

    if (password !== confirmPassword) {
      setError(t("auth.passwordsDoNotMatch"))
      return
    }

    if (password.length < 8) {
      setError(t("auth.passwordTooShort"))
      return
    }

    try {
      setStatus(t("auth.processingSignIn"))
      const { error: signUpError, data } = await signUp(email, password)

      if (signUpError) {
        // Вместо показа конкретной ошибки о существовании пользователя,
        // используем универсальное сообщение
        if (
          signUpError.message?.includes("already registered") ||
          signUpError.message?.includes("already exists") ||
          signUpError.message?.includes("already in use") ||
          signUpError.message?.includes("User already registered")
        ) {
          router.push(`/auth/email-verification?email=${encodeURIComponent(email)}&type=existing`)
          return
        } else {
          // Для других ошибок показываем обычное сообщение
          setError(signUpError.message || t("auth.genericError"))
          setStatus("")
          return
        }
      }

      // Всегда перенаправляем на страницу подтверждения email после регистрации
      setStatus(t("auth.checkEmail"))

      // Добавляем небольшую задержку перед перенаправлением, чтобы пользователь увидел статус
      setTimeout(() => {
        router.push(`/auth/email-verification?email=${encodeURIComponent(email)}&type=new`)
      }, 1000)
    } catch (err: any) {
      console.error("Signup error:", err)
      setError(err.message || t("auth.genericError"))
      setStatus("")
    }
  }

  if (user) {
    return (
      <div className="container flex items-center justify-center min-h-[80vh] py-8">
        <Card className="w-full max-w-md" style={gradientBorderStyle}>
          <CardContent className="pt-6">
            <p className="text-center">{t("auth.alreadySignedIn")}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-8">
      <Card className="w-full max-w-md" style={gradientBorderStyle}>
        <CardHeader>
          <CardTitle className="text-[#00AEC7]">{t("auth.signUp")}</CardTitle>
          <CardDescription>{t("auth.signUpDescription")}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.password")}</Label>
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
            {status && (
              <div className="text-sm text-center p-2 bg-primary/10 rounded-md">
                <p className="text-primary font-medium">{status}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-[#00AEC7] hover:bg-[#00AEC7]/90 text-white" disabled={loading}>
              {loading ? t("auth.signingUp") : t("auth.signUp")}
            </Button>
            <div className="text-center text-sm">
              {t("auth.haveAccount")}{" "}
              <Link href="/auth/new-signin" className="text-[#00AEC7] hover:underline">
                {t("auth.signInLink")}
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
