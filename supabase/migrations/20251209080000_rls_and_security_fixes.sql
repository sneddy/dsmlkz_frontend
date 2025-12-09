-- Ensure the public_profiles view executes with caller privileges
CREATE OR REPLACE VIEW public.public_profiles
WITH (security_invoker = true) AS
SELECT
  p.id,
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
  a.url AS avatar_url
FROM public.profiles AS p
LEFT JOIN public.avatars AS a
  ON p.id = a.user_id AND a.is_current = true;

-- Enable RLS on public tables exposed via PostgREST
ALTER TABLE public.job_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channels_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities_index ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telegram_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_faces ENABLE ROW LEVEL SECURITY;

-- Read policies (public data)
DROP POLICY IF EXISTS "read_public_job_details" ON public.job_details;
CREATE POLICY "read_public_job_details"
  ON public.job_details
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "read_public_channels_content" ON public.channels_content;
CREATE POLICY "read_public_channels_content"
  ON public.channels_content
  FOR SELECT
  TO anon, authenticated
  USING (COALESCE(is_public, true));

DROP POLICY IF EXISTS "read_public_cities_index" ON public.cities_index;
CREATE POLICY "read_public_cities_index"
  ON public.cities_index
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "read_public_community_faces" ON public.community_faces;
CREATE POLICY "read_public_community_faces"
  ON public.community_faces
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Restrictive: Telegram links visible only to authenticated users
DROP POLICY IF EXISTS "read_auth_telegram_links" ON public.telegram_links;
CREATE POLICY "read_auth_telegram_links"
  ON public.telegram_links
  FOR SELECT
  TO authenticated
  USING (true);
