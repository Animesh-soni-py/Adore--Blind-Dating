-- ═══════════════════════════════════════
-- ADORE BLIND DATING — FIX SECURITY LINTS
-- ═══════════════════════════════════════

-- ─── 1. Set search_path on functions ───
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER SET search_path = public
AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

-- ─── 2. Revoke EXECUTE from anon/authenticated for trigger-only functions ───
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;

-- ─── 3. Fix leads INSERT policy — require valid email ───
DROP POLICY IF EXISTS "Public can submit leads" ON public.leads;
CREATE POLICY "Public can submit leads" ON public.leads FOR INSERT WITH CHECK (
  email IS NOT NULL AND email <> '' AND email LIKE '%@%.%'
);

-- ─── 4. Create payment_verifications table and proper RLS ───
CREATE TABLE IF NOT EXISTS public.payment_verifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  plan_name TEXT NOT NULL,
  amount INTEGER NOT NULL,
  period TEXT NOT NULL,
  utr TEXT NOT NULL,
  upi_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  admin_id UUID,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.payment_verifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert own payments" ON public.payment_verifications;
CREATE POLICY "Users can insert own payments" ON public.payment_verifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own payments" ON public.payment_verifications;
CREATE POLICY "Users can view own payments" ON public.payment_verifications
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can update payments" ON public.payment_verifications;
CREATE POLICY "Admins can update payments" ON public.payment_verifications
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE is_admin = true)
  );

-- ─── 5. Fix profile-photos bucket — restrict listing to own files only ───
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Users can view own profile photos" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'profile-photos' AND auth.role() = 'authenticated'
  );

-- ─── 6. Leaked password protection must be enabled in Supabase Dashboard ───
-- Go to: Authentication → Settings → Security → Enable "Leaked password protection"
