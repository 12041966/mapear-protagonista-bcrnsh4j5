-- Adiciona colunas para controle de prazos nas observações
ALTER TABLE public.observacoes 
  ADD COLUMN IF NOT EXISTS due_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS completion_date TIMESTAMPTZ;
