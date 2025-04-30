"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/hooks/use-translation"

export default function PostSignUp() {
  const [formData, setFormData] = useState({
    nickname: "",
    first_name: "",
    last_name: "",
    current_city: "",
    university: "",
    relevant_company: "",
    relevant_position: "",
    about_you: "",
    motivation: "",
    linkedin: "",
    other_links: "",
  })
  const { user, updateProfile, loading } = useAuth()
  const router = useRouter()
  const { t } = useTranslation()

  // Redirect if not logged in
  if (!user) {
    router.push("/signin")
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateProfile({
      ...formData,
      email: user.email,
    })
    router.push("/profile")
  }

  return (
    <div className="container py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{t("profile.completeProfile")}</CardTitle>
          <CardDescription>{t("profile.completeProfileDescription")}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nickname">{t("profile.nickname")} *</Label>
                <Input id="nickname" name="nickname" value={formData.nickname} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="first_name">{t("profile.firstName")} *</Label>
                <Input id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">{t("profile.lastName")} *</Label>
                <Input id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current_city">{t("profile.currentCity")}</Label>
                <Input id="current_city" name="current_city" value={formData.current_city} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="university">{t("profile.university")}</Label>
                <Input id="university" name="university" value={formData.university} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="relevant_company">{t("profile.company")}</Label>
                <Input
                  id="relevant_company"
                  name="relevant_company"
                  value={formData.relevant_company}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="relevant_position">{t("profile.position")}</Label>
                <Input
                  id="relevant_position"
                  name="relevant_position"
                  value={formData.relevant_position}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">{t("profile.linkedin")}</Label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="about_you">{t("profile.aboutYou")}</Label>
              <Textarea id="about_you" name="about_you" value={formData.about_you} onChange={handleChange} rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="motivation">{t("profile.motivation")}</Label>
              <Textarea
                id="motivation"
                name="motivation"
                value={formData.motivation}
                onChange={handleChange}
                rows={3}
                placeholder={t("profile.motivationPlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="other_links">{t("profile.otherLinks")}</Label>
              <Textarea
                id="other_links"
                name="other_links"
                value={formData.other_links}
                onChange={handleChange}
                rows={2}
                placeholder={t("profile.otherLinksPlaceholder")}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t("profile.saving") : t("profile.saveProfile")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
