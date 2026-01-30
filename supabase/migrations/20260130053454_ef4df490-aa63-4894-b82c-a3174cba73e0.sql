-- Add senior-first profile fields for Signal's core identity
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS impact_highlights text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS availability_status text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS availability_date date DEFAULT NULL,
ADD COLUMN IF NOT EXISTS work_style text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS preferred_timezone text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS leadership_team_size text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS leadership_budget text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS leadership_org_level text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS is_open_to_work boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS open_to_contract boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS open_to_fractional boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS open_to_advisory boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS portfolio_url text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS github_url text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS linkedin_url text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS notable_projects jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS seniority_level text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS previous_companies text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS user_role text DEFAULT 'candidate';

-- Add indexes for common filters
CREATE INDEX IF NOT EXISTS idx_profiles_is_open_to_work ON public.profiles(is_open_to_work) WHERE is_open_to_work = true;
CREATE INDEX IF NOT EXISTS idx_profiles_availability_status ON public.profiles(availability_status);
CREATE INDEX IF NOT EXISTS idx_profiles_seniority_level ON public.profiles(seniority_level);
CREATE INDEX IF NOT EXISTS idx_profiles_user_role ON public.profiles(user_role);

COMMENT ON COLUMN public.profiles.impact_highlights IS 'Top 3 bullet points of career impact';
COMMENT ON COLUMN public.profiles.availability_status IS 'laid_off, exploring, employed_looking, not_looking';
COMMENT ON COLUMN public.profiles.work_style IS 'remote, hybrid, onsite';
COMMENT ON COLUMN public.profiles.leadership_org_level IS 'IC, Manager, Director, VP, C-Level';
COMMENT ON COLUMN public.profiles.user_role IS 'candidate or employer';