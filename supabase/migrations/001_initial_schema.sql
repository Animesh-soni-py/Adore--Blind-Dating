-- ═══════════════════════════════════════
-- ADORE BLIND DATING — SUPABASE SCHEMA
-- ═══════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── PROFILES ───────────────────────────
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('man', 'woman', 'non-binary', 'other', 'prefer-not-to-say')),
  seeking TEXT CHECK (seeking IN ('man', 'woman', 'everyone')),
  city TEXT,
  country TEXT DEFAULT 'IN',
  bio TEXT CHECK (char_length(bio) <= 500),
  personality_type TEXT,
  values JSONB DEFAULT '[]'::jsonb,
  interests JSONB DEFAULT '[]'::jsonb,
  lifestyle JSONB DEFAULT '{}'::jsonb,
  is_verified BOOLEAN DEFAULT FALSE,
  is_premium BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  profile_photo_url TEXT,
  phone TEXT,
  phone_verified BOOLEAN DEFAULT FALSE,
  reveal_ready BOOLEAN DEFAULT FALSE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  quiz_completed BOOLEAN DEFAULT FALSE,
  onboarding_data JSONB DEFAULT '{}'::jsonb,
  compatibility_score_avg NUMERIC(4,2),
  match_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PERSONALITY QUIZ ANSWERS ──────────
CREATE TABLE public.quiz_answers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  question_key TEXT NOT NULL,
  answer TEXT NOT NULL,
  answer_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, question_key)
);

-- ─── PHONE OTP VERIFICATIONS ────────────
CREATE TABLE public.phone_otps (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  phone TEXT NOT NULL,
  otp TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_phone_otps_user_id ON public.phone_otps(user_id);

-- ─── MATCHES ────────────────────────────
CREATE TABLE public.matches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_a_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  user_b_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  compatibility_score NUMERIC(5,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'reveal_requested', 'revealed', 'unmatched', 'expired')),
  matched_at TIMESTAMPTZ DEFAULT NOW(),
  chat_started_at TIMESTAMPTZ,
  reveal_requested_at TIMESTAMPTZ,
  revealed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
  user_a_reveal_consent BOOLEAN DEFAULT FALSE,
  user_b_reveal_consent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT no_self_match CHECK (user_a_id != user_b_id),
  CONSTRAINT ordered_users CHECK (user_a_id < user_b_id)
);
CREATE INDEX idx_matches_user_a ON public.matches(user_a_id);
CREATE INDEX idx_matches_user_b ON public.matches(user_b_id);
CREATE INDEX idx_matches_status ON public.matches(status);

-- ─── MESSAGES ──────────────────────────
CREATE TABLE public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) <= 2000),
  is_read BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_messages_match_id ON public.messages(match_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);

-- ─── CONTACT/LEAD SUBMISSIONS ──────────
CREATE TABLE public.leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT,
  source TEXT DEFAULT 'homepage' CHECK (source IN ('homepage', 'blog', 'referral', 'ad', 'other')),
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  ip_address INET,
  city TEXT,
  country TEXT,
  converted BOOLEAN DEFAULT FALSE,
  converted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_leads_email ON public.leads(email);
CREATE INDEX idx_leads_created_at ON public.leads(created_at DESC);

-- ─── REGISTRATIONS (pre-auth waitlist) ─
CREATE TABLE public.registrations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  gender TEXT,
  city TEXT,
  status TEXT DEFAULT 'waitlisted' CHECK (status IN ('waitlisted', 'approved', 'rejected', 'onboarding')),
  referral_code TEXT UNIQUE DEFAULT UPPER(SUBSTRING(uuid_generate_v4()::TEXT, 1, 8)),
  referred_by TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── REPORTS (safety) ──────────────────
CREATE TABLE public.reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reported_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('harassment', 'fake_profile', 'inappropriate_content', 'spam', 'other')),
  details TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'actioned', 'dismissed')),
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── NOTIFICATIONS ─────────────────────
CREATE TABLE public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('new_match', 'new_message', 'reveal_request', 'reveal_accepted', 'match_expiring', 'system')),
  title TEXT NOT NULL,
  body TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);

-- ─── SUBSCRIPTIONS (future-ready, no processing) ─
CREATE TABLE public.subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'premium', 'elite')),
  status TEXT DEFAULT 'inactive' CHECK (status IN ('inactive', 'active', 'cancelled', 'expired')),
  started_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  payment_provider TEXT,
  external_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PAYMENT ORDERS ─────────────────────
CREATE TABLE public.payment_orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  razorpay_order_id TEXT UNIQUE NOT NULL,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'INR',
  plan_name TEXT NOT NULL,
  period TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_payment_orders_user_id ON public.payment_orders(user_id);
CREATE INDEX idx_payment_orders_order_id ON public.payment_orders(razorpay_order_id);

-- ─── UPDATED_AT TRIGGERS ───────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER set_matches_updated_at BEFORE UPDATE ON public.matches
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ─── AUTO-CREATE PROFILE ON SIGNUP ─────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── ROW LEVEL SECURITY ────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phone_otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can view matched profiles" ON public.profiles FOR SELECT USING (
  id IN (
    SELECT CASE WHEN user_a_id = auth.uid() THEN user_b_id ELSE user_a_id END
    FROM public.matches
    WHERE (user_a_id = auth.uid() OR user_b_id = auth.uid()) AND status IN ('active', 'reveal_requested', 'revealed')
  )
);

-- Quiz answers policies
CREATE POLICY "Users can manage own quiz answers" ON public.quiz_answers FOR ALL USING (auth.uid() = user_id);

-- Matches policies
CREATE POLICY "Users can view their matches" ON public.matches FOR SELECT USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);
CREATE POLICY "Users can update their matches" ON public.matches FOR UPDATE USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);

-- Messages policies
CREATE POLICY "Users can view messages in their matches" ON public.messages FOR SELECT USING (
  match_id IN (SELECT id FROM public.matches WHERE user_a_id = auth.uid() OR user_b_id = auth.uid())
);
CREATE POLICY "Users can send messages in their matches" ON public.messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  match_id IN (SELECT id FROM public.matches WHERE (user_a_id = auth.uid() OR user_b_id = auth.uid()) AND status IN ('active', 'reveal_requested', 'revealed'))
);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Subscriptions policies
CREATE POLICY "Users can view own subscription" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Phone OTPs policies
CREATE POLICY "Users can manage own otps" ON public.phone_otps FOR ALL USING (auth.uid() = user_id);

-- Payment orders policies
CREATE POLICY "Users can view own payment orders" ON public.payment_orders FOR SELECT USING (auth.uid() = user_id);

-- Leads: public insert only
CREATE POLICY "Public can submit leads" ON public.leads FOR INSERT WITH CHECK (TRUE);
