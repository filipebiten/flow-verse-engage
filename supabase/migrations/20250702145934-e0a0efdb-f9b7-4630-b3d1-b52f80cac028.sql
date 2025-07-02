
-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  birth_date DATE,
  gender TEXT,
  pgm_role TEXT,
  pgm_number TEXT,
  profile_photo_url TEXT,
  points INTEGER DEFAULT 0,
  phase TEXT DEFAULT 'Riacho',
  participates_flow_up BOOLEAN DEFAULT false,
  participates_irmandade BOOLEAN DEFAULT false,
  is_admin BOOLEAN DEFAULT false,
  consecutive_days INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create missions table
CREATE TABLE public.missions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  points INTEGER NOT NULL,
  period TEXT,
  mission_type TEXT DEFAULT 'mission',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create books table
CREATE TABLE public.books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  points INTEGER NOT NULL,
  mission_type TEXT DEFAULT 'book',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create courses table
CREATE TABLE public.courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  points INTEGER NOT NULL,
  school TEXT,
  mission_type TEXT DEFAULT 'course',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_badges table
CREATE TABLE public.user_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  badge_name TEXT NOT NULL,
  badge_icon TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create phase_changes table
CREATE TABLE public.phase_changes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  previous_phase TEXT NOT NULL,
  new_phase TEXT NOT NULL,
  phase_icon TEXT,
  total_points INTEGER NOT NULL,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phase_changes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Missions, books, courses - public read access for all authenticated users
CREATE POLICY "Authenticated users can view missions" ON public.missions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view books" ON public.books FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view courses" ON public.courses FOR SELECT TO authenticated USING (true);

-- Admin policies for missions, books, courses
CREATE POLICY "Admins can manage missions" ON public.missions FOR ALL TO authenticated USING (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);
CREATE POLICY "Admins can manage books" ON public.books FOR ALL TO authenticated USING (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);
CREATE POLICY "Admins can manage courses" ON public.courses FOR ALL TO authenticated USING (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);

-- User badges policies
CREATE POLICY "Users can view their own badges" ON public.user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own badges" ON public.user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Phase changes policies
CREATE POLICY "Users can view their own phase changes" ON public.phase_changes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own phase changes" ON public.phase_changes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
