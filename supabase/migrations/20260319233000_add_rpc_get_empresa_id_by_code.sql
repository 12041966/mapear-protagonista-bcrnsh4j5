-- Function to get company ID by code safely for anon users
CREATE OR REPLACE FUNCTION public.get_empresa_id_by_code(p_codigo text)
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT id FROM public.empresas WHERE codigo_empresa = p_codigo LIMIT 1;
$$;
