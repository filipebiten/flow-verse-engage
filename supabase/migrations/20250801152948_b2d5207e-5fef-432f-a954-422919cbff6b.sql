-- Garantir que RLS está desabilitado em todas as tabelas
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.books DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions_completed DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.phase_changes DISABLE ROW LEVEL SECURITY;

-- Garantir que o usuário filipebiten@gmail.com seja admin
UPDATE public.profiles 
SET is_admin = true 
WHERE email = 'filipebiten@gmail.com';

-- Se o usuário não existir, inserir como admin
INSERT INTO public.profiles (id, name, email, is_admin)
SELECT 
  gen_random_uuid(),
  'Felipe Biten',
  'filipebiten@gmail.com',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE email = 'filipebiten@gmail.com'
);