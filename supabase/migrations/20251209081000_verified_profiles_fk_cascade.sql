-- Allow profile nickname updates to cascade into verified_profiles
ALTER TABLE public.verified_profiles
DROP CONSTRAINT IF EXISTS verified_profiles_nickname_fkey;

ALTER TABLE public.verified_profiles
ADD CONSTRAINT verified_profiles_nickname_fkey
FOREIGN KEY (nickname)
REFERENCES public.profiles (nickname)
ON UPDATE CASCADE
ON DELETE CASCADE;
