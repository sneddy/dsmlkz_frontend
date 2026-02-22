-- Normalize schema to remove duplicated entity storage while preserving read compatibility.
-- Canonical write tables introduced:
--   - telegram_channels
--   - telegram_posts
--   - job_posts
--   - job_post_contacts
--   - profile_telegram_links
--   - profile_verifications
--
-- Legacy duplicated tables are renamed to *_legacy and replaced by compatibility views:
--   - channels_content
--   - job_details
--   - telegram_links
--   - verified_profiles

-- 1) Canonical tables
CREATE TABLE IF NOT EXISTS public.telegram_channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_chat_id bigint NOT NULL UNIQUE,
  username text,
  title text,
  is_public boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.telegram_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid REFERENCES public.telegram_channels(id) ON UPDATE CASCADE ON DELETE SET NULL,
  message_id bigint,
  created_at timestamptz,
  inserted_at timestamptz NOT NULL DEFAULT now(),
  html_text text NOT NULL DEFAULT '',
  image_url text,
  post_link text,
  sender_id bigint,
  sender_name text,
  content_kind text NOT NULL DEFAULT 'news'
    CHECK (content_kind IN ('news', 'job', 'other'))
);

CREATE TABLE IF NOT EXISTS public.job_posts (
  post_id uuid PRIMARY KEY REFERENCES public.telegram_posts(id) ON UPDATE CASCADE ON DELETE CASCADE,
  position text,
  company_name text,
  salary_range text,
  location text,
  company_description text,
  responsibilities text[],
  requirements text[],
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.job_post_contacts (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  post_id uuid NOT NULL REFERENCES public.job_posts(post_id) ON UPDATE CASCADE ON DELETE CASCADE,
  contact_kind text NOT NULL CHECK (contact_kind IN ('email', 'telegram', 'phone', 'url', 'other')),
  contact_value text NOT NULL,
  sort_order smallint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_id, contact_kind, contact_value)
);

CREATE TABLE IF NOT EXISTS public.profile_telegram_links (
  profile_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE,
  telegram_id bigint NOT NULL UNIQUE,
  telegram_login text,
  linked_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.profile_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE,
  telegram_id bigint NOT NULL UNIQUE,
  telegram_login text,
  telegram_avatar_url text,
  verification_status text NOT NULL DEFAULT 'verified'
    CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.schema_normalization_conflicts (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  entity_type text NOT NULL,
  legacy_key text NOT NULL,
  reason text NOT NULL,
  payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE IF EXISTS public.verified_profiles
  ADD COLUMN IF NOT EXISTS profile_id uuid;

CREATE INDEX IF NOT EXISTS telegram_posts_channel_created_idx
  ON public.telegram_posts (channel_id, created_at DESC);
CREATE INDEX IF NOT EXISTS telegram_posts_kind_created_idx
  ON public.telegram_posts (content_kind, created_at DESC);
CREATE INDEX IF NOT EXISTS job_posts_location_idx
  ON public.job_posts (lower(location));
CREATE INDEX IF NOT EXISTS job_post_contacts_post_kind_idx
  ON public.job_post_contacts (post_id, contact_kind);
CREATE INDEX IF NOT EXISTS profile_verifications_status_idx
  ON public.profile_verifications (verification_status);

DROP TRIGGER IF EXISTS update_telegram_channels_modtime ON public.telegram_channels;
CREATE TRIGGER update_telegram_channels_modtime
BEFORE UPDATE ON public.telegram_channels
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

DROP TRIGGER IF EXISTS update_profile_telegram_links_modtime ON public.profile_telegram_links;
CREATE TRIGGER update_profile_telegram_links_modtime
BEFORE UPDATE ON public.profile_telegram_links
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

DROP TRIGGER IF EXISTS update_profile_verifications_modtime ON public.profile_verifications;
CREATE TRIGGER update_profile_verifications_modtime
BEFORE UPDATE ON public.profile_verifications
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

-- 2) Backfill channels
WITH deduped_channels AS (
  SELECT
    cc.channel_id AS telegram_chat_id,
    max(
      CASE
        WHEN cc.post_link ~ '^https?://t\.me/c/' THEN NULL
        ELSE substring(cc.post_link FROM '^https?://t\.me/([^/]+)/')
      END
    ) AS username,
    max(NULLIF(cc.channel_name, '')) AS title,
    bool_or(COALESCE(cc.is_public, true)) AS is_public,
    COALESCE(min(cc.inserted_at::timestamptz), now()) AS created_at
  FROM public.channels_content cc
  WHERE cc.channel_id IS NOT NULL
  GROUP BY cc.channel_id
)
INSERT INTO public.telegram_channels (telegram_chat_id, username, title, is_public, created_at, updated_at)
SELECT
  dc.telegram_chat_id,
  dc.username,
  dc.title,
  dc.is_public,
  dc.created_at,
  now()
FROM deduped_channels dc
ON CONFLICT (telegram_chat_id) DO UPDATE
SET
  username = COALESCE(EXCLUDED.username, public.telegram_channels.username),
  title = COALESCE(EXCLUDED.title, public.telegram_channels.title),
  is_public = COALESCE(EXCLUDED.is_public, public.telegram_channels.is_public),
  updated_at = now();

-- 3) Backfill posts from channels_content
INSERT INTO public.telegram_posts (
  id,
  channel_id,
  message_id,
  created_at,
  inserted_at,
  html_text,
  image_url,
  post_link,
  sender_id,
  sender_name,
  content_kind
)
SELECT
  cc.post_id,
  tc.id,
  cc.message_id,
  cc.created_at::timestamptz,
  COALESCE(cc.inserted_at::timestamptz, now()),
  COALESCE(cc.html_text, ''),
  cc.image_url,
  cc.post_link,
  cc.sender_id,
  cc.sender_name,
  CASE WHEN jd.post_id IS NULL THEN 'news' ELSE 'job' END
FROM public.channels_content cc
LEFT JOIN public.telegram_channels tc
  ON tc.telegram_chat_id = cc.channel_id
LEFT JOIN public.job_details jd
  ON jd.post_id = cc.post_id
ON CONFLICT (id) DO NOTHING;

-- 4) Backfill orphan job posts that had details without content row
INSERT INTO public.telegram_posts (
  id,
  content_kind,
  html_text,
  inserted_at,
  created_at
)
SELECT
  jd.post_id,
  'job',
  '',
  COALESCE(jd.created_at::timestamptz, now()),
  jd.created_at::timestamptz
FROM public.job_details jd
LEFT JOIN public.telegram_posts tp
  ON tp.id = jd.post_id
WHERE tp.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- 5) Backfill job_posts (one canonical row per post_id)
WITH latest_job_details AS (
  SELECT DISTINCT ON (jd.post_id)
    jd.post_id,
    jd.position,
    jd.company_name,
    jd.salary_range,
    jd.location,
    jd.company_description,
    jd.responsibilities,
    jd.requirements,
    jd.created_at
  FROM public.job_details jd
  ORDER BY jd.post_id, jd.created_at DESC NULLS LAST
)
INSERT INTO public.job_posts (
  post_id,
  position,
  company_name,
  salary_range,
  location,
  company_description,
  responsibilities,
  requirements,
  created_at
)
SELECT
  l.post_id,
  l.position,
  l.company_name,
  l.salary_range,
  l.location,
  l.company_description,
  l.responsibilities,
  l.requirements,
  COALESCE(l.created_at::timestamptz, now())
FROM latest_job_details l
ON CONFLICT (post_id) DO UPDATE
SET
  position = EXCLUDED.position,
  company_name = EXCLUDED.company_name,
  salary_range = EXCLUDED.salary_range,
  location = EXCLUDED.location,
  company_description = EXCLUDED.company_description,
  responsibilities = EXCLUDED.responsibilities,
  requirements = EXCLUDED.requirements;

-- 6) Backfill normalized job contacts
WITH latest_job_contacts AS (
  SELECT DISTINCT ON (jd.post_id)
    jd.post_id,
    COALESCE(jd.contacts, '{}'::jsonb) AS contacts
  FROM public.job_details jd
  ORDER BY jd.post_id, jd.created_at DESC NULLS LAST
),
email_contacts AS (
  SELECT
    ljc.post_id,
    'email'::text AS contact_kind,
    value AS contact_value,
    row_number() OVER (PARTITION BY ljc.post_id ORDER BY value) - 1 AS sort_order
  FROM latest_job_contacts ljc,
  LATERAL jsonb_array_elements_text(COALESCE(ljc.contacts->'emails', '[]'::jsonb)) AS value
),
telegram_contacts AS (
  SELECT
    ljc.post_id,
    'telegram'::text AS contact_kind,
    value AS contact_value,
    row_number() OVER (PARTITION BY ljc.post_id ORDER BY value) - 1 AS sort_order
  FROM latest_job_contacts ljc,
  LATERAL jsonb_array_elements_text(COALESCE(ljc.contacts->'telegram', '[]'::jsonb)) AS value
),
merged_contacts AS (
  SELECT * FROM email_contacts
  UNION ALL
  SELECT * FROM telegram_contacts
)
INSERT INTO public.job_post_contacts (post_id, contact_kind, contact_value, sort_order)
SELECT
  mc.post_id,
  mc.contact_kind,
  mc.contact_value,
  mc.sort_order
FROM merged_contacts mc
WHERE NULLIF(mc.contact_value, '') IS NOT NULL
ON CONFLICT (post_id, contact_kind, contact_value) DO NOTHING;

-- 7) Backfill profile_telegram_links from telegram_links + profiles
WITH resolved_links AS (
  SELECT
    tl.id AS legacy_id,
    tl.nickname,
    tl.telegram_id,
    tl.telegram_account,
    tl.created_at,
    p.id AS profile_id,
    row_number() OVER (
      PARTITION BY p.id
      ORDER BY tl.created_at DESC NULLS LAST, tl.id DESC
    ) AS rn_profile,
    row_number() OVER (
      PARTITION BY tl.telegram_id
      ORDER BY tl.created_at DESC NULLS LAST, tl.id DESC
    ) AS rn_telegram
  FROM public.telegram_links tl
  LEFT JOIN public.profiles p
    ON p.nickname = tl.nickname
),
selected_links AS (
  SELECT *
  FROM resolved_links
  WHERE profile_id IS NOT NULL
    AND rn_profile = 1
    AND rn_telegram = 1
)
INSERT INTO public.profile_telegram_links (
  profile_id,
  telegram_id,
  telegram_login,
  linked_at,
  updated_at
)
SELECT
  sl.profile_id,
  sl.telegram_id,
  sl.telegram_account,
  COALESCE(sl.created_at::timestamptz, now()),
  now()
FROM selected_links sl
ON CONFLICT (profile_id) DO UPDATE
SET
  telegram_id = EXCLUDED.telegram_id,
  telegram_login = EXCLUDED.telegram_login,
  updated_at = now();

WITH resolved_links AS (
  SELECT
    tl.id AS legacy_id,
    tl.nickname,
    tl.telegram_id,
    tl.telegram_account,
    tl.created_at,
    p.id AS profile_id,
    row_number() OVER (
      PARTITION BY p.id
      ORDER BY tl.created_at DESC NULLS LAST, tl.id DESC
    ) AS rn_profile,
    row_number() OVER (
      PARTITION BY tl.telegram_id
      ORDER BY tl.created_at DESC NULLS LAST, tl.id DESC
    ) AS rn_telegram
  FROM public.telegram_links tl
  LEFT JOIN public.profiles p
    ON p.nickname = tl.nickname
)
INSERT INTO public.schema_normalization_conflicts (entity_type, legacy_key, reason, payload)
SELECT
  'telegram_links',
  rl.legacy_id::text,
  CASE
    WHEN rl.profile_id IS NULL THEN 'nickname_not_found_in_profiles'
    WHEN rl.rn_profile > 1 THEN 'duplicate_for_profile_kept_latest'
    WHEN rl.rn_telegram > 1 THEN 'duplicate_for_telegram_kept_latest'
    ELSE 'unknown'
  END,
  to_jsonb(rl)
FROM resolved_links rl
WHERE rl.profile_id IS NULL
   OR rl.rn_profile > 1
   OR rl.rn_telegram > 1;

-- 8) Backfill profile_verifications from verified_profiles + profiles
WITH resolved_verifications AS (
  SELECT
    vp.id AS legacy_id,
    COALESCE(vp.profile_id, p.id) AS profile_id,
    vp.telegram_id,
    vp.telegram_login,
    vp.telegram_avatar_url,
    vp.inserted_at,
    row_number() OVER (
      PARTITION BY COALESCE(vp.profile_id, p.id)
      ORDER BY vp.inserted_at DESC NULLS LAST, vp.id DESC
    ) AS rn_profile,
    row_number() OVER (
      PARTITION BY vp.telegram_id
      ORDER BY vp.inserted_at DESC NULLS LAST, vp.id DESC
    ) AS rn_telegram
  FROM public.verified_profiles vp
  LEFT JOIN public.profiles p
    ON p.nickname = vp.nickname
),
selected_verifications AS (
  SELECT *
  FROM resolved_verifications
  WHERE profile_id IS NOT NULL
    AND telegram_id IS NOT NULL
    AND rn_profile = 1
    AND rn_telegram = 1
)
INSERT INTO public.profile_verifications (
  profile_id,
  telegram_id,
  telegram_login,
  telegram_avatar_url,
  verification_status,
  verified_at,
  created_at,
  updated_at
)
SELECT
  sv.profile_id,
  sv.telegram_id,
  sv.telegram_login,
  sv.telegram_avatar_url,
  'verified',
  COALESCE(sv.inserted_at, now()),
  COALESCE(sv.inserted_at, now()),
  now()
FROM selected_verifications sv
ON CONFLICT (profile_id) DO UPDATE
SET
  telegram_id = EXCLUDED.telegram_id,
  telegram_login = EXCLUDED.telegram_login,
  telegram_avatar_url = EXCLUDED.telegram_avatar_url,
  verification_status = EXCLUDED.verification_status,
  verified_at = EXCLUDED.verified_at,
  updated_at = now();

WITH resolved_verifications AS (
  SELECT
    vp.id AS legacy_id,
    COALESCE(vp.profile_id, p.id) AS profile_id,
    vp.telegram_id,
    vp.telegram_login,
    vp.telegram_avatar_url,
    vp.inserted_at,
    row_number() OVER (
      PARTITION BY COALESCE(vp.profile_id, p.id)
      ORDER BY vp.inserted_at DESC NULLS LAST, vp.id DESC
    ) AS rn_profile,
    row_number() OVER (
      PARTITION BY vp.telegram_id
      ORDER BY vp.inserted_at DESC NULLS LAST, vp.id DESC
    ) AS rn_telegram
  FROM public.verified_profiles vp
  LEFT JOIN public.profiles p
    ON p.nickname = vp.nickname
)
INSERT INTO public.schema_normalization_conflicts (entity_type, legacy_key, reason, payload)
SELECT
  'verified_profiles',
  rv.legacy_id::text,
  CASE
    WHEN rv.profile_id IS NULL THEN 'profile_not_found'
    WHEN rv.telegram_id IS NULL THEN 'telegram_id_missing'
    WHEN rv.rn_profile > 1 THEN 'duplicate_for_profile_kept_latest'
    WHEN rv.rn_telegram > 1 THEN 'duplicate_for_telegram_kept_latest'
    ELSE 'unknown'
  END,
  to_jsonb(rv)
FROM resolved_verifications rv
WHERE rv.profile_id IS NULL
   OR rv.telegram_id IS NULL
   OR rv.rn_profile > 1
   OR rv.rn_telegram > 1;

-- Ensure verified members always have a link record.
INSERT INTO public.profile_telegram_links (profile_id, telegram_id, telegram_login, linked_at, updated_at)
SELECT
  pv.profile_id,
  pv.telegram_id,
  pv.telegram_login,
  COALESCE(pv.verified_at, pv.created_at, now()),
  now()
FROM public.profile_verifications pv
WHERE NOT EXISTS (
  SELECT 1
  FROM public.profile_telegram_links ptl
  WHERE ptl.profile_id = pv.profile_id
     OR ptl.telegram_id = pv.telegram_id
)
ON CONFLICT (profile_id) DO NOTHING;

-- 9) Replace duplicated legacy tables with compatibility views
ALTER TABLE IF EXISTS public.channels_content RENAME TO channels_content_legacy;
ALTER TABLE IF EXISTS public.job_details RENAME TO job_details_legacy;
ALTER TABLE IF EXISTS public.telegram_links RENAME TO telegram_links_legacy;
ALTER TABLE IF EXISTS public.verified_profiles RENAME TO verified_profiles_legacy;

CREATE OR REPLACE VIEW public.channels_content AS
SELECT
  tp.id AS post_id,
  tc.telegram_chat_id AS channel_id,
  tc.title AS channel_name,
  tp.message_id,
  tp.image_url,
  tp.created_at::timestamp without time zone AS created_at,
  tp.html_text,
  tp.post_link,
  COALESCE(tc.is_public, true) AS is_public,
  tp.sender_id,
  tp.sender_name,
  tp.inserted_at::timestamp without time zone AS inserted_at
FROM public.telegram_posts tp
LEFT JOIN public.telegram_channels tc
  ON tc.id = tp.channel_id;

CREATE OR REPLACE VIEW public.job_details AS
SELECT
  jp.post_id,
  jp.position,
  jp.company_name,
  jp.salary_range,
  jp.location,
  jp.company_description,
  jp.responsibilities,
  jp.requirements,
  jsonb_build_object(
    'emails',
    COALESCE((
      SELECT jsonb_agg(jpc.contact_value ORDER BY jpc.sort_order, jpc.id)
      FROM public.job_post_contacts jpc
      WHERE jpc.post_id = jp.post_id
        AND jpc.contact_kind = 'email'
    ), '[]'::jsonb),
    'telegram',
    COALESCE((
      SELECT jsonb_agg(jpc.contact_value ORDER BY jpc.sort_order, jpc.id)
      FROM public.job_post_contacts jpc
      WHERE jpc.post_id = jp.post_id
        AND jpc.contact_kind = 'telegram'
    ), '[]'::jsonb)
  ) AS contacts,
  jp.created_at::timestamp without time zone AS created_at
FROM public.job_posts jp;

CREATE OR REPLACE VIEW public.telegram_links AS
SELECT
  row_number() OVER (ORDER BY ptl.linked_at, ptl.profile_id) AS id,
  p.nickname,
  ptl.telegram_id,
  ptl.telegram_login AS telegram_account,
  ptl.linked_at::timestamp without time zone AS created_at
FROM public.profile_telegram_links ptl
JOIN public.profiles p
  ON p.id = ptl.profile_id;

CREATE OR REPLACE VIEW public.verified_profiles AS
SELECT
  pv.id,
  pv.telegram_id,
  pv.telegram_login,
  pv.telegram_avatar_url,
  p.nickname,
  p.first_name,
  p.last_name,
  p.current_city,
  p.university,
  p.relevant_company,
  p.relevant_position,
  p.about_you,
  p.motivation,
  p.linkedin,
  p.other_links,
  a.url AS avatar_url,
  pv.created_at AS inserted_at,
  pv.profile_id
FROM public.profile_verifications pv
JOIN public.profiles p
  ON p.id = pv.profile_id
LEFT JOIN public.avatars a
  ON a.user_id = p.id
 AND a.is_current = true
WHERE pv.verification_status = 'verified';

-- 10) Permissions and RLS
ALTER TABLE public.telegram_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telegram_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_post_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_telegram_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_verifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS telegram_channels_public_read ON public.telegram_channels;
CREATE POLICY telegram_channels_public_read
  ON public.telegram_channels
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS telegram_posts_public_read ON public.telegram_posts;
CREATE POLICY telegram_posts_public_read
  ON public.telegram_posts
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS job_posts_public_read ON public.job_posts;
CREATE POLICY job_posts_public_read
  ON public.job_posts
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS job_post_contacts_public_read ON public.job_post_contacts;
CREATE POLICY job_post_contacts_public_read
  ON public.job_post_contacts
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS profile_telegram_links_auth_read ON public.profile_telegram_links;
CREATE POLICY profile_telegram_links_auth_read
  ON public.profile_telegram_links
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS profile_verifications_public_read ON public.profile_verifications;
CREATE POLICY profile_verifications_public_read
  ON public.profile_verifications
  FOR SELECT
  TO anon, authenticated
  USING (verification_status = 'verified');

GRANT SELECT ON public.channels_content TO anon, authenticated, service_role;
GRANT SELECT ON public.job_details TO anon, authenticated, service_role;
GRANT SELECT ON public.telegram_links TO authenticated, service_role;
GRANT SELECT ON public.verified_profiles TO anon, authenticated, service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.telegram_channels TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.telegram_posts TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_posts TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_post_contacts TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profile_telegram_links TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profile_verifications TO service_role;
GRANT SELECT, INSERT ON public.schema_normalization_conflicts TO service_role;
