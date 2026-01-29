-- Add skills and experience columns to profiles
ALTER TABLE public.profiles
ADD COLUMN skills text[] DEFAULT '{}',
ADD COLUMN experience jsonb DEFAULT '[]';