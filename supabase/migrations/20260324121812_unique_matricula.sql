-- Create unique constraint on registration_number (id_funcionario) per company
CREATE UNIQUE INDEX IF NOT EXISTS profiles_empresa_id_registration_number_key
ON public.profiles (empresa_id, registration_number)
WHERE registration_number IS NOT NULL AND registration_number <> '';

-- Update the handle_new_user function to properly populate registration_number from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, name, active, role, empresa_id, whatsapp, registration_number, cpf)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    true,
    COALESCE(NEW.raw_user_meta_data->>'role', 'Observador'),
    NULLIF(NEW.raw_user_meta_data->>'empresa_id', '')::uuid,
    NEW.raw_user_meta_data->>'whatsapp',
    NEW.raw_user_meta_data->>'registration_number',
    NEW.raw_user_meta_data->>'cpf'
  );
  RETURN NEW;
END;
$function$;
