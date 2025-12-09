

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."direct_insert_profile"("p_id" "uuid", "p_nickname" "text", "p_first_name" "text", "p_last_name" "text", "p_birthday" "date", "p_current_city" "text", "p_university" "text", "p_relevant_company" "text", "p_relevant_position" "text", "p_about_you" "text", "p_motivation" "text", "p_linkedin" "text", "p_other_links" "text", "p_secret_number" integer) RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
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


ALTER FUNCTION "public"."direct_insert_profile"("p_id" "uuid", "p_nickname" "text", "p_first_name" "text", "p_last_name" "text", "p_birthday" "date", "p_current_city" "text", "p_university" "text", "p_relevant_company" "text", "p_relevant_position" "text", "p_about_you" "text", "p_motivation" "text", "p_linkedin" "text", "p_other_links" "text", "p_secret_number" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."direct_insert_profile_with_avatar_upload"("p_id" "uuid", "p_nickname" "text", "p_first_name" "text", "p_last_name" "text", "p_birthday" "date", "p_current_city" "text", "p_university" "text", "p_relevant_company" "text", "p_relevant_position" "text", "p_about_you" "text", "p_motivation" "text", "p_linkedin" "text", "p_other_links" "text", "p_secret_number" integer, "p_avatar_url" "text", "p_avatar_file_name" "text" DEFAULT 'avatar.jpg'::"text", "p_avatar_file_size" integer DEFAULT 0, "p_avatar_content_type" "text" DEFAULT 'image/jpeg'::"text") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
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


ALTER FUNCTION "public"."direct_insert_profile_with_avatar_upload"("p_id" "uuid", "p_nickname" "text", "p_first_name" "text", "p_last_name" "text", "p_birthday" "date", "p_current_city" "text", "p_university" "text", "p_relevant_company" "text", "p_relevant_position" "text", "p_about_you" "text", "p_motivation" "text", "p_linkedin" "text", "p_other_links" "text", "p_secret_number" integer, "p_avatar_url" "text", "p_avatar_file_name" "text", "p_avatar_file_size" integer, "p_avatar_content_type" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_current_avatar"("user_id" "uuid") RETURNS TABLE("id" "uuid", "url" "text", "file_name" "text", "created_at" timestamp with time zone)
    LANGUAGE "plpgsql" SECURITY DEFINER
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


ALTER FUNCTION "public"."get_current_avatar"("user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."manage_avatar_upload"("p_user_id" "uuid", "p_url" "text", "p_file_name" "text", "p_file_size" integer, "p_content_type" "text") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
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


ALTER FUNCTION "public"."manage_avatar_upload"("p_user_id" "uuid", "p_url" "text", "p_file_name" "text", "p_file_size" integer, "p_content_type" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_current_avatar"("avatar_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
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


ALTER FUNCTION "public"."set_current_avatar"("avatar_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_modified_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_modified_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_profile"("user_id" "uuid", "profile_data" "jsonb") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
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


ALTER FUNCTION "public"."update_profile"("user_id" "uuid", "profile_data" "jsonb") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."avatars" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "url" "text" NOT NULL,
    "file_name" "text" NOT NULL,
    "file_size" integer NOT NULL,
    "content_type" "text" NOT NULL,
    "is_current" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."avatars" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."channels_content" (
    "post_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "channel_id" bigint,
    "channel_name" "text",
    "message_id" bigint,
    "image_url" "text",
    "created_at" timestamp without time zone,
    "html_text" "text",
    "post_link" "text",
    "is_public" boolean,
    "sender_id" bigint,
    "sender_name" "text",
    "inserted_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."channels_content" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."cities_index" (
    "priority" smallint NOT NULL,
    "city" "text",
    "city_ascii" "text",
    "lat" double precision,
    "lng" double precision,
    "country" "text",
    "iso2" "text",
    "iso3" "text",
    "population" bigint,
    "city_ru" "text",
    "country_ru" "text"
);


ALTER TABLE "public"."cities_index" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."community_faces" (
    "id" bigint NOT NULL,
    "name" "text" NOT NULL,
    "title" "text",
    "title_ru" "text",
    "description" "text",
    "description_ru" "text",
    "location" "text",
    "image_path" "text",
    "linkedin" "text",
    "website" "text",
    "telegram" "text",
    "kaggle" "text",
    "display_order" integer,
    "user_id" bigint
);


ALTER TABLE "public"."community_faces" OWNER TO "postgres";


ALTER TABLE "public"."community_faces" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."community_faces_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."job_details" (
    "post_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "position" "text",
    "company_name" "text",
    "salary_range" "text",
    "location" "text",
    "company_description" "text",
    "responsibilities" "text"[],
    "requirements" "text"[],
    "contacts" "jsonb",
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."job_details" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "nickname" "text",
    "first_name" "text",
    "last_name" "text",
    "birthday" "date",
    "current_city" "text",
    "university" "text",
    "relevant_company" "text",
    "relevant_position" "text",
    "about_you" "text",
    "motivation" "text",
    "linkedin" "text",
    "other_links" "text",
    "secret_number" smallint,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."public_profiles" AS
 SELECT "p"."id",
    "p"."nickname",
    "p"."first_name",
    "p"."last_name",
    "p"."current_city",
    "p"."university",
    "p"."relevant_company",
    "p"."relevant_position",
    "p"."about_you",
    "p"."motivation",
    "p"."linkedin",
    "p"."other_links",
    "a"."url" AS "avatar_url"
   FROM ("public"."profiles" "p"
     LEFT JOIN "public"."avatars" "a" ON ((("p"."id" = "a"."user_id") AND ("a"."is_current" = true))));


ALTER TABLE "public"."public_profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."telegram_links" (
    "id" bigint NOT NULL,
    "nickname" "text" NOT NULL,
    "telegram_id" bigint NOT NULL,
    "telegram_account" "text",
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."telegram_links" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."telegram_links_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."telegram_links_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."telegram_links_id_seq" OWNED BY "public"."telegram_links"."id";



CREATE TABLE IF NOT EXISTS "public"."verified_profiles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "telegram_id" bigint NOT NULL,
    "telegram_login" "text",
    "telegram_avatar_url" "text",
    "nickname" "text" NOT NULL,
    "first_name" "text",
    "last_name" "text",
    "current_city" "text",
    "university" "text",
    "relevant_company" "text",
    "relevant_position" "text",
    "about_you" "text",
    "motivation" "text",
    "linkedin" "text",
    "other_links" "text",
    "avatar_url" "text",
    "inserted_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."verified_profiles" OWNER TO "postgres";


ALTER TABLE ONLY "public"."telegram_links" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."telegram_links_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."avatars"
    ADD CONSTRAINT "avatars_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."channels_content"
    ADD CONSTRAINT "channels_content_pkey" PRIMARY KEY ("post_id");



ALTER TABLE ONLY "public"."cities_index"
    ADD CONSTRAINT "cities_index_pkey" PRIMARY KEY ("priority");



ALTER TABLE ONLY "public"."community_faces"
    ADD CONSTRAINT "community_faces_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."job_details"
    ADD CONSTRAINT "job_details_pkey" PRIMARY KEY ("post_id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_nickname_key" UNIQUE ("nickname");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."telegram_links"
    ADD CONSTRAINT "telegram_links_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."telegram_links"
    ADD CONSTRAINT "unique_nickname" UNIQUE ("nickname");



ALTER TABLE ONLY "public"."verified_profiles"
    ADD CONSTRAINT "unique_verified_nickname" UNIQUE ("nickname");



ALTER TABLE ONLY "public"."verified_profiles"
    ADD CONSTRAINT "verified_profiles_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_verified_nickname" ON "public"."verified_profiles" USING "btree" ("nickname");



CREATE OR REPLACE TRIGGER "update_avatars_modtime" BEFORE UPDATE ON "public"."avatars" FOR EACH ROW EXECUTE FUNCTION "public"."update_modified_column"();



CREATE OR REPLACE TRIGGER "update_profiles_modtime" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."update_modified_column"();



ALTER TABLE ONLY "public"."avatars"
    ADD CONSTRAINT "avatars_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."verified_profiles"
    ADD CONSTRAINT "verified_profiles_nickname_fkey" FOREIGN KEY ("nickname") REFERENCES "public"."profiles"("nickname");



CREATE POLICY "Allow read for all" ON "public"."verified_profiles" FOR SELECT USING (true);



CREATE POLICY "Avatars are viewable by everyone" ON "public"."avatars" FOR SELECT USING (true);



CREATE POLICY "Users can delete their own avatars" ON "public"."avatars" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own avatars" ON "public"."avatars" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own profile" ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can update their own avatars" ON "public"."avatars" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own profile" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can view their own profile" ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "id"));



ALTER TABLE "public"."avatars" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."verified_profiles" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";




















































































































































































GRANT ALL ON FUNCTION "public"."direct_insert_profile"("p_id" "uuid", "p_nickname" "text", "p_first_name" "text", "p_last_name" "text", "p_birthday" "date", "p_current_city" "text", "p_university" "text", "p_relevant_company" "text", "p_relevant_position" "text", "p_about_you" "text", "p_motivation" "text", "p_linkedin" "text", "p_other_links" "text", "p_secret_number" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."direct_insert_profile"("p_id" "uuid", "p_nickname" "text", "p_first_name" "text", "p_last_name" "text", "p_birthday" "date", "p_current_city" "text", "p_university" "text", "p_relevant_company" "text", "p_relevant_position" "text", "p_about_you" "text", "p_motivation" "text", "p_linkedin" "text", "p_other_links" "text", "p_secret_number" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."direct_insert_profile"("p_id" "uuid", "p_nickname" "text", "p_first_name" "text", "p_last_name" "text", "p_birthday" "date", "p_current_city" "text", "p_university" "text", "p_relevant_company" "text", "p_relevant_position" "text", "p_about_you" "text", "p_motivation" "text", "p_linkedin" "text", "p_other_links" "text", "p_secret_number" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."direct_insert_profile_with_avatar_upload"("p_id" "uuid", "p_nickname" "text", "p_first_name" "text", "p_last_name" "text", "p_birthday" "date", "p_current_city" "text", "p_university" "text", "p_relevant_company" "text", "p_relevant_position" "text", "p_about_you" "text", "p_motivation" "text", "p_linkedin" "text", "p_other_links" "text", "p_secret_number" integer, "p_avatar_url" "text", "p_avatar_file_name" "text", "p_avatar_file_size" integer, "p_avatar_content_type" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."direct_insert_profile_with_avatar_upload"("p_id" "uuid", "p_nickname" "text", "p_first_name" "text", "p_last_name" "text", "p_birthday" "date", "p_current_city" "text", "p_university" "text", "p_relevant_company" "text", "p_relevant_position" "text", "p_about_you" "text", "p_motivation" "text", "p_linkedin" "text", "p_other_links" "text", "p_secret_number" integer, "p_avatar_url" "text", "p_avatar_file_name" "text", "p_avatar_file_size" integer, "p_avatar_content_type" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."direct_insert_profile_with_avatar_upload"("p_id" "uuid", "p_nickname" "text", "p_first_name" "text", "p_last_name" "text", "p_birthday" "date", "p_current_city" "text", "p_university" "text", "p_relevant_company" "text", "p_relevant_position" "text", "p_about_you" "text", "p_motivation" "text", "p_linkedin" "text", "p_other_links" "text", "p_secret_number" integer, "p_avatar_url" "text", "p_avatar_file_name" "text", "p_avatar_file_size" integer, "p_avatar_content_type" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_current_avatar"("user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_current_avatar"("user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_current_avatar"("user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."manage_avatar_upload"("p_user_id" "uuid", "p_url" "text", "p_file_name" "text", "p_file_size" integer, "p_content_type" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."manage_avatar_upload"("p_user_id" "uuid", "p_url" "text", "p_file_name" "text", "p_file_size" integer, "p_content_type" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."manage_avatar_upload"("p_user_id" "uuid", "p_url" "text", "p_file_name" "text", "p_file_size" integer, "p_content_type" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."set_current_avatar"("avatar_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."set_current_avatar"("avatar_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_current_avatar"("avatar_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_modified_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_modified_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_modified_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_profile"("user_id" "uuid", "profile_data" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."update_profile"("user_id" "uuid", "profile_data" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_profile"("user_id" "uuid", "profile_data" "jsonb") TO "service_role";


















GRANT ALL ON TABLE "public"."avatars" TO "anon";
GRANT ALL ON TABLE "public"."avatars" TO "authenticated";
GRANT ALL ON TABLE "public"."avatars" TO "service_role";



GRANT ALL ON TABLE "public"."channels_content" TO "anon";
GRANT ALL ON TABLE "public"."channels_content" TO "authenticated";
GRANT ALL ON TABLE "public"."channels_content" TO "service_role";



GRANT ALL ON TABLE "public"."cities_index" TO "anon";
GRANT ALL ON TABLE "public"."cities_index" TO "authenticated";
GRANT ALL ON TABLE "public"."cities_index" TO "service_role";



GRANT ALL ON TABLE "public"."community_faces" TO "anon";
GRANT ALL ON TABLE "public"."community_faces" TO "authenticated";
GRANT ALL ON TABLE "public"."community_faces" TO "service_role";



GRANT ALL ON SEQUENCE "public"."community_faces_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."community_faces_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."community_faces_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."job_details" TO "anon";
GRANT ALL ON TABLE "public"."job_details" TO "authenticated";
GRANT ALL ON TABLE "public"."job_details" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."public_profiles" TO "anon";
GRANT ALL ON TABLE "public"."public_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."public_profiles" TO "service_role";



GRANT ALL ON TABLE "public"."telegram_links" TO "anon";
GRANT ALL ON TABLE "public"."telegram_links" TO "authenticated";
GRANT ALL ON TABLE "public"."telegram_links" TO "service_role";



GRANT ALL ON SEQUENCE "public"."telegram_links_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."telegram_links_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."telegram_links_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."verified_profiles" TO "anon";
GRANT ALL ON TABLE "public"."verified_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."verified_profiles" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























drop extension if exists "pg_net";


  create policy "Allow uploads"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check ((bucket_id = 'telegram-images'::text));



  create policy "Avatars are publicly accessible"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'avatars'::text));



  create policy "Users can delete their own avatars"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using (((bucket_id = 'avatars'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));



  create policy "Users can update their own avatars"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using (((bucket_id = 'avatars'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));



  create policy "Users can upload their own avatars"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (((bucket_id = 'avatars'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));



