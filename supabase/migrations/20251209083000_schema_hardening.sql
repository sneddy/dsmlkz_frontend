-- Profiles: enforce nickname presence, add case-insensitive index
UPDATE public.profiles
SET nickname = concat('user-', left(id::text, 8))
WHERE nickname IS NULL;

ALTER TABLE public.profiles
  ALTER COLUMN nickname SET NOT NULL;

-- Non-unique index to speed case-insensitive lookups and prepare for potential uniqueness checks
CREATE INDEX IF NOT EXISTS profiles_nickname_lower_idx
  ON public.profiles (lower(nickname));

-- Verified profiles: relate by profile_id to profiles.id, keep nickname for display
ALTER TABLE public.verified_profiles
  ADD COLUMN IF NOT EXISTS profile_id uuid;

UPDATE public.verified_profiles vp
SET profile_id = p.id
FROM public.profiles p
WHERE vp.profile_id IS NULL AND p.nickname = vp.nickname;

-- Enforce link to profiles and cascade changes
ALTER TABLE public.verified_profiles
  ALTER COLUMN profile_id SET NOT NULL,
  DROP CONSTRAINT IF EXISTS verified_profiles_nickname_fkey,
  ADD CONSTRAINT verified_profiles_profile_id_fkey
    FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
    ON UPDATE CASCADE ON DELETE CASCADE;

-- Allow dedupe by temporarily permitting NULLs on telegram_id
ALTER TABLE public.verified_profiles
  ALTER COLUMN telegram_id DROP NOT NULL;

-- Deduplicate telegram_id before enforcing uniqueness: keep the earliest row, null others
WITH dupes AS (
  SELECT id, telegram_id,
         row_number() OVER (PARTITION BY telegram_id ORDER BY inserted_at NULLS LAST, id) AS rn
  FROM public.verified_profiles
  WHERE telegram_id IS NOT NULL
)
UPDATE public.verified_profiles vp
SET telegram_id = NULL
FROM dupes d
WHERE vp.id = d.id AND d.rn > 1;

-- Uniqueness for telegram_id; keep existing nickname uniqueness for display
CREATE UNIQUE INDEX IF NOT EXISTS verified_profiles_telegram_id_key
  ON public.verified_profiles (telegram_id)
  WHERE telegram_id IS NOT NULL;

-- Cities index: accelerate ILIKE searches
CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;

CREATE INDEX IF NOT EXISTS cities_index_city_trgm_idx
  ON public.cities_index USING gin (city gin_trgm_ops);
CREATE INDEX IF NOT EXISTS cities_index_city_ascii_trgm_idx
  ON public.cities_index USING gin (city_ascii gin_trgm_ops);
CREATE INDEX IF NOT EXISTS cities_index_country_trgm_idx
  ON public.cities_index USING gin (country gin_trgm_ops);
CREATE INDEX IF NOT EXISTS cities_index_city_ru_trgm_idx
  ON public.cities_index USING gin (city_ru gin_trgm_ops);
CREATE INDEX IF NOT EXISTS cities_index_country_ru_trgm_idx
  ON public.cities_index USING gin (country_ru gin_trgm_ops);

-- Community faces: align to profiles UUIDs without breaking existing data
ALTER TABLE public.community_faces
  ADD COLUMN IF NOT EXISTS profile_id uuid,
  ADD CONSTRAINT community_faces_display_order_positive CHECK (display_order IS NULL OR display_order > 0);

CREATE INDEX IF NOT EXISTS community_faces_display_order_idx
  ON public.community_faces (display_order);

ALTER TABLE public.community_faces
  ADD CONSTRAINT community_faces_profile_id_fkey
    FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
    ON UPDATE CASCADE ON DELETE SET NULL;
