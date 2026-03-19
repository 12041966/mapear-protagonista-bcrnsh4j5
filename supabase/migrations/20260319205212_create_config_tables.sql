CREATE TABLE IF NOT EXISTS public.efetivo_mensal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  mes TEXT NOT NULL,
  ano INTEGER NOT NULL,
  quantidade INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(empresa_id, mes, ano)
);

ALTER TABLE public.efetivo_mensal ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage headcount for their company" ON public.efetivo_mensal
  FOR ALL TO authenticated
  USING (empresa_id = public.get_user_empresa_id() OR public.is_admin())
  WITH CHECK (empresa_id = public.get_user_empresa_id() OR public.is_admin());


CREATE TABLE IF NOT EXISTS public.configuracoes_sistema (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  chave TEXT NOT NULL,
  valor TEXT NOT NULL,
  categoria TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.configuracoes_sistema ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage system configs for their company" ON public.configuracoes_sistema
  FOR ALL TO authenticated
  USING (empresa_id = public.get_user_empresa_id() OR public.is_admin())
  WITH CHECK (empresa_id = public.get_user_empresa_id() OR public.is_admin());
