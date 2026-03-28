DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'status') THEN
    ALTER TABLE public.profiles ADD COLUMN status text DEFAULT 'pendente_confirmacao';
  END IF;
END $$;

UPDATE public.profiles SET status = 'ativo' WHERE status = 'pendente_confirmacao' OR status IS NULL;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, active, role, empresa_id, whatsapp, registration_number, cpf, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    true,
    COALESCE(NEW.raw_user_meta_data->>'role', 'Observador'),
    NULLIF(NEW.raw_user_meta_data->>'empresa_id', '')::uuid,
    NEW.raw_user_meta_data->>'whatsapp',
    NEW.raw_user_meta_data->>'registration_number',
    NEW.raw_user_meta_data->>'cpf',
    'pendente_confirmacao'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.update_profile_status_on_login()
RETURNS trigger AS $$
BEGIN
  IF NEW.last_sign_in_at IS NOT NULL AND OLD.last_sign_in_at IS NULL THEN
    UPDATE public.profiles SET status = 'ativo' WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_user_login ON auth.users;
CREATE TRIGGER on_user_login
  AFTER UPDATE OF last_sign_in_at ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.update_profile_status_on_login();
