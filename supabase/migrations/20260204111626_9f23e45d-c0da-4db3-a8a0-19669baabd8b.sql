-- Create enum for positions
CREATE TYPE public.application_position AS ENUM (
  'Feature News Writer',
  'Editorial Writer',
  'Local News Writer',
  'Sports News Writer',
  'Entertainment News Editor',
  'Entertainment News Writer',
  'Layout Artist',
  'Photojournalist',
  'Video Journalist',
  'Video Editor',
  'Broadcaster'
);

-- Create enum for how they heard about us
CREATE TYPE public.referral_source AS ENUM (
  'Social Media',
  'Friend or Colleague',
  'School Announcement',
  'Website',
  'Other'
);

-- Create applications table
CREATE TABLE public.membership_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  section TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  complete_address TEXT NOT NULL,
  position application_position NOT NULL,
  relevant_experience TEXT NOT NULL,
  portfolio_link TEXT,
  referral_source referral_source NOT NULL,
  additional_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.membership_applications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert applications (public form)
CREATE POLICY "Anyone can submit applications"
  ON public.membership_applications
  FOR INSERT
  WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_membership_applications_updated_at
  BEFORE UPDATE ON public.membership_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();