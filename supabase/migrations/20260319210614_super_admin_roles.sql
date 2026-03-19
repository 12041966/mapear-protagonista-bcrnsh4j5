DO $$
BEGIN

  -- Define is_super_admin function
  CREATE OR REPLACE FUNCTION public.is_super_admin()
  RETURNS boolean
  LANGUAGE sql
  SECURITY DEFINER
  AS $func$
    SELECT EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE id = auth.uid() AND email = 'ferbatsan@hotmail.com'
    );
  $func$;

  -- Redefine is_admin() to be STRICTLY the platform admin, preserving legacy checks
  -- But wait, regular Admins use is_company_admin(), so keeping is_admin() for super admin is clean.
  CREATE OR REPLACE FUNCTION public.is_admin()
  RETURNS boolean
  LANGUAGE sql
  SECURITY DEFINER
  AS $func$
    SELECT EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE id = auth.uid() AND email = 'ferbatsan@hotmail.com'
    );
  $func$;

  -- Add policies to bypass RLS for super admin explicitely
  -- empresas
  DROP POLICY IF EXISTS "Super admins can do all on empresas" ON public.empresas;
  CREATE POLICY "Super admins can do all on empresas" ON public.empresas
    FOR ALL TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

  -- profiles
  DROP POLICY IF EXISTS "Super admins can do all on profiles" ON public.profiles;
  CREATE POLICY "Super admins can do all on profiles" ON public.profiles
    FOR ALL TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

  -- observacoes
  DROP POLICY IF EXISTS "Super admins can do all on observacoes" ON public.observacoes;
  CREATE POLICY "Super admins can do all on observacoes" ON public.observacoes
    FOR ALL TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

  -- configuracoes_sistema
  DROP POLICY IF EXISTS "Super admins can do all on configuracoes_sistema" ON public.configuracoes_sistema;
  CREATE POLICY "Super admins can do all on configuracoes_sistema" ON public.configuracoes_sistema
    FOR ALL TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

  -- efetivo_mensal
  DROP POLICY IF EXISTS "Super admins can do all on efetivo_mensal" ON public.efetivo_mensal;
  CREATE POLICY "Super admins can do all on efetivo_mensal" ON public.efetivo_mensal
    FOR ALL TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

  -- Update ferbatsan@hotmail.com
  UPDATE public.profiles SET role = 'Administrador' WHERE email = 'ferbatsan@hotmail.com';
  UPDATE auth.users 
  SET raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{role}', '"Administrador"') 
  WHERE email = 'ferbatsan@hotmail.com';

END $$;
