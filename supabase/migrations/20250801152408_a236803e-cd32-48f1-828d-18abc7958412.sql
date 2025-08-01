-- Disable Row Level Security on all tables to allow testing
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.books DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions_completed DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.phase_changes DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies (they will be recreated when RLS is re-enabled later)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

DROP POLICY IF EXISTS "Authenticated users can view missions" ON public.missions;
DROP POLICY IF EXISTS "Admins can manage missions" ON public.missions;

DROP POLICY IF EXISTS "Authenticated users can view books" ON public.books;
DROP POLICY IF EXISTS "Admins can manage books" ON public.books;

DROP POLICY IF EXISTS "Authenticated users can view courses" ON public.courses;
DROP POLICY IF EXISTS "Admins can manage courses" ON public.courses;

DROP POLICY IF EXISTS "Users can view their own completed missions" ON public.missions_completed;
DROP POLICY IF EXISTS "Users can insert their own completed missions" ON public.missions_completed;
DROP POLICY IF EXISTS "Users can update their own completed missions" ON public.missions_completed;
DROP POLICY IF EXISTS "Users can delete their own completed missions" ON public.missions_completed;

DROP POLICY IF EXISTS "Users can view their own badges" ON public.user_badges;
DROP POLICY IF EXISTS "Users can insert their own badges" ON public.user_badges;

DROP POLICY IF EXISTS "Users can view their own phase changes" ON public.phase_changes;
DROP POLICY IF EXISTS "Users can insert their own phase changes" ON public.phase_changes;