# Supabase workflow

Manage Supabase via CLI, migrations, and generated types (no manual clicks).

## Prerequisites
- Docker running (Supabase CLI spins up local containers).
- Supabase CLI installed: https://supabase.com/docs/guides/cli/getting-started
- Logged in once: `supabase login` (stores token in `~/.supabase`).
- Link project once: `pnpm supabase:link` (uses ref `swfxusemimczhhhfzjhc`).

## Local stack
- Start containers: `pnpm supabase:start` (first run pulls images).
- Status/stop: `pnpm supabase:status` / `pnpm supabase:stop`.
- After start, CLI prints `anon`, `service_role`, and API URL `http://127.0.0.1:54321`; put them into `.env.local` if you want the app to hit local Supabase (do not commit).
- Reset DB and apply migrations: `pnpm supabase:reset` (applies `supabase/migrations`).

## Migrations and schema
1) Pull current cloud schema into SQL: `pnpm supabase:pull` (uses the linked project, drops a file into `supabase/migrations` with a `remote` suffix).  
2) Create a new migration: `supabase migration new <name>` (generates SQL under `supabase/migrations`).  
3) Apply locally: `pnpm supabase:reset`, run the app, test.  
4) Push to cloud after review: `pnpm supabase:push` (uses the linked project + your CLI login). Prefer running from CI/staging.  
5) Keep RLS policies/functions in SQL (`supabase/policies`, `supabase/seed`) and include them in migrations via `\\i` if needed.

## TypeScript types
- Generate from live schema: `pnpm supabase:types` (linked project) → overwrites `types/supabase.ts`.  
- Run after any schema change to keep client/SSR code type-safe.

## Repo contents
- CLI config: `supabase/config.toml`
- Buckets for migrations/policies/seed: `supabase/migrations`, `supabase/policies`, `supabase/seed`
- Local volumes/temp files are gitignored in `.gitignore`
