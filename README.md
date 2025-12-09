# DSML Kazakhstan Community Platform
A multilingual community platform for data science and machine learning specialists in Kazakhstan, built with Next.js 15, TypeScript, and Supabase.

## Features
- Multilingual UI and content (ru, en, kk)
- Supabase authentication (sign up/in, email verification, password reset) with protected areas
- Public articles, interviews, news feed, job board, events, research, values, and rules
- Member profiles with public pages, dashboard, and profile editing
- Responsive UI on Tailwind CSS + shadcn/Radix; optional Google Analytics tracking

## Tech Stack
- Next.js 15 (App Router) + React 19
- TypeScript
- Tailwind CSS, shadcn/ui, Radix primitives
- Supabase client/SSR helpers
- Feature-Sliced-inspired layers (features, widgets, shared)

## Getting Started
- Prerequisites: Node 18.18+ and a Supabase project. pnpm is recommended (npm works too).
1) Clone the repo  
   ```bash
   git clone https://github.com/sneddy/dsmlkz_frontend.git
   cd dsmlkz_frontend
   ```
2) Install dependencies  
   ```bash
   pnpm install
   ```
3) Create `.env.local` with required keys  
   ```env
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=   # required for profile mutations in API routes
   NEXT_PUBLIC_GA_MEASUREMENT_ID=   # optional
   ```
4) Run the dev server: `pnpm dev` (opens http://localhost:3000)
5) Production build: `pnpm build && pnpm start`

## Scripts
- `pnpm dev` – start dev server
- `pnpm build` – build for production
- `pnpm start` – serve the production build
- `pnpm lint` – run ESLint
- Supabase helpers:  
  - `pnpm supabase:start|stop|status|reset` – локальный стек Supabase в Docker  
  - `pnpm supabase:link` – связать CLI с прод-проектом (ref `swfxusemimczhhhfzjhc`)  
  - `pnpm supabase:pull` – снять схему в `supabase/migrations/*__remote.sql`  
  - `pnpm supabase:push` – применить миграции из `supabase/migrations` в облако  
  - `pnpm supabase:types` – сгенерировать `types/supabase.ts` из актуальной схемы

## Project Structure (2 levels)
```
app/                    # App Router routes/layouts
  (public)/             # news, jobs + shared public layout
  (protected)/          # dashboard, profile (auth guarded)
  articles/             # listings, dynamic slugs, markdown content, utils
  auth/                 # signin, signup, forgot/reset, email verification
  users/[nickname]/     # public member profiles
  client-layout.tsx, layout.tsx, page.tsx, globals.css, not-found.tsx, sitemap.ts

features/               # Domain logic
  auth/, profile/, search/, cities/, i18n/, editor/

widgets/                # Page sections/cards
  home_content.tsx, news_feed.tsx, jobs_feed_server.tsx,
  jobs_feed_client_wrapper.tsx, jobs_feed_dynamic_wrapper.tsx,
  faces_content.tsx, values_content.tsx, rules_content.tsx, research_content.tsx,
  article_card.tsx, collaboration_card.tsx, community_face_card.tsx,
  profile_card.tsx, section_hero.tsx, section_hero_ssr.tsx, image_carousel.tsx

shared/                 # UI primitives + hooks/providers
  ui/ (blob_image, markdown_content, error_boundary, error_boundary_wrapper, toast, index)
  lib/hooks/ (use-toast, use-mobile, index)
  providers/ (analytics.tsx)

components/             # Legacy shadcn primitives + misc
  ui/ (button, card, dialog, dropdown-menu, input, label, tabs, toast, toaster, spinner, skeleton, textarea, etc.)
  jobs-feed-client.tsx, member-mini-card.tsx, profile-card.tsx

contexts/               # React contexts
  auth-context.tsx, language-context.tsx, supabase-context.tsx

lib/                    # Supabase, utils, logging, constants
  supabase-client.ts, supabase-server.ts, server-translations.ts,
  logger.ts, utils.ts, utils/ (jobs-utils.ts, text-utils.ts), radix-deps.ts, constants/

translations/           # i18n dictionaries
  en/, ru/, kk/, index.ts

public/                 # Static assets
  images/, sitemap.xml, robots.txt, llms.txt, placeholders

styles/                 # Global styles
  globals.css

types/                  # Types
  supabase.ts

middleware.ts           # Supabase auth handling
next.config.mjs         # Next.js config
tailwind.config.ts      # Tailwind setup
tsconfig.json           # TypeScript config with path aliases
package.json            # Scripts and deps
```

## Supabase management (CLI + migrations)
- Requirements: Docker running, Supabase CLI (`brew install supabase/tap/supabase`), and `supabase login`.
- Local dev: `pnpm supabase:start` (first run pulls containers). Copy anon/service_role keys and `http://127.0.0.1:54321` from `pnpm supabase:status` into `.env.local` if you want the app to hit local Supabase; stop with `pnpm supabase:stop`.
- Schema/migrations: `pnpm supabase:pull` (linked project) to capture current cloud schema, `supabase migration new <name>` to add SQL, `pnpm supabase:reset` to apply locally, `pnpm supabase:push` (linked) after review to apply to cloud (prefer from CI/staging).
- Types: `pnpm supabase:types` (linked) refreshes `types/supabase.ts` after schema changes.
- Details and sequence: `supabase/README.md`.

## Notes
- Google Analytics loads only when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set.
- Supabase service role key is used solely in server routes that mutate profile data.

## Support
- Website: [dsml.kz](https://dsml.kz)
- Email: info@dsml.kz
- Telegram: [@dsmlkz](https://t.me/dsmlkz)
