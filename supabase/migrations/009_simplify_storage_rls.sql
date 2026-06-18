-- Drop all existing policies on storage.objects for profile-photos
DROP POLICY IF EXISTS "Users can view own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to own folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can access their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own profile photos" ON storage.objects;

-- Simple policies:
-- 1. Any authenticated user can view any profile photo
CREATE POLICY "view_photos" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'profile-photos');

-- 2. Any authenticated user can upload
CREATE POLICY "upload_photos" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'profile-photos');

-- 3. Users can update/delete their own files by folder prefix
CREATE POLICY "update_own_photos" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'profile-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "delete_own_photos" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'profile-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
