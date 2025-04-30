"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Mail, RefreshCw, AlertCircle } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import { getSupabaseClient } from "@/lib/supabase-client"
import { toast } from "@/components/ui/use-toast"

interface EmailVerificationDialogProps {
  email: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
}

export function EmailVerificationDialog({ email, open, onOpenChange, onClose }: EmailVerificationDialogProps) {
  const { t } = useTranslation()
  const [resending, setResending] = useState(false)

  // Добавим отладочный вывод для проверки открытия диалога
  useEffect(() => {
    console.log("Email verification dialog open state:", open)
    console.log("Email in verification dialog:", email)
  }, [open, email])

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
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      })

      if (error) {
        throw error
      }

      toast({
        title: t("auth.emailResent"),
        description: t("auth.checkEmailAgain"),
      })
    } catch (error: any) {
      console.error("Error resending verification email:", error)
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-2 border-[#00AEC7]">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#00AEC7]/10">
            <Mail className="h-8 w-8 text-[#00AEC7]" />
          </div>
          <DialogTitle className="text-center text-[#00AEC7]">{t("auth.verifyYourEmail")}</DialogTitle>
          <DialogDescription className="text-center">{t("auth.verificationRequired")}</DialogDescription>
        </DialogHeader>

        <div className="rounded-md bg-[#FFEB3B]/10 p-4">
          <div className="flex items-start">
            <AlertCircle className="mr-2 h-5 w-5 text-[#FFEB3B]" />
            <div>
              <p className="text-sm font-medium">{t("auth.verificationInstructions")}</p>
              {email && <p className="mt-1 text-sm font-bold break-all">{email}</p>}
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-4">
          <Button variant="outline" onClick={onClose} className="sm:flex-1">
            {t("auth.tryAnotherAccount")}
          </Button>

          <Button
            className="sm:flex-1 bg-[#00AEC7] hover:bg-[#00AEC7]/90 text-white"
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
