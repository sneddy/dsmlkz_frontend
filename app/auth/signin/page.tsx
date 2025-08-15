"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { useTranslation } from "@/hooks/use-translation"
import { AuthGuard } from "@/features/auth/auth_guard"
import { Spinner } from "@/components/ui/spinner"
import { EmailVerificationDialog } from "@/features/auth/email_verification_dialog"

export const dynamic = "force-dynamic"

export default function SignInPage() {
  return (
    <AuthGuard requireAuth={false}>
      <SignIn />
    </AuthGuard>
  )
}

function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showVerificationDialog, setShowVerificationDialog] = useState(false)
  const [unverifiedEmail, setUnverifiedEmail] = useState("")
  const { signIn, loading, initialized } = useAuth()
  const router = useRouter()
  const { t } = useTranslation()

  const gradientBorderStyle = {
    borderWidth: "4px",
    borderStyle: "solid",
    borderImage: "linear-gradient(to right, #FFEB3B, #00AEC7) 1",
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const { error } = await signIn(email, password)
      if (error) {
        console.log("Sign in error:", error.message) // Добавляем логирование для отладки

        // Улучшенная обработка ошибок с более широким охватом возможных сообщений
        if (
          error.message?.includes("Invalid login credentials") ||
          error.message?.includes("Invalid email or password")
        ) {
          setError(t("auth.invalidCredentials"))
        } else if (
          error.message?.toLowerCase().includes("email not confirmed") ||
          error.message?.toLowerCase().includes("email not verified") ||
          error.message?.toLowerCase().includes("not confirmed") ||
          error.message?.toLowerCase().includes("not verified") ||
          error.message?.toLowerCase().includes("confirm your email") ||
          error.message?.toLowerCase().includes("verification")
        ) {
          // Сохраняем email и показываем диалог подтверждения
          setUnverifiedEmail(email)
          setShowVerificationDialog(true)
          setError(t("auth.emailNotVerified"))
        } else if (error.message?.includes("user not found") || error.message?.includes("Invalid user")) {
          setError(t("auth.userNotFound"))
        } else {
          setError(error.message || t("auth.genericError"))
        }
        setIsSubmitting(false)
        return
      }

      // Успешный вход, редирект будет выполнен через AuthGuard
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || t("auth.genericError"))
      setIsSubmitting(false)
    }
  }

  // Если инициализация не завершена, показываем загрузку
  if (!initialized) {
    return (
      <div className="container flex items-center justify-center min-h-[80vh] py-8">
        <Card className="w-full max-w-md" style={gradientBorderStyle}>
          <CardContent className="p-6 text-center">
            <Spinner size="lg" className="mx-auto mb-4" />
            <p>{t("auth.checkingSession")}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-8">
      <Card className="w-full max-w-md" style={gradientBorderStyle}>
        <CardHeader>
          <CardTitle className="text-[#00AEC7]">{t("auth.signIn")}</CardTitle>
          <CardDescription>{t("auth.signInDescription")}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && <div className="p-3 text-sm text-white bg-red-500 rounded-md">{error}</div>}
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting || loading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t("auth.password")}</Label>
                <Link href="/auth/forgot-password" className="text-xs text-[#00AEC7] hover:underline">
                  {t("auth.forgotPassword")}
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting || loading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-[#00AEC7] hover:bg-[#00AEC7]/90 text-white"
              disabled={isSubmitting || loading}
            >
              {isSubmitting || loading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  {t("auth.signingIn")}
                </>
              ) : (
                t("auth.signIn")
              )}
            </Button>
            <div className="text-center text-sm">
              {t("auth.noAccount")}{" "}
              <Link href="/auth/signup" className="text-[#00AEC7] hover:underline">
                {t("auth.signUpLink")}
              </Link>
            </div>
          </CardFooter>
        </form>
        <EmailVerificationDialog
          email={unverifiedEmail}
          open={showVerificationDialog}
          onOpenChange={setShowVerificationDialog}
          onClose={() => {
            setShowVerificationDialog(false)
            setEmail("")
            setPassword("")
          }}
        />
      </Card>
    </div>
  )
}
