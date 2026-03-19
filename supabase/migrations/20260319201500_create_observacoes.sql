-- Criar tabela de observações de segurança
CREATE TABLE public.observacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo TEXT NOT NULL UNIQUE,
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    date TIMESTAMPTZ NOT NULL,
    type TEXT NOT NULL,
    detail TEXT,
    area TEXT,
    shift TEXT,
    risk_level TEXT,
    description TEXT,
    resolution_type TEXT,
    status TEXT NOT NULL DEFAULT 'Pendente',
    assigned_to TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.observacoes ENABLE ROW LEVEL SECURITY;

-- Política de RLS: Usuários só podem acessar observações da sua própria empresa
CREATE POLICY "Users can access their company's observations" ON public.observacoes
    FOR ALL TO authenticated 
    USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()))
    WITH CHECK (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

-- Inserir dados de exemplo para demonstração end-to-end (caso exista uma empresa e usuário)
DO $$
DECLARE
    v_empresa_id UUID;
    v_user_id UUID;
BEGIN
    SELECT id INTO v_empresa_id FROM public.empresas LIMIT 1;
    SELECT id INTO v_user_id FROM public.profiles LIMIT 1;

    IF v_empresa_id IS NOT NULL AND v_user_id IS NOT NULL THEN
        INSERT INTO public.observacoes (codigo, empresa_id, user_id, date, type, detail, area, shift, risk_level, description, resolution_type, status)
        VALUES
        ('OBS-2026-001', v_empresa_id, v_user_id, NOW() - INTERVAL '2 days', 'Condição de risco', 'Pisos escorregadios', 'Produção L1', 'T1', 'Moderado', 'Vazamento de óleo próximo à máquina de corte.', 'Ação necessária', 'Pendente'),
        ('OBS-2026-002', v_empresa_id, v_user_id, NOW() - INTERVAL '12 days', 'Comportamento seguro', 'Uso correto de EPI', 'Manutenção', 'T2', 'Leve', 'Equipe utilizando cinto de segurança corretamente em trabalho em altura.', 'Feedback fornecido', 'Concluído'),
        ('OBS-2026-003', v_empresa_id, v_user_id, NOW() - INTERVAL '25 days', 'Quase acidente', 'Falta de sinalização', 'Logística', 'T3', 'Grave', 'Empilhadeira quase colidiu com pedestre.', 'Ação necessária', 'Em Análise')
        ON CONFLICT (codigo) DO NOTHING;
    END IF;
END $$;
