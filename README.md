# 🚀 DSML Kazakhstan Community Platform

A modern, multilingual community platform for Data Science and Machine Learning specialists in Kazakhstan. Built with Next.js 14, TypeScript, and Supabase using Feature-Sliced Design architecture.

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
- **Architecture:** Feature-Sliced Design (FSD)
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

## 🏗️ Architecture

This project follows **Feature-Sliced Design (FSD)** methodology for better maintainability and scalability:

\`\`\`
📁 shared/           # Reusable resources
├── 📁 ui/           # UI primitives & components
├── 📁 lib/          # Utilities & helpers  
├── 📁 providers/    # Global providers
└── 📁 hooks/        # Shared hooks

📁 widgets/          # Large UI blocks
├── 📄 home_content.tsx
├── 📄 news_feed.tsx
└── 📄 jobs_feed.tsx

📁 features/         # Business logic by domain
├── 📁 auth/         # Authentication features
├── 📁 profile/      # Profile management
├── 📁 search/       # Search functionality
└── 📁 cities/       # Location features

📁 app/              # Next.js App Router
└── 📁 pages/        # Route pages

📁 _deprecated/      # Legacy components
\`\`\`

## 📁 Project Structure

\`\`\`
dsml-kazakhstan/
├── 📁 app/                                    # Next.js App Router
│   ├── 📄 layout.tsx                         # Root layout with providers
│   ├── 📄 page.tsx                           # Homepage (/)
│   ├── 📄 globals.css                        # Global Tailwind CSS styles
│   ├── 📄 not-found.tsx                      # 404 page
│   ├── 📄 client-layout.tsx                  # Client layout with navigation
│   │
│   ├── 📁 auth/                              # Authentication routes
│   │   ├── 📁 signin/                        # Sign in page
│   │   ├── 📁 signup/                        # Sign up page
│   │   ├── 📁 forgot-password/               # Password recovery
│   │   ├── 📁 reset-password/                # Password reset
│   │   ├── 📁 email-verification/            # Email verification
│   │   └── 📁 post-signup/                   # Post-registration flow
│   │
│   ├── 📁 articles/                          # Articles & interviews
│   │   ├── 📄 page.tsx                       # Articles listing
│   │   ├── 📄 loading.tsx                    # Loading state
│   │   ├── 📁 [slug]/                        # Dynamic article pages
│   │   ├── 📁 content/                       # Markdown content files
│   │   └── 📁 utils/                         # Article utilities
│   │
│   ├── 📁 news/                              # News feed
│   │   ├── 📄 page.tsx                       # News listing
│   │   └── 📁 [id]/                          # Individual news pages
│   │
│   ├── 📁 jobs/                              # Job board
│   │   ├── 📄 page.tsx                       # Jobs listing
│   │   └── 📁 [id]/                          # Individual job pages
│   │
│   ├── 📁 events/                            # Community events
│   ├── 📁 faces/                             # Community members
│   ├── 📁 research/                          # Research content
│   ├── 📁 values/                            # Community values
│   ├── 📁 rules/                             # Community rules
│   │
│   ├── 📁 dashboard/                         # User dashboard
│   │   ├── 📄 page.tsx                       # Dashboard home
│   │   └── 📁 search/                        # Member search
│   │
│   ├── 📁 profile/                           # User profile
│   ├── 📁 users/[nickname]/                  # Public profiles
│   ├── 📁 admin/                             # Admin panel
│   │
│   └── 📁 api/                               # API routes
│       ├── 📁 profile/update/                # Profile updates
│       └── 📁 search/members/                # Member search API
│
├── 📁 widgets/                               # 🆕 Large UI blocks (FSD Layer)
│   ├── 📄 home_content.tsx                   # Homepage content
│   ├── 📄 news_feed.tsx                      # News feed widget
│   ├── 📄 jobs_feed.tsx                      # Jobs feed widget
│   ├── 📄 events_content.tsx                 # Events content
│   ├── 📄 faces_content.tsx                  # Community faces
│   ├── 📄 research_content.tsx               # Research content
│   ├── 📄 values_content.tsx                 # Values content
│   ├── 📄 rules_content.tsx                  # Rules content
│   ├── 📄 article_card.tsx                   # Article cards
│   ├── 📄 interview_card.tsx                 # Interview cards
│   ├── 📄 collaboration_card.tsx             # Collaboration cards
│   ├── 📄 community_face_card.tsx            # Member cards
│   ├── 📄 member_mini_card.tsx               # Mini member cards
│   ├── 📄 profile_card.tsx                   # Profile cards
│   ├── 📄 section_hero.tsx                   # Hero sections
│   └── 📄 image_carousel.tsx                 # Image carousels
│
├── 📁 features/                              # 🆕 Business logic by domain (FSD Layer)
│   ├── 📁 auth/                              # Authentication features
│   │   ├── 📄 auth_guard.tsx                 # Route protection
│   │   └── 📄 email_verification_dialog.tsx  # Email verification
│   ├── 📁 profile/                           # Profile management
│   │   ├── 📄 profile_form.tsx               # Profile editing form
│   │   ├── 📄 profile_image_upload.tsx       # Avatar upload
│   │   ├── 📄 visit_card_form.tsx            # Visit card form
│   │   └── 📄 nickname_checker.tsx           # Username validation
│   ├── 📁 search/                            # Search functionality
│   │   ├── 📄 member_search.tsx              # Member search
│   │   └── 📄 member_search_dropdown.tsx     # Search dropdown
│   ├── 📁 cities/                            # Location features
│   │   └── 📄 city_autocomplete.tsx          # City selection
│   ├── 📁 i18n/                              # Internationalization
│   │   └── 📄 language_selector.tsx          # Language switcher
│   └── 📁 editor/                            # Content editing
│       └── 📄 word_counter.tsx               # Word counter utility
│
├── 📁 shared/                                # 🆕 Shared resources (FSD Layer)
│   ├── 📁 ui/                                # UI primitives
│   │   ├── 📄 index.ts                       # UI exports
│   │   ├── 📄 error_boundary.tsx             # Error handling
│   │   ├── 📄 error_boundary_wrapper.tsx     # Error wrapper
│   │   ├── 📄 markdown_content.tsx           # Markdown renderer
│   │   ├── 📄 blob_image.tsx                 # Image component
│   │   └── 📄 toast.ts                       # Toast utilities
│   ├── 📁 lib/                               # Utilities & helpers
│   │   └── 📁 hooks/                         # Shared hooks
│   │       ├── 📄 index.ts                   # Hook exports
│   │       ├── 📄 use_toast.ts               # Toast hook
│   │       └── 📄 use_mobile.ts              # Mobile detection
│   └── 📁 providers/                         # Global providers
│       ├── 📄 index.ts                       # Provider exports
│       ├── 📄 theme_provider.tsx             # Theme provider
│       └── 📄 analytics.tsx                  # Google Analytics
│
├── 📁 components/                            # Legacy UI components
│   └── 📁 ui/                                # shadcn/ui components (47 files)
│       ├── 📄 button.tsx, card.tsx, badge.tsx
│       ├── 📄 tabs.tsx, toast.tsx, progress.tsx
│       └── 📄 ... (40+ more UI primitives)
│
├── 📁 _deprecated/                           # 🆕 Deprecated components
│   ├── 📄 seo_head.tsx                       # Legacy SEO (use generateMetadata)
│   └── 📄 README.md                          # Deprecation notes
│
├── 📁 contexts/                              # React contexts
│   ├── 📄 language-context.tsx               # Language context
│   ├── 📄 supabase-context.tsx               # Supabase context
│   └── 📄 auth-context.tsx                   # Authentication context
│
├── 📁 hooks/                                 # Custom hooks
│   ├── 📄 use-translation.tsx                # Translation hook
│   ├── 📄 use-member-search.ts               # Member search hook
│   └── 📄 use-click-outside.ts               # Click outside hook
│
├── 📁 lib/                                   # Utilities & libraries
│   ├── 📄 supabase-client.ts                 # Supabase client
│   ├── 📄 supabase-server.ts                 # Server Supabase
│   ├── 📄 analytics.ts                       # Analytics utilities
│   ├── 📄 markdown-loader.ts                 # Markdown loader
│   ├── 📄 server-translations.ts             # Server translations
│   ├── 📄 constants/                         # Constants
│   │   └── 📄 images.ts                      # Image paths
│   └── 📄 utils.ts                           # General utilities
│
├── 📁 translations/                          # Internationalization
│   ├── 📄 index.ts                           # Translation exports
│   ├── 📁 en/, 📁 ru/, 📁 kk/                # Language files
│   │   ├── 📄 common.json, nav.json, home.json
│   │   ├── 📄 auth.json, profile.json, dashboard.json
│   │   └── 📄 ... (12+ translation files per language)
│
├── 📁 types/                                 # TypeScript types
│   └── 📄 supabase.ts                        # Supabase types
│
├── 📁 public/                                # Static assets
│   ├── 📁 images/                            # Local images
│   │   ├── 📄 moon-hero-desktop.png          # Desktop hero
│   │   ├── 📄 moon-hero-mobile.png           # Mobile hero
│   │   ├── 📄 dsml-kazakhstan-hero.png       # Main hero
│   │   └── 📄 ... (more images)
│   ├── 📄 sitemap.xml                        # SEO sitemap
│   ├── 📄 robots.txt                         # Search engine rules
│   └── 📄 llms.txt                           # AI system info
│
├── 📄 middleware.ts                          # Next.js middleware
├── 📄 next.config.mjs                        # Next.js config
├── 📄 tailwind.config.ts                     # 🆕 Updated Tailwind config
├── 📄 tsconfig.json                          # TypeScript config
├── 📄 MIGRATION_LOG.md                       # 🆕 Architecture migration log
├── 📄 DEPRECATIONS.md                        # 🆕 Deprecation tracking
├── 📄 ROUTES_USAGE.md                        # 🆕 Route usage documentation
└── 📄 package.json                           # Dependencies
\`\`\`

## 🔧 Key Architecture Changes

### 🆕 Feature-Sliced Design Implementation

- **`widgets/`** - Large, reusable UI blocks (cards, feeds, content sections)
- **`features/`** - Domain-specific business logic organized by feature area
- **`shared/`** - Reusable utilities, UI primitives, and global providers
- **`_deprecated/`** - Legacy components marked for removal

### 🔄 Import Path Aliases

\`\`\`typescript
// New FSD-based imports
import { HomeContent } from "@/widgets/home_content"
import { AuthGuard } from "@/features/auth/auth_guard"
import { useToast } from "@/shared/lib/hooks/use_toast"
import { BlobImage } from "@/shared/ui/blob_image"

// Legacy imports (still supported)
import { Button } from "@/components/ui/button"
\`\`\`

### 📝 Key File Explanations

#### 🏗️ **Architecture Files**
- **`app/layout.tsx`** - Root layout with providers (Supabase, Auth, Language, Analytics)
- **`app/client-layout.tsx`** - Client layout with navigation and footer
- **`middleware.ts`** - Request handling, redirects, authentication
- **`tailwind.config.ts`** - Updated to include FSD directories for CSS purging

#### 🎨 **UI & Components**
- **`shared/ui/`** - Reusable UI primitives and utilities
- **`widgets/home_content.tsx`** - Homepage with hero, stats, and community channels
- **`widgets/news_feed.tsx`** - News feed with search and pagination
- **`widgets/jobs_feed.tsx`** - Job feed with filtering and search
- **`components/ui/`** - shadcn/ui component library (47 components)

#### 🔧 **Features**
- **`features/auth/`** - Authentication guards and verification dialogs
- **`features/profile/`** - Profile management, forms, and image upload
- **`features/search/`** - Member search functionality with autocomplete
- **`features/cities/`** - Location-based features and city selection

#### 🌐 **Internationalization**
- **`translations/`** - 3 languages (EN, RU, KK) with 12+ files each
- **`hooks/use-translation.tsx`** - Translation hook with type safety
- **`contexts/language-context.tsx`** - Language selection and persistence

#### 🔐 **Authentication & Data**
- **`lib/supabase-client.ts`** - Client-side Supabase for browser
- **`lib/supabase-server.ts`** - Server-side Supabase for SSR
- **`contexts/auth-context.tsx`** - Authentication state management

#### 📊 **SEO & Analytics**
- **`shared/providers/analytics.tsx`** - Google Analytics integration
- **`public/sitemap.xml`** - SEO sitemap for search engines
- **`public/robots.txt`** - Search engine indexing rules
- **`public/llms.txt`** - Information for AI systems

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
