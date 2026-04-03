UPDATE public.profiles
SET 
  is_super_admin = true,
  role = 'Administrador',
  active = true,
  status = 'ativo'
WHERE email = 'ferbatsan@hotmail.com';
