-- Add manager_comments column to observacoes table for tracking internal notes
ALTER TABLE public.observacoes ADD COLUMN IF NOT EXISTS manager_comments TEXT;
