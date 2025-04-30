// Google Analytics Measurement ID
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ""

// Check if analytics should be enabled
export const isAnalyticsEnabled = () => {
  // Enable analytics only in production and when measurement ID is available
  return process.env.NODE_ENV === "production" && GA_MEASUREMENT_ID !== ""
}
