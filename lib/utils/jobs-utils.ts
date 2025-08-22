// Утилиты для jobs - создаем новый файл с реальными утилитами

// Типы для возвращаемых значений
export interface TruncatedText {
  text: string
  truncated: boolean
}

export interface ChannelInfo {
  type: string
  bgColor: string
  color: string
  borderColor: string
}

export interface JobValidationResult {
  isValid: boolean
  errors: string[]
}

export const formatJobDate = (date: string) => {
  return new Date(date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const formatJobSalary = (salary: string) => {
  return salary || 'По договоренности'
}

export const getJobExperience = (experience: string) => {
  const experienceMap: Record<string, string> = {
    'entry': 'Начинающий',
    'junior': 'Junior',
    'middle': 'Middle',
    'senior': 'Senior',
    'lead': 'Lead',
    'architect': 'Архитектор'
  }
  return experienceMap[experience] || experience
}

export const validateJobData = (jobData: any): JobValidationResult => {
  const errors: string[] = []
  
  if (!jobData.title) errors.push('Название вакансии обязательно')
  if (!jobData.company) errors.push('Название компании обязательно')
  if (!jobData.description) errors.push('Описание обязательно')
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Функция обрезки текста вакансии
export const truncateJobText = (htmlText: string, maxLength: number = 200): TruncatedText => {
  if (!htmlText) return { text: '', truncated: false }
  
  // Убираем HTML теги
  const plainText = htmlText.replace(/<[^>]*>/g, '')
  
  if (plainText.length <= maxLength) {
    return { text: plainText, truncated: false }
  }
  
  // Обрезаем текст до максимальной длины
  const truncatedText = plainText.substring(0, maxLength).trim()
  
  // Ищем последний пробел, чтобы не обрезать слово посередине
  const lastSpaceIndex = truncatedText.lastIndexOf(' ')
  const finalText = lastSpaceIndex > 0 ? truncatedText.substring(0, lastSpaceIndex) : truncatedText
  
  return { 
    text: finalText + '...', 
    truncated: true 
  }
}

// Функция получения информации о канале
export const getChannelInfo = (channelId: number): ChannelInfo => {
  // ML канал
  if (channelId === -1001120572276) {
    return {
      type: 'ML',
      bgColor: 'bg-purple-900/50',
      color: 'text-purple-400',
      borderColor: 'border-purple-700'
    }
  }
  
  // IT канал
  if (channelId === -1001944996511) {
    return {
      type: 'IT',
      bgColor: 'bg-blue-900/50',
      color: 'text-blue-400',
      borderColor: 'border-blue-700'
    }
  }
  
  // По умолчанию
  return {
    type: 'Other',
    bgColor: 'bg-gray-900/50',
    color: 'text-gray-400',
    borderColor: 'border-gray-700'
  }
}

// Функция обработки HTML текста вакансии
export const processJobHtml = (htmlText: string): string => {
  if (!htmlText) return ''
  
  // Убираем лишние пробелы и переносы строк
  let processedText = htmlText
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, ' ')
    .trim()
  
  // Убираем HTML теги, но сохраняем переносы строк
  processedText = processedText
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]*>/g, '')
  
  return processedText
}

// Функция извлечения заголовка вакансии
export const extractJobTitle = (htmlText: string): string => {
  if (!htmlText) return ''
  
  // Ищем заголовок в тексте (обычно первая строка или строка с большими буквами)
  const lines = htmlText.split('\n').filter(line => line.trim())
  const firstLine = lines[0]?.trim()
  
  if (firstLine && firstLine.length > 0) {
    // Убираем HTML теги
    return firstLine.replace(/<[^>]*>/g, '').trim()
  }
  
  return ''
}

// Функция извлечения названия компании
export const extractJobCompany = (htmlText: string): string => {
  if (!htmlText) return ''
  
  // Ищем название компании (обычно после "в" или "at")
  const companyPatterns = [
    /в\s+([А-ЯЁ][А-ЯЁ\s&]+)/i,
    /at\s+([A-Z][A-Z\s&]+)/i,
    /компания\s+([А-ЯЁ][А-ЯЁ\s&]+)/i,
    /company\s+([A-Z][A-Z\s&]+)/i
  ]
  
  for (const pattern of companyPatterns) {
    const match = htmlText.match(pattern)
    if (match) {
      return match[1].trim()
    }
  }
  
  return ''
}

// Функция извлечения локации
export const extractJobLocation = (htmlText: string): string => {
  if (!htmlText) return ''
  
  // Ищем локацию (обычно после "в" или "")
  const locationPatterns = [
    /\s*([^,\n]+)/i,
    /в\s+([А-ЯЁ][А-ЯЁ\s]+)/i,
    /location:\s*([^,\n]+)/i,
    /локация:\s*([^,\n]+)/i
  ]
  
  for (const pattern of locationPatterns) {
    const match = htmlText.match(pattern)
    if (match) {
      return match[1].trim()
    }
  }
  
  return ''
}

// Функция извлечения зарплаты
export const extractJobSalary = (htmlText: string): string => {
  if (!htmlText) return ''
  
  // Ищем зарплату (обычно в формате "от X до Y" или "$X-$Y")
  const salaryPatterns = [
    /от\s+(\d+[\s\w]+)\s+до\s+(\d+[\s\w]+)/i,
    /(\d+[\s\w]+)\s*-\s*(\d+[\s\w]+)/i,
    /\$(\d+[Kk]?)\s*-\s*\$(\d+[Kk]?)/i,
    /(\d+)\s*т\.р\.\s*-\s*(\d+)\s*т\.р\./i
  ]
  
  for (const pattern of salaryPatterns) {
    const match = htmlText.match(pattern)
    if (match) {
      return `${match[1]} - ${match[2]}`
    }
  }
  
  return ''
}

// Функция проверки удаленной работы
export const isRemoteJob = (htmlText: string, location?: string): boolean => {
  if (location) {
    return location.toLowerCase().includes('remote') || 
           location.toLowerCase().includes('удаленно') ||
           location.toLowerCase().includes('удаленка')
  }
  
  if (htmlText) {
    const remotePatterns = [
      /remote/i,
      /удаленно/i,
      /удаленка/i,
      /из дома/i,
      /home office/i
    ]
    
    return remotePatterns.some(pattern => pattern.test(htmlText))
  }
  
  return false
}
