
-- Clear all data from tables
DELETE FROM public.missions_completed;
DELETE FROM public.phase_changes;
DELETE FROM public.user_badges;
DELETE FROM public.profiles;
DELETE FROM public.missions;
DELETE FROM public.books;
DELETE FROM public.courses;

-- Add profile_photo_url column if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS profile_photo_url TEXT;

-- Update the handle_new_user function to automatically make filipebiten@gmail.com admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, is_admin, whatsapp, birth_date, gender, pgm_role, pgm_number, participates_flow_up, participates_irmandade, profile_photo_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    CASE WHEN NEW.email = 'filipebiten@gmail.com' THEN true ELSE COALESCE((NEW.raw_user_meta_data->>'is_admin')::boolean, false) END,
    NEW.raw_user_meta_data->>'whatsapp',
    CASE WHEN NEW.raw_user_meta_data->>'birth_date' IS NOT NULL THEN (NEW.raw_user_meta_data->>'birth_date')::date ELSE NULL END,
    NEW.raw_user_meta_data->>'gender',
    NEW.raw_user_meta_data->>'pgm_role',
    NEW.raw_user_meta_data->>'pgm_number',
    COALESCE((NEW.raw_user_meta_data->>'participates_flow_up')::boolean, false),
    COALESCE((NEW.raw_user_meta_data->>'participates_irmandade')::boolean, false),
    NEW.raw_user_meta_data->>'profile_photo_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
