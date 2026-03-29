ALTER TABLE public.tabelas_sistema_opcoes ADD COLUMN IF NOT EXISTS ordem integer NOT NULL DEFAULT 0;
ALTER TABLE public.tabelas_sistema_empresa_opcoes ADD COLUMN IF NOT EXISTS ordem integer NOT NULL DEFAULT 0;
