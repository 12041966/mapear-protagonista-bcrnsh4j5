-- Adiciona a coluna is_super_admin na tabela profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN NOT NULL DEFAULT false;

-- Atualiza os administradores já existentes
UPDATE public.profiles
SET is_super_admin = true
WHERE email IN ('ferbatsan@hotmail.com', 'seguranca.ativa@mapear.net.br') OR role = 'Super Adm';

-- Atualiza as funções de segurança (RLS) para usar a nova coluna
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND is_super_admin = true
  );
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND is_super_admin = true
  );
$$;
