-- Drop policy if it exists to be idempotent
DROP POLICY IF EXISTS "Company admins can delete profiles in their company" ON public.profiles;

-- Allow company administrators (or global admins) to delete users from their companies
CREATE POLICY "Company admins can delete profiles in their company" ON public.profiles
  FOR DELETE TO authenticated USING (is_company_admin(empresa_id) OR is_admin());
