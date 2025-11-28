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

## Project Structure
```
app/                    # App Router routes
  (public)/news, jobs/  # public feeds + detail pages
  (protected)/...       # dashboard and profile (auth guarded)
  articles/             # articles, interviews, markdown content + utils
  auth/                 # auth flows (signin/signup/reset/email verification)
  users/[nickname]/     # public member profiles
  client-layout.tsx     # shell layout with navigation/footer
features/               # domain logic (auth, profile, search, cities, i18n, editor)
widgets/                # page sections/cards (home, news feed, jobs feed wrappers, faces, etc.)
shared/                 # ui primitives + hooks (toast, blob image, error boundary)
components/ui/          # shadcn/Radix primitives kept for legacy usage
contexts/               # auth, language, and Supabase contexts
lib/                    # Supabase clients, translations, utils, logging
translations/           # en/ru/kk dictionaries
public/                 # static assets, sitemap, robots
styles/, types/         # Tailwind setup and Supabase types
```

## Notes
- Google Analytics loads only when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set.
- Supabase service role key is used solely in server routes that mutate profile data.

## Support
- Website: [dsml.kz](https://dsml.kz)
- Email: info@dsml.kz
- Telegram: [@dsmlkz](https://t.me/dsmlkz)
