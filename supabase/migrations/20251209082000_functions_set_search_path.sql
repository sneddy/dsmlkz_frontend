-- Harden functions by pinning search_path to public,extensions

CREATE OR REPLACE FUNCTION public.direct_insert_profile(
  p_id uuid,
  p_nickname text,
  p_first_name text,
  p_last_name text,
  p_birthday date,
  p_current_city text,
  p_university text,
  p_relevant_company text,
  p_relevant_position text,
  p_about_you text,
  p_motivation text,
  p_linkedin text,
  p_other_links text,
  p_secret_number integer
) RETURNS jsonb
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public, extensions
AS $$
DECLARE
  result JSONB;
  existing_profile_id UUID;
BEGIN
  -- Check if the user exists in auth.users
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = p_id) THEN
    RAISE EXCEPTION 'User with ID % does not exist in auth.users', p_id;
  END IF;
  
  -- Check if a profile already exists for this user
  SELECT id INTO existing_profile_id FROM public.profiles WHERE id = p_id;
  
  IF existing_profile_id IS NOT NULL THEN
    -- Update existing profile
    UPDATE public.profiles
    SET 
      nickname = p_nickname,
      first_name = p_first_name,
      last_name = p_last_name,
      birthday = p_birthday,
      current_city = p_current_city,
      university = p_university,
      relevant_company = p_relevant_company,
      relevant_position = p_relevant_position,
      about_you = p_about_you,
      motivation = p_motivation,
      linkedin = p_linkedin,
      other_links = p_other_links,
      secret_number = p_secret_number,
      updated_at = NOW()
    WHERE id = p_id;
    
    result = jsonb_build_object(
      'action', 'update',
      'id', p_id
    );
  ELSE
    -- Insert new profile
    INSERT INTO public.profiles (
      id,
      nickname,
      first_name,
      last_name,
      birthday,
      current_city,
      university,
      relevant_company,
      relevant_position,
      about_you,
      motivation,
      linkedin,
      other_links,
      secret_number,
      created_at,
      updated_at
    ) VALUES (
      p_id,
      p_nickname,
      p_first_name,
      p_last_name,
      p_birthday,
      p_current_city,
      p_university,
      p_relevant_company,
      p_relevant_position,
      p_about_you,
      p_motivation,
      p_linkedin,
      p_other_links,
      p_secret_number,
      NOW(),
      NOW()
    );
    
    result = jsonb_build_object(
      'action', 'insert',
      'id', p_id
    );
  END IF;
  
  RETURN result;
EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'Nickname % is already taken', p_nickname;
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error: %', SQLERRM;
END;
$$;


CREATE OR REPLACE FUNCTION public.direct_insert_profile_with_avatar_upload(
  p_id uuid,
  p_nickname text,
  p_first_name text,
  p_last_name text,
  p_birthday date,
  p_current_city text,
  p_university text,
  p_relevant_company text,
  p_relevant_position text,
  p_about_you text,
  p_motivation text,
  p_linkedin text,
  p_other_links text,
  p_secret_number integer,
  p_avatar_url text,
  p_avatar_file_name text DEFAULT 'avatar.jpg',
  p_avatar_file_size integer DEFAULT 0,
  p_avatar_content_type text DEFAULT 'image/jpeg'
) RETURNS jsonb
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public, extensions
AS $$
DECLARE
  result JSONB;
  profile_result JSONB;
  avatar_result JSONB;
BEGIN
  -- First insert/update the profile
  profile_result = direct_insert_profile(
    p_id, p_nickname, p_first_name, p_last_name, p_birthday, 
    p_current_city, p_university, p_relevant_company, p_relevant_position, 
    p_about_you, p_motivation, p_linkedin, p_other_links, p_secret_number
  );
  
  -- Then handle the avatar if provided
  IF p_avatar_url IS NOT NULL THEN
    avatar_result = manage_avatar_upload(
      p_id, 
      p_avatar_url, 
      p_avatar_file_name, 
      p_avatar_file_size, 
      p_avatar_content_type
    );
    result = profile_result || jsonb_build_object('avatar', avatar_result);
  ELSE
    result = profile_result;
  END IF;
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error: %', SQLERRM;
END;
$$;


CREATE OR REPLACE FUNCTION public.get_current_avatar(user_id uuid) RETURNS TABLE(
  id uuid,
  url text,
  file_name text,
  created_at timestamptz
)
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public, extensions
AS $$
BEGIN
  RETURN QUERY
  SELECT a.id, a.url, a.file_name, a.created_at
  FROM public.avatars a
  WHERE a.user_id = get_current_avatar.user_id AND a.is_current = true
  ORDER BY a.created_at DESC
  LIMIT 1;
END;
$$;


CREATE OR REPLACE FUNCTION public.manage_avatar_upload(
  p_user_id uuid,
  p_url text,
  p_file_name text,
  p_file_size integer,
  p_content_type text
) RETURNS jsonb
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public, extensions
AS $$
DECLARE
  result JSONB;
  new_avatar_id UUID;
BEGIN
  -- Check if the user exists in profiles
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'User with ID % does not exist in profiles', p_user_id;
  END IF;
  
  -- Set all existing avatars for this user to not current
  UPDATE public.avatars
  SET is_current = false
  WHERE user_id = p_user_id;
  
  -- Insert new avatar as current
  INSERT INTO public.avatars (
    user_id,
    url,
    file_name,
    file_size,
    content_type,
    is_current,
    created_at,
    updated_at
  ) VALUES (
    p_user_id,
    p_url,
    p_file_name,
    p_file_size,
    p_content_type,
    true,
    NOW(),
    NOW()
  ) RETURNING id INTO new_avatar_id;
  
  result = jsonb_build_object(
    'action', 'insert',
    'id', new_avatar_id,
    'user_id', p_user_id,
    'url', p_url,
    'is_current', true
  );
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error: %', SQLERRM;
END;
$$;


CREATE OR REPLACE FUNCTION public.set_current_avatar(avatar_id uuid) RETURNS boolean
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public, extensions
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Get the user_id for the avatar
  SELECT user_id INTO v_user_id FROM public.avatars WHERE id = avatar_id;
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Avatar with ID % not found', avatar_id;
  END IF;
  
  -- Set all avatars for this user to not current
  UPDATE public.avatars
  SET is_current = false
  WHERE user_id = v_user_id;
  
  -- Set the specified avatar as current
  UPDATE public.avatars
  SET is_current = true
  WHERE id = avatar_id;
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error: %', SQLERRM;
    RETURN false;
END;
$$;


CREATE OR REPLACE FUNCTION public.update_modified_column() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path = public, extensions
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


CREATE OR REPLACE FUNCTION public.update_profile(
  user_id uuid,
  profile_data jsonb
) RETURNS boolean
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public, extensions
AS $$
BEGIN
  UPDATE public.profiles
  SET 
    first_name = COALESCE(profile_data->>'first_name', first_name),
    last_name = COALESCE(profile_data->>'last_name', last_name),
    current_city = COALESCE(profile_data->>'current_city', current_city),
    university = profile_data->>'university',
    relevant_company = profile_data->>'relevant_company',
    relevant_position = profile_data->>'relevant_position',
    about_you = COALESCE(profile_data->>'about_you', about_you),
    motivation = COALESCE(profile_data->>'motivation', motivation),
    linkedin = profile_data->>'linkedin',
    other_links = profile_data->>'other_links'
  WHERE id = user_id;
  
  RETURN FOUND;
END;
$$;
