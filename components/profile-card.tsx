"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProfileImageUpload } from "@/components/profile-image-upload"
import { useTranslation } from "@/hooks/use-translation"
import { Edit, Eye, MapPin, Calendar, Briefcase, GraduationCap, Heart, Target } from "lucide-react"
import Link from "next/link"

interface ProfileCardProps {
  profile: any
  loading?: boolean
  error?: any
  isPublic?: boolean
  onEditProfile?: () => void
}

export function ProfileCard({ profile, loading, error, isPublic = false, onEditProfile }: ProfileCardProps) {
  const { t } = useTranslation()

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gray-300 rounded-full animate-pulse" />
              <div className="space-y-2">
                <div className="h-6 bg-gray-300 rounded w-48 animate-pulse" />
                <div className="h-4 bg-gray-300 rounded w-32 animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-full animate-pulse" />
              <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>{t("profile.errorLoading")}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!profile) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <p>{t("profile.noProfile")}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <div className="relative overflow-hidden">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%2300AEC7' fillOpacity='0.4'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <CardHeader className="relative z-10 pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-shrink-0">
              {!isPublic ? (
                <ProfileImageUpload
                  currentImageUrl={profile.profile_image_url}
                  onImageUpdate={() => window.location.reload()}
                />
              ) : profile.profile_image_url ? (
                <img
                  src={profile.profile_image_url || "/placeholder.svg"}
                  alt={`${profile.first_name} ${profile.last_name}`}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00AEC7] to-cyan-600 flex items-center justify-center text-white font-bold text-2xl border-4 border-white shadow-lg">
                  {profile.first_name?.[0]?.toUpperCase() || profile.nickname?.[0]?.toUpperCase() || "?"}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <CardTitle className="text-2xl font-bold text-gray-900 mb-1">
                {profile.first_name} {profile.last_name}
              </CardTitle>
              <p className="text-lg text-[#00AEC7] font-medium mb-2">@{profile.nickname}</p>

              <div className="flex flex-wrap gap-2">
                {profile.current_city && (
                  <Badge variant="outline" className="text-xs">
                    <MapPin className="w-3 h-3 mr-1" />
                    {profile.current_city}
                  </Badge>
                )}
                {profile.birth_date && (
                  <Badge variant="outline" className="text-xs">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(profile.birth_date)}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 space-y-6">
          {/* About Section */}
          {profile.about_you && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-[#00AEC7]" />
                {t("profile.aboutYou")}
              </h3>
              <p className="text-gray-700 leading-relaxed">{profile.about_you}</p>
            </div>
          )}

          {/* Motivation Section */}
          {profile.motivation && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                <Target className="w-5 h-5 mr-2 text-[#00AEC7]" />
                {t("profile.motivation")}
              </h3>
              <p className="text-gray-700 leading-relaxed">{profile.motivation}</p>
            </div>
          )}

          {/* Professional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.current_job && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1 flex items-center">
                  <Briefcase className="w-4 h-4 mr-1 text-[#00AEC7]" />
                  {t("profile.currentJob")}
                </h4>
                <p className="text-gray-700 text-sm">{profile.current_job}</p>
              </div>
            )}

            {profile.education && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1 flex items-center">
                  <GraduationCap className="w-4 h-4 mr-1 text-[#00AEC7]" />
                  {t("profile.education")}
                </h4>
                <p className="text-gray-700 text-sm">{profile.education}</p>
              </div>
            )}
          </div>

          {/* Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t("profile.skills")}</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill: string, index: number) => (
                  <Badge key={index} className="bg-[#00AEC7] text-white hover:bg-[#00AEC7]/90">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            {profile.email && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">{t("profile.email")}</h4>
                <p className="text-gray-700 text-sm">{profile.email}</p>
              </div>
            )}

            {profile.phone && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">{t("profile.phone")}</h4>
                <p className="text-gray-700 text-sm">{profile.phone}</p>
              </div>
            )}

            {profile.linkedin && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">LinkedIn</h4>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00AEC7] text-sm hover:underline"
                >
                  {profile.linkedin}
                </a>
              </div>
            )}

            {profile.github && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">GitHub</h4>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00AEC7] text-sm hover:underline"
                >
                  {profile.github}
                </a>
              </div>
            )}
          </div>

          {/* Action Buttons Section */}
          {!isPublic && (
            <div className="pt-4 mt-4 border-t border-gray-200">
              <div className="flex justify-center gap-3">
                {onEditProfile && (
                  <Button size="sm" onClick={onEditProfile} className="bg-[#00AEC7] text-white hover:bg-[#00AEC7]/90">
                    <Edit className="w-4 h-4 mr-2" />
                    {t("profile.editProfile")}
                  </Button>
                )}
                <Link href={`/users/${profile.nickname}`}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-transparent border-[#00AEC7] text-[#00AEC7] hover:bg-[#00AEC7] hover:text-white"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {t("profile.viewProfile")}
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  )
}
