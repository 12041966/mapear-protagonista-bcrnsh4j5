-- Create logs_observacoes table
CREATE TABLE IF NOT EXISTS public.logs_observacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    observacao_id UUID NOT NULL REFERENCES public.observacoes(id) ON DELETE CASCADE,
    usuario_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status_anterior TEXT,
    status_novo TEXT NOT NULL,
    justificativa TEXT,
    data_hora TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE
);

-- Add justificativa_status to observacoes so we can pass it to the trigger
ALTER TABLE public.observacoes ADD COLUMN IF NOT EXISTS justificativa_status TEXT;

-- Enable RLS
ALTER TABLE public.logs_observacoes ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Super admins can do all on logs_observacoes" ON public.logs_observacoes;
CREATE POLICY "Super admins can do all on logs_observacoes" ON public.logs_observacoes
    FOR ALL TO authenticated 
    USING (public.is_super_admin())
    WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "Users can view logs for their company" ON public.logs_observacoes;
CREATE POLICY "Users can view logs for their company" ON public.logs_observacoes
    FOR SELECT TO authenticated 
    USING (empresa_id = public.get_user_empresa_id() OR public.is_admin());

-- Trigger function
CREATE OR REPLACE FUNCTION public.log_observacao_status_change()
RETURNS trigger AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO public.logs_observacoes (
            observacao_id,
            usuario_id,
            status_anterior,
            status_novo,
            justificativa,
            empresa_id
        ) VALUES (
            NEW.id,
            auth.uid(),
            OLD.status,
            NEW.status,
            NEW.justificativa_status,
            NEW.empresa_id
        );
        -- Reseta a justificativa na tabela principal para atuar como campo transiente
        NEW.justificativa_status := NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger (BEFORE UPDATE to allow modifying NEW)
DROP TRIGGER IF EXISTS on_observacao_status_change ON public.observacoes;
CREATE TRIGGER on_observacao_status_change
    BEFORE UPDATE ON public.observacoes
    FOR EACH ROW
    EXECUTE FUNCTION public.log_observacao_status_change();
