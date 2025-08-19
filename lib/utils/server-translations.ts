// Эта функция не используется в SSR страницах, но может вызывать проблемы с кешированием
// SSR страницы должны использовать только tServer(locale) с языком из URL

// REMOVED: getServerTranslations function that reads from cookies
// This was causing potential caching conflicts with SSR pages
// SSR pages should only use tServer(locale) with language from URL params

export {}
