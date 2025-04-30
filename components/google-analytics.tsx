"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

// Use the environment variable
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ""

declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}

export function GoogleAnalytics() {
  const pathname = usePathname()
  // We're not using searchParams directly in this component's render
  // so it's safe to use it this way, but we'll handle it properly anyway
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
        send_page_view: false
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
    if (!searchParams) return // Guard against searchParams being null

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "")

    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    })
  }, [pathname, searchParams])

  return null
}

// Helper function to track custom events
export function trackEvent(action: string, category: string, label: string, value?: number) {
  if (!GA_MEASUREMENT_ID || typeof window.gtag !== "function") return

  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}
