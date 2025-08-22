# 🚀 DSML Kazakhstan Community Platform

A modern, multilingual community platform for Data Science and Machine Learning specialists in Kazakhstan. Built with Next.js 15, TypeScript, and Supabase using Feature-Sliced Design architecture.

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

- **Framework:** Next.js 15.2.4 (App Router)
- **Language:** TypeScript 5
- **Runtime:** React 19
- **Architecture:** Feature-Sliced Design (FSD)
- **Styling:** Tailwind CSS 3.3.3
- **UI Components:** shadcn/ui + Radix UI
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Package Manager:** pnpm
- **Deployment:** Vercel
- **Analytics:** Google Analytics

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/dsml-kazakhstan.git
   cd dsml-kazakhstan
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # или
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga_id
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   # или
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

This project follows **Feature-Sliced Design (FSD)** methodology for better maintainability and scalability:

```
📁 shared/           # Reusable resources
├── 📁 ui/           # UI primitives & components
├── 📁 lib/          # Utilities & helpers  
├── 📁 providers/    # Global providers
└── 📁 hooks/        # Shared hooks

📁 widgets/          # Large UI blocks
├── 📄 home_content.tsx
├── 📄 news_feed.tsx
├── 📄 jobs_feed_server.tsx  # Updated to server-side jobs feed
├── 📄 jobs_feed_client_wrapper.tsx  # Client wrapper for jobs
└── 📄 events_content.tsx

📁 features/         # Business logic by domain
├── 📁 auth/         # Authentication features
├── 📁 profile/      # Profile management
├── 📁 search/       # Search functionality
└── 📁 cities/       # Location features

📁 app/              # Next.js App Router
└── 📁 pages/        # Route pages

📁 _deprecated/      # Legacy components
```

## 📁 Project Structure

```
dsml-kazakhstan/
├── 📁 app/                                    # Next.js App Router
│   ├── 📄 layout.tsx                         # Root layout with providers
│   ├── 📄 page.tsx                           # Homepage (/)
│   ├── 📄 globals.css                        # Global Tailwind CSS styles
│   ├── 📄 not-found.tsx                      # 404 page
│   ├── 📄 client-layout.tsx                  # Client layout with navigation
│   │
│   ├── 📁 [lang]/                            # 🆕 Internationalized routes
│   │   └── 📁 (public)/                      # Public route group
│   │       ├── 📄 layout.tsx                 # Localized public layout
│   │       ├── 📁 articles/                  # SSR articles with language prefixes
│   │       │   ├── 📄 page.tsx               # Articles listing (/en/articles)
│   │       │   ├── 📁 [slug]/                # Individual articles (/en/articles/[slug])
│   │       │   └── 📁 utils/                 # Article utilities & metadata
│   │       ├── 📁 news/                      # SSR news with language prefixes
│   │       │   ├── 📄 page.tsx               # News listing (/en/news)
│   │       │   └── 📁 [id]/                  # Individual news (/en/news/[id])
│   │       └── 📁 jobs/                      # SSR jobs with language prefixes
│   │           ├── 📄 page.tsx               # Jobs listing (/en/jobs)
│   │           └── 📁 [id]/                  # Individual jobs (/en/jobs/[id])
│   │
│   ├── 📁 (protected)/                       # Protected route group
│   │   ├── 📄 layout.tsx                     # Protected layout with auth
│   │   ├── 📁 dashboard/                     # User dashboard
│   │   │   ├── 📄 page.tsx                   # Dashboard home
│   │   │   ├── 📄 loading.tsx                # Dashboard loading state
│   │   │   └── 📁 search/                    # Member search
│   │   │       ├── 📄 page.tsx               # Search page
│   │   │       └── 📄 loading.tsx            # Search loading state
│   │   └── 📁 profile/                       # User profile management
│   │       └── 📄 page.tsx                   # Profile editing page
│   │
│   ├── 📁 auth/                              # Authentication routes
│   │   ├── 📁 signin/                        # Sign in page
│   │   ├── 📁 signup/                        # Sign up page
│   │   ├── 📁 forgot-password/               # Password recovery
│   │   ├── 📁 reset-password/                # Password reset
│   │   ├── 📁 email-verification/            # Email verification
│   │   └── 📁 post-signup/                   # Post-registration flow
│   │
│   ├── 📁 events/                            # Community events (CSR)
│   ├── 📁 faces/                             # Community members (CSR)
│   ├── 📁 research/                          # Research content (CSR)
│   ├── 📁 values/                            # Community values (CSR)
│   ├── 📁 rules/                             # Community rules (CSR)
│   │
│   ├── 📁 users/[nickname]/                  # Public user profiles
│   ├── 📁 admin/                             # Admin panel
│   │
│   └── 📁 api/                               # API routes
│       ├── 📁 profile/update/                # Profile updates
│       └── 📁 search/members/                # Member search API
│
├── 📁 components/                            # UI Components
│   ├── 📄 hero-section.tsx                   # 🆕 Unified dark hero section
│   ├── 📄 language-switcher.tsx              # Language switching component
│   ├── 📄 member-mini-card.tsx               # Mini member display cards
│   ├── 📄 profile-card.tsx                   # User profile cards
│   └── 📁 ui/                                # shadcn/ui components (47 files)
│       ├── 📄 button.tsx, card.tsx, badge.tsx
│       ├── 📄 tabs.tsx, toast.tsx, progress.tsx
│       ├── 📄 accordion.tsx, alert.tsx, avatar.tsx
│       ├── 📄 calendar.tsx, checkbox.tsx, dialog.tsx
│       ├── 📄 dropdown-menu.tsx, form.tsx, input.tsx
│       ├── 📄 navigation-menu.tsx, popover.tsx, select.tsx
│       ├── 📄 sheet.tsx, table.tsx, textarea.tsx
│       └── 📄 ... (30+ more UI primitives)
│
├── 📁 widgets/                               # Large UI blocks (FSD Layer)
│   ├── 📄 home_content.tsx                   # Homepage content with hero images
│   ├── 📄 news_feed.tsx                      # News feed widget
│   ├── 📄 jobs_feed_server.tsx               # Server-side job feed widget
│   ├── 📄 jobs_feed_client_wrapper.tsx       # Client wrapper for jobs
│   ├── 📄 events_content.tsx                 # Events content
│   ├── 📄 faces_content.tsx                  # Community faces
│   ├── 📄 research_content.tsx               # Research content
│   ├── 📄 values_content.tsx                 # Values content
│   ├── 📄 rules_content.tsx                  # Rules content
│   ├── 📄 article_card.tsx                   # Article display cards
│   ├── 📄 interview_card.tsx                 # Interview cards
│   ├── 📄 collaboration_card.tsx             # Collaboration cards
│   ├── 📄 community_face_card.tsx            # Member cards
│   ├── 📄 profile_card.tsx                   # Profile cards
│   ├── 📄 section_hero.tsx                   # Legacy hero sections
│   └── 📄 image_carousel.tsx                 # Image carousels
│
├── 📁 features/                              # Business logic by domain (FSD Layer)
│   ├── 📁 auth/                              # Authentication features
│   │   ├── 📄 auth_guard.tsx                 # Route protection
│   │   ├── 📄 email_verification_dialog.tsx  # Email verification
│   │   ├── 📄 constants.ts                   # Auth constants
│   │   ├── 📄 types.ts                       # Auth types
│   │   └── 📁 utils/                         # Auth utilities
│   │       └── 📄 createFallbackProfile.ts   # Profile creation
│   ├── 📁 profile/                           # Profile management
│   │   ├── 📁 client/                        # Client-side profile logic
│   │   │   ├── 📄 ProfileProvider.tsx        # Profile context provider
│   │   │   ├── 📄 useProfile.ts              # Profile hook
│   │   │   ├── 📄 fetchProfile.ts            # Profile fetching
│   │   │   └── 📄 profileStorage.ts          # Profile storage
│   │   ├── 📄 profile_form.tsx               # Profile editing form
│   │   ├── 📄 profile_image_upload.tsx       # Avatar upload
│   │   ├── 📄 visit_card_form.tsx            # Visit card form
│   │   └── 📄 nickname_checker.tsx           # Username validation
│   ├── 📁 cities/                            # Location features
│   │   └── 📄 city_autocomplete.tsx          # City selection
│   ├── 📁 i18n/                              # Internationalization
│   │   └── 📄 language_selector.tsx          # Language switcher
│   └── 📁 editor/                            # Content editing
│       └── 📄 word_counter.tsx               # Word counter utility
│
├── 📁 shared/                                # Shared resources (FSD Layer)
│   ├── 📁 ui/                                # UI primitives
│   │   ├── 📄 markdown_content.tsx           # Markdown renderer with math support
│   │   ├── 📄 blob_image.tsx                 # Optimized image component
│   │   ├── 📄 error_boundary.tsx             # Error handling
│   │   ├── 📄 error_boundary_wrapper.tsx     # Error wrapper
│   │   ├── 📄 spinner.tsx                    # Loading spinner
│   │   └── 📄 toast.ts                       # Toast utilities
│   └── 📁 providers/                         # Global providers
│       ├── 📄 theme_provider.tsx             # Theme provider
│       └── 📄 analytics.tsx                  # Google Analytics
│
├── 📁 contexts/                              # React contexts
│   ├── 📄 auth-context.tsx                   # Authentication context
│   ├── 📄 language-context.tsx               # Language context
│   └── 📄 supabase-context.tsx               # Supabase context
│
├── 📁 hooks/                                 # Custom hooks
│   ├── 📄 use-auth.ts                        # Authentication hook
│   ├── 📄 use-safe-profile.ts                # 🆕 Safe profile access hook
│   ├── 📄 use-translation.tsx                # Translation hook
│   ├── 📄 use-member-search.ts               # Member search hook
│   ├── 📄 use-click-outside.ts               # Click outside detection
│   ├── 📄 use-mobile.tsx                     # Mobile device detection
│   └── 📄 use-toast.ts                       # Toast notifications
│
├── 📁 lib/                                   # Utilities & libraries
│   ├── 📄 supabase-client.ts                 # Client-side Supabase
│   ├── 📄 supabase-server.ts                 # Server-side Supabase
│   ├── 📄 supabase-public.ts                 # Public Supabase client
│   ├── 📄 server-translations.ts             # 🆕 Server-side translations
│   ├── 📄 i18n-config.ts                     # Internationalization config
│   ├── 📄 i18n-ssr-routes.ts                 # 🆕 SSR route configuration
│   ├── 📄 analytics.ts                       # Analytics utilities
│   ├── 📄 check-connection.ts                # Connection testing
│   ├── 📄 debounce.ts                        # Debounce utility
│   ├── 📄 jobs-utils.ts                      # Jobs-related utilities
│   ├── 📄 text-utils.ts                      # Text processing utilities
│   ├── 📄 locale-actions.ts                  # Locale handling
│   ├── 📁 constants/                         # Constants
│   │   └── 📄 images.ts                      # Image paths
│   └── 📄 utils.ts                           # General utilities
│
├── 📁 translations/                          # Internationalization
│   ├── 📄 index.ts                           # Translation exports
│   ├── 📁 en/, 📁 ru/, 📁 kk/                # Language files
│   │   ├── 📄 common.json                    # Common translations
│   │   ├── 📄 nav.json                       # Navigation
│   │   ├── 📄 home.json                      # Homepage
│   │   ├── 📄 auth.json                      # Authentication
│   │   ├── 📄 profile.json                   # Profile pages
│   │   ├── 📄 dashboard.json                 # Dashboard
│   │   ├── 📄 articles.json                  # 🆕 Articles translations
│   │   ├── 📄 news.json                      # News translations
│   │   ├── 📄 jobs.json                      # Jobs translations
│   │   ├── 📄 events.json                    # Events translations
│   │   ├── 📄 faces.json                     # Community faces
│   │   ├── 📄 research.json                  # Research content
│   │   ├── 📄 values.json                    # Values content
│   │   └── 📄 rules.json                     # Rules content
│
├── 📁 types/                                 # TypeScript types
│   └── 📄 supabase.ts                        # Generated Supabase types
│
├── 📁 public/                                # Static assets
│   ├── 📁 images/                            # Local images
│   │   ├── 📄 moon-hero-desktop.png          # 🆕 Desktop hero image
│   │   ├── 📄 moon-hero-mobile.png           # 🆕 Mobile hero image
│   │   ├── 📄 dsml-logo.png                  # DSML logo
│   │   └── 📄 hero-banner.png                # Main hero banner
│   ├── 📄 sitemap.xml                        # SEO sitemap
│   ├── 📄 robots.txt                         # Search engine rules
│   └── 📄 llms.txt                           # AI system info
│
├── 📄 middleware.ts                          # 🆕 Enhanced Next.js middleware for i18n
├── 📄 next.config.mjs                        # Next.js configuration
├── 📄 tailwind.config.ts                     # Tailwind CSS configuration
├── 📄 tsconfig.json                          # TypeScript configuration
├── 📄 MIGRATION_LOG.md                       # Architecture migration log
├── 📄 DEPRECATIONS.md                        # Deprecation tracking
├── 📄 ROUTES_USAGE.md                        # Route usage documentation
└── 📄 package.json                           # Dependencies & scripts
```

## 🔧 Key Architecture Changes

### 🆕 Feature-Sliced Design Implementation

- **`widgets/`** - Large, reusable UI blocks (cards, feeds, content sections)
- **`features/`** - Domain-specific business logic organized by feature area
- **`shared/`** - Reusable utilities, UI primitives, and global providers
- **`_deprecated/`** - Legacy components marked for removal

### 🆕 Recent Major Updates & Improvements

#### 🌐 Enhanced Internationalization & SEO
- **SSR Language Routing** - Implemented server-side rendering with language prefixes (`/en/`, `/ru/`, `/kk/`) for articles, news, and jobs pages
- **Intelligent Language Switching** - Different navigation strategies for SSR pages (full reload) vs CSR pages (client-side switching)
- **SEO Optimization** - Added comprehensive SEO metadata, canonical URLs, hreflang links, and JSON-LD structured data
- **Translation System** - Unified server-side (`tServer`) and client-side (`useTranslation`) translation systems with proper context handling

#### 📰 Content Management Improvements
- **Articles SSR Migration** - Moved `/articles` and `/articles/[slug]` to SSR with language prefixes for better SEO
- **Enhanced Article Pages** - Added proper date parsing for Russian dates, improved metadata generation, and error handling
- **News & Jobs SSR** - Implemented server-side rendering for news and jobs pages with language-specific URLs
- **Content Translation** - Added missing translation keys across all pages and components

#### 👤 Profile System Enhancements
- **Nickname Management** - Removed automatic nickname generation from email to prevent restricted characters
- **Profile Context Separation** - Split authentication and profile contexts for better state management
- **Navigation Display** - Updated navigation to show user nickname instead of email prefix, with "Anon User" fallback
- **Profile Loading** - Improved profile data loading with proper error handling and timeout mechanisms

#### 🎨 UI/UX Improvements
- **Unified Hero Sections** - Implemented consistent dark hero sections across all pages using `components/hero-section.tsx`
- **Hero Image Integration** - Added responsive hero images for desktop and mobile on the homepage
- **Button Management** - Made hero section buttons optional and configurable per page
- **Responsive Design** - Improved mobile responsiveness and reduced hero section heights for better space utilization

#### 🔧 Technical Infrastructure
- **Middleware Enhancement** - Improved language detection and routing logic for SSR/CSR page handling
- **Error Handling** - Added comprehensive error boundaries and safe context usage patterns
- **Database Integration** - Enhanced profile data fetching with retry mechanisms and connection testing
- **Build Optimization** - Fixed deployment issues with function serialization and context provider hierarchies

#### 🔍 Search & Navigation
- **Member Search** - Enhanced member search functionality with improved filtering and pagination
- **Language-Aware Routing** - Implemented intelligent routing that respects current language context
- **Navigation Consistency** - Unified navigation behavior across SSR and CSR pages

#### 📊 Performance & Analytics
- **Server-Side Optimization** - Improved server-side rendering performance for content-heavy pages
- **Image Optimization** - Added proper image loading strategies with priority loading for hero images
- **Analytics Integration** - Enhanced Google Analytics integration with proper event tracking

#### 🛠️ Developer Experience
- **Type Safety** - Improved TypeScript types for translation functions and profile data
- **Debug Logging** - Added comprehensive debug logging for troubleshooting profile and translation issues
- **Error Recovery** - Implemented graceful error recovery for missing translations and profile data

### 🔄 Import Path Aliases

```typescript
// New FSD-based imports
import { HomeContent } from "@/widgets/home_content"
import { AuthGuard } from "@/features/auth/auth_guard"
import { useToast } from "@/shared/lib/hooks/use_toast"
import { BlobImage } from "@/shared/ui/blob_image"

// Legacy imports (still supported)
import { Button } from "@/components/ui/button"
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks

# Database
npm run db:generate  # Generate Supabase types
npm run db:push      # Push database changes
```

## 🌍 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_google_analytics_id

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

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
- [ ] Tailwind CSS purging configured for FSD directories

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Follow FSD architecture** - Place components in appropriate layers
4. **Commit your changes** (`git commit -m 'Add amazing feature'`)
5. **Push to the branch** (`git push origin feature/amazing-feature`)
6. **Open a Pull Request**

### Development Guidelines

- Follow Feature-Sliced Design methodology
- Use TypeScript best practices
- Follow conventional commit messages
- Add tests for new features
- Update documentation as needed
- Ensure responsive design
- Test across different browsers
- Use proper import aliases (@/widgets/, @/features/, @/shared/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [DSML Kazakhstan Community](https://dsml.kz) for inspiration and support
- [Feature-Sliced Design](https://feature-sliced.design/) for architecture methodology
- [Next.js](https://nextjs.org/) for the amazing framework
- [Supabase](https://supabase.com/) for backend services
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [shadcn/ui](https://ui.shadcn.com/) for UI components

## 📞 Support

- **Website:** [dsml.kz](https://dsml.kz)
- **Email:** info@dsml.kz
- **Telegram:** [@dsmlkz](https://t.me/dsmlkz)

---

Made with ❤️ by the DSML Kazakhstan community using Feature-Sliced Design
