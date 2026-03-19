CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, name, active, role, empresa_id, whatsapp)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    true,
    COALESCE(NEW.raw_user_meta_data->>'role', 'Observador'),
    NULLIF(NEW.raw_user_meta_data->>'empresa_id', '')::uuid,
    NEW.raw_user_meta_data->>'whatsapp'
  );
  RETURN NEW;
END;
$function$;
