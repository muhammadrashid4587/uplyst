-- Create job applications table
CREATE TABLE public.job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'interview', 'offered', 'rejected', 'withdrawn')),
  cover_letter TEXT,
  resume_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(job_id, user_id)
);

-- Enable RLS
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Users can view their own applications
CREATE POLICY "Users can view their own applications"
  ON public.job_applications FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create applications
CREATE POLICY "Users can create applications"
  ON public.job_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own applications (e.g., withdraw)
CREATE POLICY "Users can update their own applications"
  ON public.job_applications FOR UPDATE
  USING (auth.uid() = user_id);

-- Job posters can view applications for their jobs
CREATE POLICY "Job posters can view applications for their jobs"
  ON public.job_applications FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.jobs 
    WHERE jobs.id = job_applications.job_id 
    AND jobs.posted_by = auth.uid()
  ));

-- Job posters can update application status
CREATE POLICY "Job posters can update application status"
  ON public.job_applications FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.jobs 
    WHERE jobs.id = job_applications.job_id 
    AND jobs.posted_by = auth.uid()
  ));

-- Add trigger for updated_at
CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for applications
ALTER PUBLICATION supabase_realtime ADD TABLE public.job_applications;