"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, AlertCircle } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import { EmailVerificationDialog } from "@/features/auth/email_verification_dialog"

export default function EmailVerificationPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const type = searchParams.get("type") || "new"
  const [showDialog, setShowDialog] = useState(true)

  const gradientBorderStyle = {
    borderWidth: "4px",
    borderStyle: "solid",
    borderImage: "linear-gradient(to right, #FFEB3B, #00AEC7) 1",
  }

  const handleClose = () => {
    setShowDialog(false)
    router.push("/auth/signin")
  }

  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-8">
      <Card className="w-full max-w-md" style={gradientBorderStyle}>
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#00AEC7]/10">
            <Mail className="h-8 w-8 text-[#00AEC7]" />
          </div>
          <CardTitle className="text-center text-[#00AEC7]">{t("auth.verifyYourEmail")}</CardTitle>
          <CardDescription className="text-center">
            {type === "existing" ? t("auth.universalVerificationMessage") : t("auth.verificationRequired")}
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
          <Button
            onClick={() => router.push("/auth/signin")}
            className="w-full bg-[#00AEC7] hover:bg-[#00AEC7]/90 text-white"
          >
            {t("auth.backToSignIn")}
          </Button>
        </CardContent>
      </Card>

      <EmailVerificationDialog email={email} open={showDialog} onOpenChange={setShowDialog} onClose={handleClose} />
    </div>
  )
}
