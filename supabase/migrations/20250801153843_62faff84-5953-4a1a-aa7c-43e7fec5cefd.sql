-- Corrigir as funções existentes para ter search_path seguro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_user_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Ensure the profile is created with proper defaults
  INSERT INTO public.profiles (
    id, 
    name, 
    email,
    points,
    phase,
    consecutive_days,
    is_admin
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email::text),
    NEW.email,
    0,
    'Semente',
    0,
    COALESCE((NEW.raw_user_meta_data->>'is_admin')::boolean, false)
  ) ON CONFLICT (id) DO UPDATE SET
    name = COALESCE(NEW.raw_user_meta_data->>'name', NEW.email::text),
    email = NEW.email,
    is_admin = COALESCE((NEW.raw_user_meta_data->>'is_admin')::boolean, false);
    
  RETURN NEW;
END;
$function$;

-- Verificar se existem triggers ativos na tabela auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Criar trigger correto para novos usuários
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_signup();

-- Habilitar RLS novamente nas tabelas mas com políticas permissivas para admin
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions_completed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phase_changes ENABLE ROW LEVEL SECURITY;

-- Criar políticas básicas para funcionamento
CREATE POLICY "Enable read for all users" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Enable update for users based on id" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable read for all authenticated users" ON public.missions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable read for all authenticated users" ON public.books FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable read for all authenticated users" ON public.courses FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable all for authenticated users" ON public.missions_completed FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Enable all for authenticated users" ON public.user_badges FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Enable all for authenticated users" ON public.phase_changes FOR ALL TO authenticated USING (auth.uid() = user_id);