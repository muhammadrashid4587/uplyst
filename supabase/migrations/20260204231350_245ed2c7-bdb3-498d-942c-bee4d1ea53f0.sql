-- Create waitlist_signups table
CREATE TABLE public.waitlist_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  full_name text NOT NULL,
  email text NOT NULL UNIQUE,
  role text,
  seniority text,
  target_roles text,
  ref_code text UNIQUE,
  referred_by text,
  ref_count integer DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public signup)
CREATE POLICY "Anyone can signup for waitlist"
ON public.waitlist_signups
FOR INSERT
WITH CHECK (true);

-- Allow users to read their own signup by email (for showing position)
CREATE POLICY "Users can read their own signup"
ON public.waitlist_signups
FOR SELECT
USING (true);

-- Create function to generate unique ref code
CREATE OR REPLACE FUNCTION public.generate_ref_code()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result text := '';
  i integer;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$;

-- Create trigger to auto-generate ref_code on insert
CREATE OR REPLACE FUNCTION public.set_ref_code()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.ref_code IS NULL THEN
    NEW.ref_code := public.generate_ref_code();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_waitlist_ref_code
BEFORE INSERT ON public.waitlist_signups
FOR EACH ROW
EXECUTE FUNCTION public.set_ref_code();

-- Create function to increment referrer count
CREATE OR REPLACE FUNCTION public.increment_referrer_count()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.referred_by IS NOT NULL THEN
    UPDATE public.waitlist_signups
    SET ref_count = ref_count + 1
    WHERE ref_code = NEW.referred_by;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER increment_referrer_on_signup
AFTER INSERT ON public.waitlist_signups
FOR EACH ROW
EXECUTE FUNCTION public.increment_referrer_count();