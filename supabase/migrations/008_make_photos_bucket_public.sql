-- Make profile-photos bucket public and ensure it exists

INSERT INTO storage.buckets (id, name, public, avif_autodetection)
VALUES ('profile-photos', 'profile-photos', true, false)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop restrictive per-user policies
DROP POLICY IF EXISTS "Users can access their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile photos" ON storage.objects;

-- Allow any authenticated user to view any profile photo (needed for matches to see each other)
CREATE POLICY "Anyone can view profile photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-photos');

-- Only authenticated users can upload
CREATE POLICY "Authenticated users can upload profile photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'profile-photos'
    AND auth.role() = 'authenticated'
  );

-- Users can update/delete their own files
CREATE POLICY "Users can update own profile photos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'profile-photos'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own profile photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'profile-photos'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
