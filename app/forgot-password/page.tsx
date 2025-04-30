"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/hooks/use-translation"
import { toast } from "@/components/ui/use-toast"
import { getSupabaseClient } from "@/lib/supabase-client"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()
  const supabase = getSupabaseClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Используем напрямую Supabase API для сброса пароля
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        throw error
      }

      setSubmitted(true)
      toast({
        title: t("auth.resetLinkSent"),
        description: t("auth.checkEmail"),
      })
    } catch (error: any) {
      console.error("Error sending reset link:", error)
      toast({
        title: t("auth.error"),
        description: error.message || t("auth.genericError"),
        variant: "destructive",
      })
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
          <CardTitle className="text-[#00AEC7]">{t("auth.forgotPassword")}</CardTitle>
          <CardDescription>{t("auth.forgotPasswordDescription")}</CardDescription>
        </CardHeader>
        {submitted ? (
          <CardContent className="space-y-4">
            <div className="bg-[#00AEC7]/10 p-4 rounded-md border border-[#00AEC7]/30">
              <p className="text-center text-[#00AEC7] font-medium mb-2">{t("auth.resetLinkSent")}</p>
              <p className="text-center text-sm text-muted-foreground mb-3">{t("auth.checkEmail")}</p>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
                <li>{t("auth.checkInboxAndSpam")}</li>
                <li>{t("auth.linkValidFor24Hours")}</li>
                <li>{t("auth.noEmailRequestNewLink")}</li>
              </ul>
            </div>
            <div className="text-center">
              <Link href="/signin" className="text-[#00AEC7] hover:underline text-sm">
                {t("auth.backToSignIn")}
              </Link>
            </div>
          </CardContent>
        ) : (
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
                  className="border-[#00AEC7]/30 focus-visible:ring-[#FFEB3B]/50 focus-visible:border-[#00AEC7]"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full bg-[#00AEC7] hover:bg-[#00AEC7]/90 text-white" disabled={loading}>
                {loading ? t("auth.sending") : t("auth.sendResetLink")}
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
