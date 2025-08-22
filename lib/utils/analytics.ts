// Аналитика - экспортируем существующий файл
export * from '../analytics'

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, properties)
  }
}

export const trackPageView = (url: string) => {
  trackEvent('page_view', { page_location: url })
}

export const trackSearch = (query: string, resultsCount: number) => {
  trackEvent('search', { 
    search_term: query, 
    results_count: resultsCount 
  })
}
