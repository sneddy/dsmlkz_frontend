"use client"

export const dynamic = "force-dynamic"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import { useAuth } from "@/contexts/auth-context"

export default function PostSignupPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { user } = useAuth()

  const gradientBorderStyle = {
    borderWidth: "4px",
    borderStyle: "solid",
    borderImage: "linear-gradient(to right, #FFEB3B, #00AEC7) 1",
  }

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-8">
      <Card className="w-full max-w-md" style={gradientBorderStyle}>
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#00AEC7]/10">
            <CheckCircle className="h-8 w-8 text-[#00AEC7]" />
          </div>
          <CardTitle className="text-center text-[#00AEC7]">{t("auth.signUpSuccess")}</CardTitle>
          <CardDescription className="text-center">{t("auth.checkEmail")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-[#FFEB3B]/10 p-4">
            <p className="text-sm text-center">{t("auth.verificationNote")}</p>
          </div>
          <Button
            onClick={() => router.push("/auth/signin")}
            className="w-full bg-[#00AEC7] hover:bg-[#00AEC7]/90 text-white"
          >
            {t("auth.backToSignIn")}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
