# 🚀 DSML Kazakhstan Community Platform

A modern, multilingual community platform for Data Science and Machine Learning specialists in Kazakhstan. Built with Next.js 14, TypeScript, and Supabase.

## ✨ Features

- 🌐 **Multilingual Support** - English, Russian, and Kazakh languages
- 👥 **Community Profiles** - Member profiles with skills and experience
- 📰 **News & Articles** - Latest news and technical articles
- 💼 **Job Board** - Data science job opportunities
- 🎯 **Events** - Community events and meetups
- 🔍 **Advanced Search** - Find members by skills, location, and experience
- 📱 **Responsive Design** - Mobile-first approach
- 🔐 **Authentication** - Secure user authentication with Supabase
- 🎨 **Modern UI** - Built with Tailwind CSS and shadcn/ui
- ⚡ **Performance** - Server-side rendering and optimized loading
- 🔍 **SEO Optimized** - Full SEO support with structured data

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Deployment:** Vercel
- **Analytics:** Google Analytics

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-org/dsml-kazakhstan.git
   cd dsml-kazakhstan
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Fill in your environment variables:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga_id
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

\`\`\`
dsml-kazakhstan/
├── 📁 app/                                    # Next.js App Router
│   ├── 📄 layout.tsx                         # Корневой layout с провайдерами
│   ├── 📄 page.tsx                           # Главная страница (/)
│   ├── 📄 globals.css                        # Глобальные стили Tailwind CSS
│   ├── 📄 not-found.tsx                      # Страница 404
│   ├── 📄 client-layout.tsx                  # Клиентский layout с навигацией
│   │
│   ├── 📁 articles/                          # Статьи и интервью
│   │   ├── 📄 page.tsx                       # Список всех статей
│   │   ├── 📄 loading.tsx                    # Загрузка для статей
│   │   ├── 📄 [slug]/                        # Динамические страницы статей
│   │   │   ├── 📄 page.tsx                   # Отдельная статья
│   │   │   └── 📄 loading.tsx                # Загрузка статьи
│   │   ├── 📁 content/                       # Markdown файлы статей
│   │   │   ├── 📄 *.md                       # Контент статей
│   │   │   └── 📄 *.md                       # Интервью и обзоры
│   │   └── 📁 utils/                         # Утилиты для статей
│   │       ├── 📄 markdown-loader.ts         # Загрузчик Markdown
│   │       └── 📄 articles-metadata.ts       # Метаданные статей
│   │
│   ├── 📁 news/                              # Новостная лента
│   │   ├── 📄 page.tsx                       # Страница новостей
│   │   └── 📄 [id]/                          # Отдельная новость
│   │       ├── 📄 page.tsx                   # Детальная страница новости
│   │       ├── 📄 loading.tsx                # Загрузка новости
│   │       └── 📄 not-found.tsx              # 404 для новости
│   │
│   ├── 📁 jobs/                              # Вакансии
│   │   ├── 📄 page.tsx                       # Список вакансий
│   │   └── 📄 [id]/                          # Отдельная вакансия
│   │       ├── 📄 page.tsx                   # Детальная страница вакансии
│   │       ├── 📄 loading.tsx                # Загрузка вакансии
│   │       └── 📄 not-found.tsx              # 404 для вакансии
│   │
│   ├── 📁 events/                            # События и мероприятия
│   │   ├── 📄 page.tsx                       # Страница событий
│   │   └── 📄 loading.tsx                    # Загрузка событий
│   │
│   ├── 📁 faces/                             # Лица сообщества
│   │   └── 📄 page.tsx                       # Участники сообщества
│   │
│   ├── 📁 research/                          # Исследования
│   │   ├── 📄 page.tsx                       # Страница исследований
│   │   └── 📄 loading.tsx                    # Загрузка исследований
│   │
│   ├── 📁 values/                            # Ценности сообщества
│   │   └── 📄 page.tsx                       # Страница ценностей
│   │
│   ├── 📁 rules/                             # Правила сообщества
│   │   └── 📄 page.tsx                       # Страница правил
│   │
│   ├── 📁 dashboard/                         # Личный кабинет
│   │   ├── 📄 page.tsx                       # Главная дашборда
│   │   ├── 📄 loading.tsx                    # Загрузка дашборда
│   │   └── 📁 search/                        # Поиск участников
│   │       ├── 📄 page.tsx                   # Страница поиска
│   │       └── 📄 loading.tsx                # Загрузка поиска
│   │
│   ├── 📁 profile/                           # Профиль пользователя
│   │   ├── 📄 page.tsx                       # Страница профиля
│   │   └── 📄 loading.tsx                    # Загрузка профиля
│   │
│   ├── 📁 users/[nickname]/                  # Публичные профили
│   │   └── 📄 page.tsx                       # Профиль пользователя
│   │
│   ├── 📁 admin/                             # Админ панель
│   │   └── 📄 page.tsx                       # Админ интерфейс
│   │
│   ├── 📁 auth/                              # Аутентификация
│   │   ├── 📄 signin/page.tsx                # Вход
│   │   ├── 📄 signup/page.tsx                # Регистрация
│   │   ├── 📄 forgot-password/page.tsx       # Восстановление пароля
│   │   ├── 📄 reset-password/page.tsx        # Сброс пароля
│   │   ├── 📄 email-verification/page.tsx    # Подтверждение email
│   │   └── 📄 post-signup/page.tsx           # После регистрации
│   │
│   └── 📁 api/                               # API маршруты
│       ├── 📁 profile/update/                # Обновление профиля
│       │   └── 📄 route.ts                   # API обновления
│       └── 📁 search/members/                # Поиск участников
│           └── 📄 route.ts                   # API поиска
│
├── 📁 components/                            # React компоненты
│   ├── 📁 ui/                                # UI компоненты (shadcn/ui)
│   │   ├── 📄 button.tsx                     # Кнопки
│   │   ├── 📄 card.tsx                       # Карточки
│   │   ├── 📄 badge.tsx                      # Бейджи
│   │   ├── 📄 tabs.tsx                       # Вкладки
│   │   ├── 📄 toast.tsx                      # Уведомления
│   │   ├── 📄 progress.tsx                   # Прогресс бар
│   │   ├── 📄 blob-image.tsx                 # Компонент изображений
│   │   └── 📄 use-toast.ts                   # Хук для toast
│   │
│   ├── 📄 home-content.tsx                   # Контент главной страницы
│   ├── 📄 news-feed.tsx                      # Лента новостей
│   ├── 📄 news-feed-page.tsx                 # Страница новостей
│   ├── 📄 jobs-feed.tsx                      # Лента вакансий
│   ├── 📄 jobs-feed-page.tsx                 # Страница вакансий
│   ├── 📄 jobs-content.tsx                   # Контент вакансий
│   ├── 📄 events-content.tsx                 # Контент событий
│   ├── 📄 faces-content.tsx                  # Контент участников
│   ├── 📄 values-content.tsx                 # Контент ценностей
│   ├── 📄 rules-content.tsx                  # Контент правил
│   ├── 📄 research-content.tsx               # Контент исследований
│   ├── 📄 article-card.tsx                   # Карточка статьи
│   ├── 📄 interview-card.tsx                 # Карточка интервью
│   ├── 📄 collaboration-card.tsx             # Карточка сотрудничества
│   ├── 📄 community-face-card.tsx            # Карточка участника
│   ├── 📄 member-mini-card.tsx               # Мини карточка участника
│   ├── 📄 profile-card.tsx                   # Карточка профиля
│   ├── 📄 profile-form.tsx                   # Форма профиля
│   ├── 📄 profile-image-upload.tsx           # Загрузка аватара
│   ├── 📄 visit-card-form.tsx                # Форма визитки
│   ├── 📄 member-search.tsx                  # Поиск участников
│   ├── 📄 member-search-dropdown.tsx         # Выпадающий поиск
│   ├── 📄 city-autocomplete.tsx              # Автокомплит городов
│   ├── 📄 nickname-checker.tsx               # Проверка никнейма
│   ├── 📄 word-counter.tsx                   # Счетчик слов
│   ├── 📄 language-selector.tsx              # Переключатель языка
│   ├── 📄 section-hero.tsx                   # Героическая секция
│   ├── 📄 image-carousel.tsx                 # Карусель изображений
│   ├── 📄 markdown-content.tsx               # Рендер Markdown
│   ├── 📄 google-analytics.tsx               # Google Analytics
│   ├── 📄 email-verification-dialog.tsx      # Диалог подтверждения email
│   ├── 📄 auth-guard.tsx                     # Защита маршрутов
│   ├── 📄 error-boundary.tsx                 # Обработка ошибок
│   ├── 📄 error-boundary-wrapper.tsx         # Обертка для ошибок
│   └── 📄 seo-head.tsx                       # SEO метатеги
│
├── 📁 contexts/                              # React контексты
│   ├── 📄 language-context.tsx               # Контекст языка
│   ├── 📄 supabase-context.tsx               # Контекст Supabase
│   └── 📄 auth-context.tsx                   # Контекст аутентификации
│
├── 📁 hooks/                                 # Кастомные хуки
│   ├── 📄 use-translation.tsx                # Хук переводов
│   ├── 📄 use-member-search.ts               # Хук поиска участников
│   └── 📄 use-click-outside.ts               # Хук клика вне элемента
│
├── 📁 lib/                                   # Утилиты и библиотеки
│   ├── 📄 supabase-client.ts                 # Клиент Supabase
│   ├── 📄 supabase-server.ts                 # Серверный Supabase
│   ├── 📄 analytics.ts                       # Аналитика
│   ├── 📄 markdown-loader.ts                 # Загрузчик Markdown
│   ├── 📄 server-translations.ts             # Серверные переводы
│   ├── 📄 check-connection.ts                # Проверка соединения
│   ├── 📄 debounce.ts                        # Функция debounce
│   └── 📄 radix-deps.ts                      # Зависимости Radix UI
│
├── 📁 translations/                          # Переводы
│   ├── 📄 index.ts                           # Экспорт переводов
│   ├── 📁 en/                                # Английские переводы
│   │   ├── 📄 common.json                    # Общие переводы
│   │   ├── 📄 nav.json                       # Навигация
│   │   ├── 📄 home.json                      # Главная страница
│   │   ├── 📄 news.json                      # Новости
│   │   ├── 📄 jobs.json                      # Вакансии
│   │   ├── 📄 events.json                    # События
│   │   ├── 📄 articles.json                  # Статьи
│   │   ├── 📄 auth.json                      # Аутентификация
│   │   ├── 📄 profile.json                   # Профиль
│   │   ├── 📄 dashboard.json                 # Дашборд
│   │   ├── 📄 search.json                    # Поиск
│   │   ├── 📄 faces.json                     # Участники
│   │   ├── 📄 values.json                    # Ценности
│   │   ├── 📄 rules.json                     # Правила
│   │   ├── 📄 research.json                  # Исследования
│   │   └── 📄 register_card.json             # Регистрация карточки
│   ├── 📁 ru/                                # Русские переводы (аналогично)
│   └── 📁 kk/                                # Казахские переводы (аналогично)
│
├── 📁 types/                                 # TypeScript типы
│   └── 📄 supabase.ts                        # Типы Supabase
│
├── 📁 public/                                # Статические файлы
│   ├── 📁 images/                            # Изображения
│   │   ├── 📄 dsml-logo.png                  # Логотип DSML
│   │   ├── 📄 hero-banner.png                # Баннер героя
│   │   ├── 📄 moon-hero.png                  # Героическое изображение
│   │   ├── 📄 moon-hero-transparent-wide.png # Широкое героическое изображение
│   │   ├── 📄 moon-hero-mobile.png           # Мобильное героическое изображение
│   │   ├── 📄 announce_horizontal.png        # Горизонтальный анонс
│   │   └── 📄 card_background.png            # Фон карточки
│   ├── 📄 sitemap.xml                        # Карта сайта для SEO
│   ├── 📄 robots.txt                         # Инструкции для поисковых роботов
│   └── 📄 llms.txt                           # Информация для AI-систем
│
├── 📄 middleware.ts                          # Next.js middleware
├── 📄 next.config.mjs                        # Конфигурация Next.js
├── 📄 tailwind.config.ts                     # Конфигурация Tailwind CSS
├── 📄 tsconfig.json                          # Конфигурация TypeScript
└── 📄 package.json                           # Зависимости проекта
\`\`\`

## 📝 Key File Explanations

### 🏗️ **Architecture Files**
- **`app/layout.tsx`** - Root layout with providers (Supabase, Auth, Language)
- **`app/client-layout.tsx`** - Client layout with navigation and footer
- **`middleware.ts`** - Request handling, redirects, authentication

### 🎨 **UI & Components**
- **`components/ui/`** - Reusable UI components (shadcn/ui)
- **`components/home-content.tsx`** - Homepage with channels and statistics
- **`components/news-feed.tsx`** - News feed with search and pagination
- **`components/jobs-feed.tsx`** - Job feed with filtering

### 🌐 **Internationalization**
- **`translations/`** - Translations for 3 languages (EN, RU, KK)
- **`hooks/use-translation.tsx`** - Hook for working with translations
- **`contexts/language-context.tsx`** - Language selection context

### 🔐 **Authentication & Data**
- **`lib/supabase-client.ts`** - Client-side Supabase for browser
- **`lib/supabase-server.ts`** - Server-side Supabase for SSR
- **`contexts/auth-context.tsx`** - Authentication context

### 📊 **SEO & Analytics**
- **`public/sitemap.xml`** - Site map for search engines
- **`public/robots.txt`** - Indexing rules
- **`public/llms.txt`** - Information for AI systems
- **`components/seo-head.tsx`** - SEO meta tags and structured data

## 🔧 Available Scripts

\`\`\`bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks

# Database
npm run db:generate  # Generate Supabase types
npm run db:push      # Push database changes
\`\`\`

## 🌍 Environment Variables

Create a `.env.local` file with the following variables:

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_google_analytics_id

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

## 🚀 Deployment

The project is optimized for deployment on Vercel:

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

### Deployment Checklist

- [ ] Environment variables configured
- [ ] Supabase database setup
- [ ] Domain configured (if custom)
- [ ] Analytics setup
- [ ] SEO verification

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use conventional commit messages
- Add tests for new features
- Update documentation as needed
- Ensure responsive design
- Test across different browsers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [DSML Kazakhstan Community](https://dsml.kz) for inspiration and support
- [Next.js](https://nextjs.org/) for the amazing framework
- [Supabase](https://supabase.com/) for backend services
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [shadcn/ui](https://ui.shadcn.com/) for UI components

## 📞 Support

- **Website:** [dsml.kz](https://dsml.kz)
- **Email:** info@dsml.kz
- **Telegram:** [@dsmlkz](https://t.me/dsmlkz)

---

Made with ❤️ by the DSML Kazakhstan community
