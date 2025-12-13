-- Broaden read access for public profile data used in faces/dashboards/public pages.
-- Avatars already have a read policy; add a public read policy for profiles.
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles
  FOR SELECT
  TO anon, authenticated
  USING (true);
