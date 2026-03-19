-- 1. Add the column (nullable initially to allow adding to table with existing rows)
ALTER TABLE public.empresas ADD COLUMN IF NOT EXISTS codigo_empresa TEXT;

-- 2. Populate the column for existing records
DO $$
DECLARE
    emp_record RECORD;
    new_code TEXT;
    code_exists BOOLEAN;
BEGIN
    FOR emp_record IN SELECT id, data_criacao FROM public.empresas WHERE codigo_empresa IS NULL LOOP
        LOOP
            -- Generate EMP-YYYY-RRRR where YYYY is year and RRRR is 4 random digits
            new_code := 'EMP-' || TO_CHAR(emp_record.data_criacao, 'YYYY') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
            
            -- Check for uniqueness
            SELECT EXISTS(SELECT 1 FROM public.empresas WHERE codigo_empresa = new_code) INTO code_exists;
            
            IF NOT code_exists THEN
                UPDATE public.empresas SET codigo_empresa = new_code WHERE id = emp_record.id;
                EXIT; -- Exit the inner loop once a unique code is found and assigned
            END IF;
        END LOOP;
    END LOOP;
END $$;

-- 3. Make the column NOT NULL now that all rows have a value
ALTER TABLE public.empresas ALTER COLUMN codigo_empresa SET NOT NULL;

-- 4. Add the UNIQUE constraint
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'empresas_codigo_empresa_key') THEN
        ALTER TABLE public.empresas ADD CONSTRAINT empresas_codigo_empresa_key UNIQUE (codigo_empresa);
    END IF;
END $$;

-- 5. Create a function to automatically generate the code for future inserts if not provided
CREATE OR REPLACE FUNCTION public.generate_codigo_empresa()
RETURNS TRIGGER AS $$
DECLARE
    new_code TEXT;
    code_exists BOOLEAN;
    creation_year TEXT;
BEGIN
    IF NULLIF(TRIM(NEW.codigo_empresa), '') IS NULL THEN
        creation_year := TO_CHAR(COALESCE(NEW.data_criacao, NOW()), 'YYYY');
        LOOP
            new_code := 'EMP-' || creation_year || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
            
            SELECT EXISTS(SELECT 1 FROM public.empresas WHERE codigo_empresa = new_code) INTO code_exists;
            
            IF NOT code_exists THEN
                NEW.codigo_empresa := new_code;
                EXIT;
            END IF;
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Attach the trigger
DROP TRIGGER IF EXISTS ensure_codigo_empresa ON public.empresas;
CREATE TRIGGER ensure_codigo_empresa
BEFORE INSERT ON public.empresas
FOR EACH ROW
EXECUTE FUNCTION public.generate_codigo_empresa();
