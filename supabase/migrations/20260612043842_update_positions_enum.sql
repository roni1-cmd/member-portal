-- Add new positions to the enum
ALTER TYPE public.application_position ADD VALUE IF NOT EXISTS 'Associate Editor';
ALTER TYPE public.application_position ADD VALUE IF NOT EXISTS 'Editor';
ALTER TYPE public.application_position ADD VALUE IF NOT EXISTS 'Editorial Cartoonist';
ALTER TYPE public.application_position ADD VALUE IF NOT EXISTS 'Assistant Production Head';
ALTER TYPE public.application_position ADD VALUE IF NOT EXISTS 'Auditor';

-- Note: Entertainment News Editor and Entertainment News Writer remain in the enum
-- but are not displayed in the frontend. This preserves existing data if any exists.