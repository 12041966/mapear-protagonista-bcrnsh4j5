-- Criar tabela sequencias
CREATE TABLE IF NOT EXISTS public.sequencias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    tipo_sequencia TEXT NOT NULL,
    proximo_numero INTEGER NOT NULL DEFAULT 1,
    data_atualizacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(empresa_id, tipo_sequencia)
);

-- RLS
ALTER TABLE public.sequencias ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Super admins can manage sequencias" ON public.sequencias;
CREATE POLICY "Super admins can manage sequencias" ON public.sequencias
    FOR ALL TO authenticated 
    USING (public.is_super_admin())
    WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "Users can view sequencias for their company" ON public.sequencias;
CREATE POLICY "Users can view sequencias for their company" ON public.sequencias
    FOR SELECT TO authenticated 
    USING (empresa_id = public.get_user_empresa_id() OR public.is_admin());

-- Função para obter e incrementar o próximo número de sequência de forma atômica
CREATE OR REPLACE FUNCTION public.get_next_sequence_value(p_empresa_id UUID, p_tipo TEXT)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_current integer;
BEGIN
    INSERT INTO public.sequencias (empresa_id, tipo_sequencia, proximo_numero)
    VALUES (p_empresa_id, p_tipo, 2)
    ON CONFLICT (empresa_id, tipo_sequencia)
    DO UPDATE SET 
        proximo_numero = public.sequencias.proximo_numero + 1,
        data_atualizacao = NOW()
    RETURNING (proximo_numero - 1) INTO v_current;
    
    RETURN v_current;
END;
$$;

-- Inicializar a tabela para os anos correntes e empresas existentes
DO $$
DECLARE
    rec RECORD;
    v_year TEXT := to_char(NOW(), 'YYYY');
    v_max_num INT;
BEGIN
    FOR rec IN SELECT id FROM public.empresas
    LOOP
        -- Busca o maior número de observação já usado neste ano por esta empresa
        SELECT COALESCE(MAX(
            NULLIF(regexp_replace(split_part(codigo, '-', 3), '\D', '', 'g'), '')::INT
        ), 0)
        INTO v_max_num
        FROM public.observacoes
        WHERE empresa_id = rec.id AND codigo LIKE 'OBS-' || v_year || '-%';

        IF v_max_num > 0 THEN
            INSERT INTO public.sequencias (empresa_id, tipo_sequencia, proximo_numero)
            VALUES (rec.id, 'observacao_' || v_year, v_max_num + 1)
            ON CONFLICT (empresa_id, tipo_sequencia) 
            DO UPDATE SET proximo_numero = EXCLUDED.proximo_numero;
        END IF;
    END LOOP;
END $$;
