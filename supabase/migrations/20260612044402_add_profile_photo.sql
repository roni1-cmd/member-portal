-- Add profile_photo column to membership_applications
ALTER TABLE public.membership_applications 
ADD COLUMN profile_photo TEXT;

-- Create storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-photos',
  'profile-photos',
  true,
  2097152,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Create policy to allow public reads
CREATE POLICY "Public can view profile photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-photos');

-- Create policy to allow authenticated uploads
CREATE POLICY "Anyone can upload profile photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'profile-photos');

-- Create policy to allow updates
CREATE POLICY "Anyone can update profile photos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'profile-photos');