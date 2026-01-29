import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SignalButton } from "@/components/ui/SignalButton";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Briefcase, MapPin, Clock, Building2, DollarSign, ArrowLeft, 
  Send, CheckCircle, Loader2, ExternalLink, Share2 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { useApplyToJob, useApplicationStatus, statusColors, statusLabels } from "@/hooks/useJobApplications";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary_min: number | null;
  salary_max: number | null;
  description: string | null;
  requirements: string[] | null;
  created_at: string;
  posted_by: string | null;
}

const formatSalary = (min: number | null, max: number | null) => {
  if (!min && !max) return null;
  if (min && max) return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k per year`;
  if (min) return `$${(min / 1000).toFixed(0)}k+ per year`;
  return `Up to $${(max! / 1000).toFixed(0)}k per year`;
};

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | undefined>();
  const [coverLetter, setCoverLetter] = useState("");
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);

  const applyToJob = useApplyToJob();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id);
    });
  }, []);

  const { data: job, isLoading, error } = useQuery({
    queryKey: ["job", id],
    queryFn: async () => {
      if (!id) throw new Error("No job ID provided");
      
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .eq("is_active", true)
        .single();

      if (error) throw error;
      return data as Job;
    },
    enabled: !!id,
  });

  const { data: application } = useApplicationStatus(id || "", userId);

  const handleApply = () => {
    if (!userId) {
      toast({
        title: "Login required",
        description: "Please log in to apply for jobs.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    setCoverLetter("");
    setApplyDialogOpen(true);
  };

  const handleSubmitApplication = async () => {
    if (!userId || !job) return;

    try {
      await applyToJob.mutateAsync({
        userId,
        jobId: job.id,
        coverLetter: coverLetter.trim() || undefined,
      });

      toast({
        title: "Application submitted!",
        description: `Your application to ${job.company} has been sent.`,
      });

      setApplyDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Application failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: job?.title, url });
    } else {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied to clipboard" });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 lg:p-8 max-w-4xl">
          <Skeleton className="h-8 w-32 mb-6" />
          <GlassPanel className="p-6 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
            <div className="flex gap-4">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-40 w-full" />
          </GlassPanel>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !job) {
    return (
      <DashboardLayout>
        <div className="p-6 lg:p-8 max-w-4xl">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <GlassPanel className="p-8 text-center">
            <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Job not found</h2>
            <p className="text-muted-foreground mb-4">
              This job listing may have been removed or is no longer available.
            </p>
            <SignalButton variant="primary" onClick={() => navigate("/dashboard/jobs")}>
              Browse Jobs
            </SignalButton>
          </GlassPanel>
        </div>
      </DashboardLayout>
    );
  }

  const salary = formatSalary(job.salary_min, job.salary_max);

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-4xl">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </button>

        {/* Job Header */}
        <GlassPanel className="p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            <div className="w-16 h-16 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-8 h-8 text-accent" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
                {job.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-4">{job.company}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" />
                  {job.type}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  Posted {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                </span>
                {salary && (
                  <span className="flex items-center gap-1.5 text-primary font-medium">
                    <DollarSign className="w-4 h-4" />
                    {salary}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
              {application ? (
                <div className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 justify-center",
                  statusColors[application.status]?.bg,
                  statusColors[application.status]?.text
                )}>
                  <CheckCircle className="w-4 h-4" />
                  {statusLabels[application.status]}
                </div>
              ) : (
                <SignalButton 
                  variant="primary" 
                  className="gap-2"
                  onClick={handleApply}
                >
                  <Send className="w-4 h-4" />
                  Apply Now
                </SignalButton>
              )}
              <SignalButton variant="outline" className="gap-2" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
                Share
              </SignalButton>
            </div>
          </div>
        </GlassPanel>

        {/* Job Description */}
        {job.description && (
          <GlassPanel className="p-6 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">About this role</h2>
            <div className="prose prose-sm prose-invert max-w-none">
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {job.description}
              </p>
            </div>
          </GlassPanel>
        )}

        {/* Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <GlassPanel className="p-6 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Requirements</h2>
            <ul className="space-y-3">
              {job.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-3 text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </GlassPanel>
        )}

        {/* Apply CTA */}
        {!application && (
          <GlassPanel className="p-6 text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Interested in this position?
            </h3>
            <p className="text-muted-foreground mb-4">
              Submit your application and take the next step in your career.
            </p>
            <SignalButton variant="primary" className="gap-2" onClick={handleApply}>
              <Send className="w-4 h-4" />
              Apply Now
            </SignalButton>
          </GlassPanel>
        )}
      </div>

      {/* Apply Dialog */}
      <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Apply to {job.title}</DialogTitle>
            <DialogDescription>
              at {job.company} • {job.location}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Cover Letter (Optional)
              </label>
              <Textarea
                placeholder="Tell them why you're a great fit for this role..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="min-h-[150px]"
                maxLength={2000}
              />
              <p className="text-xs text-muted-foreground text-right">
                {coverLetter.length}/2000
              </p>
            </div>
          </div>
          <DialogFooter>
            <SignalButton 
              variant="outline" 
              onClick={() => setApplyDialogOpen(false)}
              disabled={applyToJob.isPending}
            >
              Cancel
            </SignalButton>
            <SignalButton 
              variant="primary" 
              onClick={handleSubmitApplication}
              disabled={applyToJob.isPending}
              className="gap-2"
            >
              {applyToJob.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Submit Application
            </SignalButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default JobDetail;
