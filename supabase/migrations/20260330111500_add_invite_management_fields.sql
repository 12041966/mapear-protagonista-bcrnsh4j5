ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status_convite text DEFAULT 'aceito';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS data_envio_convite timestamptz;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS data_expiracao_convite timestamptz;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS token_convite text;

-- Adiciona index para o token se não existir
DO $
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = 'profiles_token_convite_idx' AND n.nspname = 'public'
    ) THEN
        CREATE INDEX profiles_token_convite_idx ON public.profiles (token_convite);
    END IF;
END $;

UPDATE public.profiles
SET status_convite = 'pendente'
WHERE status = 'pendente_confirmacao' AND status_convite = 'aceito';
