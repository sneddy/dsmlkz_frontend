// Maximum number of retries for fetch operations
export const MAX_RETRIES = 3

// Delay between retries in milliseconds
export const RETRY_DELAY = 1000

// Delay after profile update before fetching again
export const PROFILE_UPDATE_DELAY = 1000

// Debug mode flag
export const DEBUG = process.env.NODE_ENV === "development"
