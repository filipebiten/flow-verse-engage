
-- Clear all data from tables
DELETE FROM public.missions_completed;
DELETE FROM public.phase_changes;
DELETE FROM public.user_badges;
DELETE FROM public.profiles;
DELETE FROM public.missions;
DELETE FROM public.books;
DELETE FROM public.courses;

-- Insert only the admin user profile
INSERT INTO public.profiles (id, name, email, is_admin)
VALUES (
  'd9d967df-6b51-4c06-81c5-2fcd65fbe36b'::uuid,
  'Filipe Admin',
  'filipebiten@gmail.com',
  true
);
