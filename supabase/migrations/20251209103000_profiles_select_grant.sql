-- Allow SELECT on profiles for anon/authenticated so public_profiles view works under RLS.
GRANT SELECT ON public.profiles TO anon, authenticated;
