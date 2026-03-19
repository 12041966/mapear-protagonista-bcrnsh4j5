-- Adiciona a coluna registration_number para armazenar a Matrícula do usuário
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS registration_number TEXT;
