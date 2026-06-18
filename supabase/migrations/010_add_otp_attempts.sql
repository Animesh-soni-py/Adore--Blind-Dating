-- Add attempts column to public.phone_otps table to track failed verification attempts
ALTER TABLE public.phone_otps ADD COLUMN IF NOT EXISTS attempts INTEGER DEFAULT 0;
