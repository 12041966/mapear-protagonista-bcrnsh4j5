DO $$
BEGIN

  -- Criar função para verificar se o usuário atual é um Administrador
  CREATE OR REPLACE FUNCTION public.is_admin()
  RETURNS boolean
  LANGUAGE sql
  SECURITY DEFINER
  AS $func$
    SELECT EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE id = auth.uid() AND role = 'Administrador'
    );
  $func$;

  -- Remover políticas antigas de visualização e edição se existirem
  DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;
  DROP POLICY IF EXISTS "Admin can update all profiles" ON public.profiles;

  -- Criar política permitindo que um Administrador visualize todos os perfis
  CREATE POLICY "Admin can view all profiles" ON public.profiles
    FOR SELECT TO authenticated USING (public.is_admin());

  -- Criar política permitindo que um Administrador edite todos os perfis
  CREATE POLICY "Admin can update all profiles" ON public.profiles
    FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

  -- Atualizar cargos antigos para os novos padronizados
  UPDATE public.profiles SET role = 'Administrador' WHERE role = 'Segurança';
  UPDATE public.profiles SET role = 'Supervisor' WHERE role = 'Supervisão';

  -- Garantir que ferbatsan@hotmail.com seja um Administrador inicial
  UPDATE public.profiles SET role = 'Administrador' WHERE email = 'ferbatsan@hotmail.com';

  -- Atualizar metadados do auth.users para manter consistência
  UPDATE auth.users 
  SET raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{role}', '"Administrador"') 
  WHERE email = 'ferbatsan@hotmail.com';

  -- Atualizar o trigger de criação de novos usuários para garantir 'Observador' como default
  CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  AS $function$
  BEGIN
    INSERT INTO public.profiles (id, email, name, active, role)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
      true,
      COALESCE(NEW.raw_user_meta_data->>'role', 'Observador')
    );
    RETURN NEW;
  END;
  $function$;

END $$;
