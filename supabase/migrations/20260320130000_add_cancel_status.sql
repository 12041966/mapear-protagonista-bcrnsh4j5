-- Add justificativa_cancelamento to observacoes
ALTER TABLE public.observacoes ADD COLUMN IF NOT EXISTS justificativa_cancelamento TEXT;

-- Update trigger to use justificativa_cancelamento for the log if justificativa_status is not provided
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
            COALESCE(NEW.justificativa_status, NEW.justificativa_cancelamento),
            NEW.empresa_id
        );
        -- Reseta a justificativa na tabela principal para atuar como campo transiente
        NEW.justificativa_status := NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
