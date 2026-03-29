ALTER TABLE public.tabelas_sistema_opcoes ADD COLUMN IF NOT EXISTS empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE;
ALTER TABLE public.tabelas_sistema_empresa_opcoes ADD COLUMN IF NOT EXISTS oculto BOOLEAN NOT NULL DEFAULT false;

DROP POLICY IF EXISTS "Company admins can manage their own options" ON public.tabelas_sistema_opcoes;
CREATE POLICY "Company admins can manage their own options" ON public.tabelas_sistema_opcoes
  FOR ALL TO authenticated
  USING (empresa_id = public.get_user_empresa_id() OR public.is_admin())
  WITH CHECK (empresa_id = public.get_user_empresa_id() OR public.is_admin());
