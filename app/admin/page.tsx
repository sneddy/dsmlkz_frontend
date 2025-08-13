"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/shared/lib/hooks/use-toast"
import { useTranslation } from "@/hooks/use-translation"
import { getSupabaseClient } from "@/lib/supabase-client"

export default function AdminPage() {
  const [adminProfiles, setAdminProfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { user, profile } = useAuth()
  const router = useRouter()
  const { t } = useTranslation()
  const supabase = getSupabaseClient()

  // Admin emails - in a real app, this would be stored in a database
  const adminEmails = ["admin@dsml.kz"]

  useEffect(() => {
    if (!loading && (!user || !adminEmails.includes(user.email))) {
      router.push("/")
      toast({
        title: "Access Denied",
        description: "You do not have permission to access this page.",
        variant: "destructive",
      })
    } else if (user) {
      fetchProfiles()
    }
  }, [user, loading, router])

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      setAdminProfiles(data || [])
      setLoading(false)
    } catch (error) {
      console.error("Error fetching profiles:", error)
      toast({
        title: "Error",
        description: "Failed to load profiles. Please try again later.",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  const handleVerifyProfile = async (profileId: string) => {
    try {
      const { error } = await supabase.from("profiles").update({ is_verified: true }).eq("id", profileId)

      if (error) {
        throw error
      }

      toast({
        title: "Success",
        description: "Profile verified successfully.",
      })

      // Refresh profiles
      fetchProfiles()
    } catch (error) {
      console.error("Error verifying profile:", error)
      toast({
        title: "Error",
        description: "Failed to verify profile. Please try again later.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!user || !adminEmails.includes(user.email)) {
    return null
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <Tabs defaultValue="profiles" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="profiles">Profiles</TabsTrigger>
          <TabsTrigger value="debug">Debug</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="profiles">
          <Card>
            <CardHeader>
              <CardTitle>User Profiles</CardTitle>
              <CardDescription>Manage user profiles in the DSML Kazakhstan community.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Recent Profiles</h3>
                  <p className="text-sm text-muted-foreground">Total: {adminProfiles.length}</p>
                </div>

                <div className="border rounded-md">
                  <div className="grid grid-cols-5 gap-4 p-4 font-medium border-b">
                    <div>Name</div>
                    <div>Email</div>
                    <div>Joined</div>
                    <div>Status</div>
                    <div>Actions</div>
                  </div>
                  <div className="divide-y">
                    {adminProfiles.slice(0, 10).map((profile) => (
                      <div key={profile.id} className="grid grid-cols-5 gap-4 p-4">
                        <div>
                          {profile.first_name} {profile.last_name}
                          <div className="text-xs text-muted-foreground">@{profile.nickname}</div>
                        </div>
                        <div className="text-sm">{profile.email}</div>
                        <div className="text-sm">{new Date(profile.created_at).toLocaleDateString()}</div>
                        <div>
                          {profile.is_verified ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                          )}
                        </div>
                        <div>
                          <Button
                            size="sm"
                            variant={profile.is_verified ? "outline" : "default"}
                            onClick={() => handleVerifyProfile(profile.id)}
                            disabled={profile.is_verified}
                          >
                            {profile.is_verified ? "Verified" : "Verify"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="debug">
          <Card>
            <CardHeader>
              <CardTitle>Debug Tools</CardTitle>
              <CardDescription>Tools for debugging and testing the platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Environment</h3>
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-md">
                  <div>
                    <p className="text-sm font-medium">Supabase URL:</p>
                    <p className="text-xs text-muted-foreground break-all">{process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Auth Status:</p>
                    <p className="text-xs text-muted-foreground">{user ? "Authenticated" : "Not Authenticated"}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Test Notifications</h3>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "Success Notification",
                        description: "This is a test success notification.",
                      })
                    }}
                  >
                    Success Toast
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "Error Notification",
                        description: "This is a test error notification.",
                        variant: "destructive",
                      })
                    }}
                  >
                    Error Toast
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Clear Local Storage</h3>
                <Button
                  variant="outline"
                  onClick={() => {
                    localStorage.clear()
                    toast({
                      title: "Local Storage Cleared",
                      description: "All local storage data has been cleared.",
                    })
                  }}
                >
                  Clear Storage
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>Configure global settings for the DSML Kazakhstan platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Registration</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="registration-open">Open Registration</Label>
                    <p className="text-sm text-muted-foreground">Allow new users to register on the platform</p>
                  </div>
                  <Switch id="registration-open" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-verification">Email Verification</Label>
                    <p className="text-sm text-muted-foreground">Require email verification for new accounts</p>
                  </div>
                  <Switch id="email-verification" defaultChecked />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Content</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="telegram-integration">Telegram Integration</Label>
                    <p className="text-sm text-muted-foreground">Enable Telegram feed integration</p>
                  </div>
                  <Switch id="telegram-integration" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="job-listings">Job Listings</Label>
                    <p className="text-sm text-muted-foreground">Enable job listings section</p>
                  </div>
                  <Switch id="job-listings" defaultChecked />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Telegram Bot Token</h3>
                <div className="space-y-2">
                  <Label htmlFor="bot-token">Bot Token</Label>
                  <Input id="bot-token" type="password" placeholder="Enter Telegram bot token" />
                  <p className="text-xs text-muted-foreground">Used for fetching posts from Telegram channels</p>
                </div>
                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
