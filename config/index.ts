// Экспортируем все конфигурации
export { default as nextConfig } from './next.config.mjs'
export { default as tailwindConfig } from './tailwind.config'
export { default as tsConfig } from './tsconfig.json'
export { default as postcssConfig } from './postcss.config.mjs'
export { default as componentsConfig } from './components.json'
// ИСПРАВЛЕНО: реэкспорт именованных из корневого middleware
export { middleware as rootMiddleware, config as middlewareConfig } from '../middleware'