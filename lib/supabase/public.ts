// Публичный Supabase - исправляем импорт
// Вместо export * from '../supabase-public' создаем реальный экспорт

export { createClient } from '@supabase/supabase-js'

// Или если у нас есть существующий файл, экспортируем его содержимое
// export * from '../supabase-public'
