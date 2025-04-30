"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, AlertCircle, ArrowRight, RefreshCw } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import Link from "next/link"
import { getSupabaseClient } from "@/lib/supabase-client"
import { toast } from "@/components/ui/use-toast"

export default function EmailVerificationPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const router = useRouter()
  const { t } = useTranslation()
  const [resending, setResending] = useState(false)

  // Добавляем состояние для отслеживания типа верификации
  const type = searchParams.get("type") || "new"
  const [showResendButton, setShowResendButton] = useState(true)

  // Добавляем эффект для отображения соответствующего сообщения в зависимости от типа
  useEffect(() => {
    // Если это существующий пользователь, показываем универсальное сообщение
    if (type === "existing") {
      toast({
        title: t("auth.verifyYourEmail"),
        description: t("auth.universalVerificationMessage"),
      })
    } else {
      // Для новых пользователей показываем стандартное сообщение
      toast({
        title: t("auth.verifyYourEmail"),
        description: t("auth.verificationSent"),
      })
    }
  }, [type, t])

  // Добавим отладочный вывод для проверки получения email
  useEffect(() => {
    console.log("Email verification page loaded with email:", email)
    console.log("Verification type:", type)
  }, [email, type])

  // Также добавим проверку на наличие email в URL
  useEffect(() => {
    if (!email) {
      console.warn("No email provided in URL parameters")
    }
  }, [email])

  const gradientBorderStyle = {
    borderWidth: "4px",
    borderStyle: "solid",
    borderImage: "linear-gradient(to right, #FFEB3B, #00AEC7) 1",
  }

  const handleResendEmail = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: t("auth.emailRequired"),
        variant: "destructive",
      })
      return
    }

    setResending(true)
    try {
      const supabase = getSupabaseClient()

      // Если тип existing, отправляем ссылку для сброса пароля
      // Если тип new, отправляем ссылку для подтверждения email
      if (type === "existing") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.resend({
          type: "signup",
          email,
        })
        if (error) throw error
      }

      toast({
        title: t("auth.emailResent"),
        description: t("auth.checkEmailAgain"),
      })
    } catch (error: any) {
      console.error("Error resending email:", error)
      toast({
        title: "Error",
        description: error.message || t("auth.genericError"),
        variant: "destructive",
      })
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-8">
      <Card className="w-full max-w-md" style={gradientBorderStyle}>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#00AEC7]/10">
            <Mail className="h-8 w-8 text-[#00AEC7]" />
          </div>
          <CardTitle className="text-[#00AEC7]">{t("auth.verifyYourEmail")}</CardTitle>
          <CardDescription>
            {/* Универсальное сообщение, не раскрывающее информацию о существовании аккаунта */}
            {t("auth.universalVerificationMessage")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-[#FFEB3B]/10 p-4">
            <div className="flex items-start">
              <AlertCircle className="mr-2 h-5 w-5 text-[#FFEB3B]" />
              <div>
                <p className="text-sm font-medium">{t("auth.verificationInstructions")}</p>
                {email && <p className="mt-1 text-sm font-bold break-all">{email}</p>}
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>{t("auth.verificationNote")}</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            className="w-full bg-[#00AEC7] hover:bg-[#00AEC7]/90 text-white"
            onClick={handleResendEmail}
            disabled={resending}
          >
            {resending ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                {t("auth.resendingEmail")}
              </>
            ) : (
              <>{t("auth.resendVerificationEmail")}</>
            )}
          </Button>

          <div className="flex justify-between w-full">
            <Link href="/signin">
              <Button variant="ghost" size="sm">
                {t("auth.backToSignIn")}
              </Button>
            </Link>

            <Link href="/">
              <Button variant="outline" size="sm" className="flex items-center">
                {t("auth.goToHome")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
