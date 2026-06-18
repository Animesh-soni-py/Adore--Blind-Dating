-- Fix infinite recursion in admin policy for profiles table
-- The old policy queried profiles inside a policy ON profiles

-- Create a SECURITY DEFINER function that bypasses RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
$$;

-- Drop the recursive policy
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;

-- Recreate it using the helper function
CREATE POLICY "Admins can read all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());
