ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Set the first user as admin (update with your email after running)
-- UPDATE public.profiles SET is_admin = true WHERE email = 'your-email@example.com';
