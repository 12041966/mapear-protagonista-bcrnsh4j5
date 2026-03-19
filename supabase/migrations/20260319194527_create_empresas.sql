-- Criar tabela de empresas
CREATE TABLE public.empresas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    cnpj TEXT,
    email_contato TEXT,
    telefone TEXT,
    data_criacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ativa BOOLEAN NOT NULL DEFAULT true
);

-- Habilitar RLS
ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso para empresas
CREATE POLICY "Admins can manage all companies" ON public.empresas
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Users can view their own company" ON public.empresas
    FOR SELECT TO authenticated USING (
        id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid())
    );

-- Atualizar tabela profiles
ALTER TABLE public.profiles ADD COLUMN empresa_id UUID REFERENCES public.empresas(id);

-- Lógica de migração de dados
DO $$
DECLARE
    default_empresa_id UUID;
BEGIN
    -- Inserir empresa padrão
    INSERT INTO public.empresas (nome) VALUES ('Empresa Padrão') RETURNING id INTO default_empresa_id;

    -- Atribuir empresa padrão aos usuários existentes
    UPDATE public.profiles SET empresa_id = default_empresa_id;
END $$;

-- Remover coluna antiga
ALTER TABLE public.profiles DROP COLUMN IF EXISTS company_id;
