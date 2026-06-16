-- ═══════════════════════════════════════
-- ADORE BLIND DATING — COMPLETE RLS POLICIES
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════

-- ─── 1. DROP EXISTING OVERLY-PERMISSIVE POLICIES ───
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.payment_verifications;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.leads;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.matches;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.subscriptions;

-- ─── 2. PROFILES ───
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- ─── 3. PAYMENT VERIFICATIONS ───
DROP POLICY IF EXISTS "Users can insert own payments" ON public.payment_verifications;
DROP POLICY IF EXISTS "Users can view own payments" ON public.payment_verifications;
DROP POLICY IF EXISTS "Admins can update payments" ON public.payment_verifications;
DROP POLICY IF EXISTS "Users can read own payments" ON public.payment_verifications;
DROP POLICY IF EXISTS "Admins can read all payments" ON public.payment_verifications;

CREATE POLICY "Users can insert own payments"
  ON public.payment_verifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own payments"
  ON public.payment_verifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all payments"
  ON public.payment_verifications FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admins can update payments"
  ON public.payment_verifications FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- ─── 4. MATCHES ───
DROP POLICY IF EXISTS "Users can view their matches" ON public.matches;
DROP POLICY IF EXISTS "Users can update their matches" ON public.matches;

DROP POLICY IF EXISTS "Users can read own matches" ON public.matches;
DROP POLICY IF EXISTS "Users can update own matches" ON public.matches;

CREATE POLICY "Users can read own matches"
  ON public.matches FOR SELECT
  USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);

CREATE POLICY "Users can update own matches"
  ON public.matches FOR UPDATE
  USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);

-- ─── 5. LEADS ───
DROP POLICY IF EXISTS "Public can submit leads" ON public.leads;

DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated users can read leads" ON public.leads;

CREATE POLICY "Anyone can insert leads"
  ON public.leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read leads"
  ON public.leads FOR SELECT
  USING (auth.role() = 'authenticated');

-- ─── 6. SUBSCRIPTIONS ───
DROP POLICY IF EXISTS "Users can view own subscription" ON public.subscriptions;

DROP POLICY IF EXISTS "Users can read own subscriptions" ON public.subscriptions;

CREATE POLICY "Users can read own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- ─── 7. REPORTS ───
DROP POLICY IF EXISTS "Users can create reports" ON public.reports;
DROP POLICY IF EXISTS "Admins can read reports" ON public.reports;

DROP POLICY IF EXISTS "Users can create reports" ON public.reports;
DROP POLICY IF EXISTS "Admins can read reports" ON public.reports;

CREATE POLICY "Users can create reports"
  ON public.reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Admins can read reports"
  ON public.reports FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- ─── 8. PAYMENT ORDERS ───
DROP POLICY IF EXISTS "Users can view own payment orders" ON public.payment_orders;

DROP POLICY IF EXISTS "Users can read own payment orders" ON public.payment_orders;
DROP POLICY IF EXISTS "Users can create payment orders" ON public.payment_orders;
DROP POLICY IF EXISTS "Admins can read all payment orders" ON public.payment_orders;

CREATE POLICY "Users can read own payment orders"
  ON public.payment_orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create payment orders"
  ON public.payment_orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can read all payment orders"
  ON public.payment_orders FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- ─── 9. STORAGE: PROFILE PHOTOS ───
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to own folder" ON storage.objects;

DROP POLICY IF EXISTS "Users can access their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile photos" ON storage.objects;

CREATE POLICY "Users can access their own profile photos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'profile-photos'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can upload their own profile photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'profile-photos'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own profile photos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'profile-photos'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own profile photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'profile-photos'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ─── 10. DATABASE-LEVEL PROFANITY FILTER ───
CREATE OR REPLACE FUNCTION public.check_profile_content()
RETURNS trigger AS $$
DECLARE
  blocked_words text[] := ARRAY[
    'fuck', 'shit', 'ass', 'bitch', 'damn', 'bastard', 'crap',
    'dick', 'piss', 'slut', 'whore', 'cock', 'cunt', 'motherfucker',
    'nigga', 'nigger', 'porn', 'sex', 'fucking', 'bullshit'
  ];
  word text;
BEGIN
  IF NEW.bio IS NOT NULL THEN
    FOREACH word IN ARRAY blocked_words
    LOOP
      IF NEW.bio ~* ('\m' || word || '\M') THEN
        RAISE EXCEPTION 'Content contains inappropriate language' USING ERRCODE = 'P0001';
      END IF;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS check_profile_content_trigger ON public.profiles;
CREATE TRIGGER check_profile_content_trigger
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.check_profile_content();
