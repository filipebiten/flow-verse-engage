-- Criar função para verificar se usuário é admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$;

-- Adicionar políticas para admins poderem gerenciar tudo
CREATE POLICY "Admins can do everything on missions" ON public.missions 
FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "Admins can do everything on books" ON public.books 
FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "Admins can do everything on courses" ON public.courses 
FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "Admins can read all profiles" ON public.profiles 
FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "Admins can update all profiles" ON public.profiles 
FOR UPDATE TO authenticated USING (public.is_admin());