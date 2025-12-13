-- Harden profiles RLS while keeping public view access working.

-- Enforce RLS even for table owner
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;

-- Adjust privileges: keep direct table access restricted, expose view instead.
REVOKE ALL ON public.profiles FROM anon;
REVOKE ALL ON public.profiles FROM authenticated;
GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- Replace existing public-read policy with explicit policies
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Public read (used via public_profiles view; table select is revoked)
CREATE POLICY "profiles_public_read"
  ON public.profiles
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Owner read (explicit)
CREATE POLICY "profiles_owner_read"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Service role full read
CREATE POLICY "profiles_service_read"
  ON public.profiles
  FOR SELECT
  TO service_role
  USING (true);
