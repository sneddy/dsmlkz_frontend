"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

// Use the environment variable
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ""

declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
    __gaUserId?: string
  }
}

export const isGaEnabled = Boolean(GA_MEASUREMENT_ID)

export function trackGaEvent(eventName: string, params: Record<string, any> = {}) {
  if (!isGaEnabled || typeof window === "undefined") return

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params)
    return
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: eventName, ...params })
  }
}

export function trackGaPageView(pagePath: string, params: Record<string, any> = {}) {
  trackGaEvent("page_view", {
    page_path: pagePath,
    ...params,
  })
}

export function trackGaUser(userId?: string) {
  if (!isGaEnabled || typeof window === "undefined") return
  if (!userId) return
  window.__gaUserId = userId
  if (typeof window.gtag === "function") {
    window.gtag("config", GA_MEASUREMENT_ID, { user_id: userId })
  }
}

function getPageTitle() {
  if (typeof document === "undefined") return undefined
  return document.title || undefined
}

export function GoogleAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Skip if no measurement ID is available
    if (!GA_MEASUREMENT_ID) return

    // Add Google Analytics script
    const script1 = document.createElement("script")
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
    script1.async = true
    document.head.appendChild(script1)

    // Initialize gtag
    const script2 = document.createElement("script")
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}', {
        page_path: window.location.pathname,
        page_title: document.title || undefined,
        send_page_view: false,
        user_id: window.__gaUserId || undefined
      });
    `
    document.head.appendChild(script2)

    return () => {
      // Clean up
      if (script1.parentNode) document.head.removeChild(script1)
      if (script2.parentNode) document.head.removeChild(script2)
    }
  }, [])

  // Track page views when route changes
  useEffect(() => {
    if (!GA_MEASUREMENT_ID || typeof window.gtag !== "function") return
    if (!searchParams) return

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "")

    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
      page_title: getPageTitle(),
      ...(window.__gaUserId ? { user_id: window.__gaUserId } : {}),
    })
  }, [pathname, searchParams])

  return null
}
