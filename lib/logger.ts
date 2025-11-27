type LogLevel = "info" | "warn" | "error"

type Logger = Record<LogLevel, (message: string, details?: any) => void>

const formatPayload = (details?: any) => {
  if (details === undefined) return []
  return [details]
}

export const createLogger = (namespace: string): Logger => {
  const prefix = `[${namespace}]`

  return {
    info: (message, details) => console.info(prefix, message, ...formatPayload(details)),
    warn: (message, details) => console.warn(prefix, message, ...formatPayload(details)),
    error: (message, details) => console.error(prefix, message, ...formatPayload(details)),
  }
}
