"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Spinner } from "@/components/ui/spinner"

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  requireAuth?: boolean // Если true, требуется аутентификация, если false - требуется отсутствие аутентификации
}

export function AuthGuard({ children, fallback, requireAuth = true }: AuthGuardProps) {
  const { user, loading, initialized } = useAuth()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    // Только выполняем редирект, если инициализация завершена и не выполняется уже редирект
    if (initialized && !isRedirecting && !loading) {
      if (requireAuth && !user) {
        // Пользователь не аутентифицирован, но требуется аутентификация
        setIsRedirecting(true)
        router.push("/signin")
      } else if (!requireAuth && user) {
        // Пользователь аутентифицирован, но требуется отсутствие аутентификации
        setIsRedirecting(true)
        router.push("/dashboard")
      }
    }
  }, [user, initialized, requireAuth, router, isRedirecting, loading])

  // Показываем загрузку, если инициализация не завершена или идет загрузка
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

  // Если requireAuth=true и пользователь не аутентифицирован, или
  // если requireAuth=false и пользователь аутентифицирован, показываем fallback
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

  // В противном случае показываем дочерние компоненты
  return <>{children}</>
}
