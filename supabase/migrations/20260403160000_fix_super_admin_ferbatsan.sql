DO $$
BEGIN
  -- Atualiza o usuário para is_super_admin = true garantindo o acesso administrativo
  UPDATE public.profiles
  SET is_super_admin = true, role = 'Administrador'
  WHERE email = 'ferbatsan@hotmail.com';
END $$;
