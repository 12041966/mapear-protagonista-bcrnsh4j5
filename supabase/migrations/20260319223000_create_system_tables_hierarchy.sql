CREATE TABLE IF NOT EXISTS public.tabelas_sistema_definicoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_tabela TEXT NOT NULL,
  descricao TEXT,
  chave TEXT NOT NULL UNIQUE,
  data_criacao TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tabelas_sistema_opcoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tabela_id UUID NOT NULL REFERENCES public.tabelas_sistema_definicoes(id) ON DELETE CASCADE,
  nome_opcao TEXT NOT NULL,
  valor_padrao TEXT NOT NULL,
  data_criacao TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tabelas_sistema_empresa_opcoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  opcao_id UUID NOT NULL REFERENCES public.tabelas_sistema_opcoes(id) ON DELETE CASCADE,
  valor_customizado TEXT NOT NULL,
  data_criacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  data_atualizacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(empresa_id, opcao_id)
);

ALTER TABLE public.tabelas_sistema_definicoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tabelas_sistema_opcoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tabelas_sistema_empresa_opcoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can select definicoes" ON public.tabelas_sistema_definicoes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Super admins can all on definicoes" ON public.tabelas_sistema_definicoes
  FOR ALL TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

CREATE POLICY "Authenticated users can select opcoes" ON public.tabelas_sistema_opcoes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Super admins can all on opcoes" ON public.tabelas_sistema_opcoes
  FOR ALL TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

CREATE POLICY "Users manage custom options for their company" ON public.tabelas_sistema_empresa_opcoes
  FOR ALL TO authenticated
  USING (empresa_id = public.get_user_empresa_id() OR public.is_admin())
  WITH CHECK (empresa_id = public.get_user_empresa_id() OR public.is_admin());

DO $$
DECLARE
  def_obs_id UUID;
  def_cond_id UUID;
  def_beh_id UUID;
  def_area_id UUID;
  def_risk_id UUID;
  def_shift_id UUID;
BEGIN
  INSERT INTO public.tabelas_sistema_definicoes (nome_tabela, descricao, chave) VALUES
  ('Tipos de Observação', 'Tipos de observações disponíveis', 'observationTypes') RETURNING id INTO def_obs_id;

  INSERT INTO public.tabelas_sistema_definicoes (nome_tabela, descricao, chave) VALUES
  ('Detalhamento: Condições', 'Condições para detalhamento', 'conditions') RETURNING id INTO def_cond_id;

  INSERT INTO public.tabelas_sistema_definicoes (nome_tabela, descricao, chave) VALUES
  ('Detalhamento: Comportamentos', 'Comportamentos para detalhamento', 'behaviors') RETURNING id INTO def_beh_id;

  INSERT INTO public.tabelas_sistema_definicoes (nome_tabela, descricao, chave) VALUES
  ('Áreas / Setores', 'Áreas ou setores da empresa', 'areas') RETURNING id INTO def_area_id;

  INSERT INTO public.tabelas_sistema_definicoes (nome_tabela, descricao, chave) VALUES
  ('Risco Estimado', 'Níveis de risco estimado', 'risks') RETURNING id INTO def_risk_id;

  INSERT INTO public.tabelas_sistema_definicoes (nome_tabela, descricao, chave) VALUES
  ('Turnos', 'Turnos de trabalho', 'shifts') RETURNING id INTO def_shift_id;

  INSERT INTO public.tabelas_sistema_opcoes (tabela_id, nome_opcao, valor_padrao) VALUES
  (def_obs_id, 'Comportamento Seguro', '{"value":"Comportamento Seguro","label":"Comportamento Seguro","desc":"O observador notou um comportamento seguro."}'),
  (def_obs_id, 'Comportamento de Risco', '{"value":"Comportamento de Risco","label":"Comportamento de Risco","desc":"O observador notou um comportamento que expõe a risco."}'),
  (def_obs_id, 'Condição Segura', '{"value":"Condição Segura","label":"Condição Segura","desc":"O ambiente de trabalho apresenta condições seguras."}'),
  (def_obs_id, 'Condição Insegura', '{"value":"Condição Insegura","label":"Condição Insegura","desc":"O ambiente de trabalho apresenta condições que geram risco."}'),
  (def_obs_id, 'Quase Acidente', '{"value":"Quase Acidente","label":"Quase Acidente","desc":"Um evento que poderia ter resultado em acidente, mas não resultou."}');

  INSERT INTO public.tabelas_sistema_opcoes (tabela_id, nome_opcao, valor_padrao) VALUES
  (def_cond_id, 'Piso escorregadio', 'Piso escorregadio'),
  (def_cond_id, 'Falta de iluminação', 'Falta de iluminação'),
  (def_cond_id, 'Falta de sinalização', 'Falta de sinalização'),
  (def_cond_id, 'Equipamento defeituoso', 'Equipamento defeituoso'),
  (def_cond_id, 'Ferramenta improvisada', 'Ferramenta improvisada');

  INSERT INTO public.tabelas_sistema_opcoes (tabela_id, nome_opcao, valor_padrao) VALUES
  (def_beh_id, 'Uso correto de EPI', 'Uso correto de EPI'),
  (def_beh_id, 'Não conformidade com procedimento', 'Não conformidade com procedimento'),
  (def_beh_id, 'Distração ou pressa', 'Distração ou pressa'),
  (def_beh_id, 'Trabalho em altura sem cinto', 'Trabalho em altura sem cinto'),
  (def_beh_id, 'Isolamento de área adequado', 'Isolamento de área adequado');

  INSERT INTO public.tabelas_sistema_opcoes (tabela_id, nome_opcao, valor_padrao) VALUES
  (def_area_id, 'Produção', 'Produção'),
  (def_area_id, 'Manutenção', 'Manutenção'),
  (def_area_id, 'Logística', 'Logística'),
  (def_area_id, 'Administrativo', 'Administrativo');

  INSERT INTO public.tabelas_sistema_opcoes (tabela_id, nome_opcao, valor_padrao) VALUES
  (def_risk_id, 'Baixo', 'Baixo'),
  (def_risk_id, 'Médio', 'Médio'),
  (def_risk_id, 'Alto', 'Alto'),
  (def_risk_id, 'Crítico', 'Crítico');

  INSERT INTO public.tabelas_sistema_opcoes (tabela_id, nome_opcao, valor_padrao) VALUES
  (def_shift_id, '1º Turno (Manhã)', '1º Turno (Manhã)'),
  (def_shift_id, '2º Turno (Tarde)', '2º Turno (Tarde)'),
  (def_shift_id, '3º Turno (Noite)', '3º Turno (Noite)'),
  (def_shift_id, 'Administrativo', 'Administrativo');
END $$;
