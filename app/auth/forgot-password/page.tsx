"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/hooks/use-translation"
import { getSupabaseClient } from "@/lib/supabase-client"
import { toast } from "@/shared/lib/hooks/use-toast"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { t } = useTranslation()

  const gradientBorderStyle = {
    borderWidth: "4px",
    borderStyle: "solid",
    borderImage: "linear-gradient(to right, #FFEB3B, #00AEC7) 1",
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      } else {
        setSent(true)
        toast({
          title: t("auth.resetLinkSent"),
          description: t("auth.checkEmail"),
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || t("auth.genericError"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="container flex items-center justify-center min-h-[80vh] py-8">
        <Card className="w-full max-w-md" style={gradientBorderStyle}>
          <CardHeader>
            <CardTitle className="text-[#00AEC7]">{t("auth.resetLinkSent")}</CardTitle>
            <CardDescription>{t("auth.checkEmail")}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/auth/new-signin" className="w-full">
              <Button className="w-full bg-[#00AEC7] hover:bg-[#00AEC7]/90 text-white">{t("auth.backToSignIn")}</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-8">
      <Card className="w-full max-w-md" style={gradientBorderStyle}>
        <CardHeader>
          <CardTitle className="text-[#00AEC7]">{t("auth.forgotPassword")}</CardTitle>
          <CardDescription>{t("auth.forgotPasswordDescription")}</CardDescription>
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
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-[#00AEC7] hover:bg-[#00AEC7]/90 text-white" disabled={loading}>
              {loading ? t("auth.sending") : t("auth.sendResetLink")}
            </Button>
            <Link href="/auth/new-signin" className="text-sm text-[#00AEC7] hover:underline">
              {t("auth.backToSignIn")}
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
