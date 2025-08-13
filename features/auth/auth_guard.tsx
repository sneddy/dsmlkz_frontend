"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Spinner } from "@/components/ui/spinner"

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  requireAuth?: boolean
}

export function AuthGuard({ children, fallback, requireAuth = true }: AuthGuardProps) {
  const { user, loading, initialized } = useAuth()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    if (initialized && !isRedirecting && !loading) {
      if (requireAuth && !user) {
        setIsRedirecting(true)
        router.push("/auth/signin")
      } else if (!requireAuth && user) {
        setIsRedirecting(true)
        router.push("/dashboard")
      }
    }
  }, [user, initialized, requireAuth, router, isRedirecting, loading])

  if (loading || !initialized || isRedirecting) {
    return (
      fallback || (
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner size="lg" />
          <p className="ml-2 text-muted-foreground">Loading...</p>
        </div>
      )
    )
  }

  if ((requireAuth && !user) || (!requireAuth && user)) {
    return (
      fallback || (
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner size="lg" />
          <p className="ml-2 text-muted-foreground">Redirecting...</p>
        </div>
      )
    )
  }

  return <>{children}</>
}
