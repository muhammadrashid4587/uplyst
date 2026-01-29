import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SignalButton } from "@/components/ui/SignalButton";
import { Briefcase, Search, Filter, MapPin, Clock, Building2, ChevronRight, Loader2, Send, CheckCircle, X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
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
}

const formatSalary = (min: number | null, max: number | null) => {
  if (!min && !max) return "Salary not specified";
  if (min && max) return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
  if (min) return `$${(min / 1000).toFixed(0)}k+`;
  return `Up to $${(max! / 1000).toFixed(0)}k`;
};

const JobSkeleton = () => (
  <GlassPanel className="p-5">
    <div className="flex items-start gap-4">
      <Skeleton className="w-12 h-12 rounded-xl" />
      <div className="flex-1">
        <Skeleton className="h-5 w-48 mb-2" />
        <Skeleton className="h-4 w-32 mb-3" />
        <div className="flex gap-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  </GlassPanel>
);

const JobCard = ({ job, userId, onApply }: { job: Job; userId: string | undefined; onApply: (job: Job) => void }) => {
  const { data: application, isLoading } = useApplicationStatus(job.id, userId);

  return (
    <GlassPanel 
      className="p-5 hover:border-primary/30 transition-all cursor-pointer group"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
          <Building2 className="w-6 h-6 text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {job.title}
              </h3>
              <p className="text-muted-foreground">{job.company}</p>
            </div>
            {application ? (
              <div className={cn(
                "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5",
                statusColors[application.status]?.bg,
                statusColors[application.status]?.text
              )}>
                <CheckCircle className="w-3 h-3" />
                {statusLabels[application.status]}
              </div>
            ) : (
              <SignalButton 
                variant="primary" 
                size="sm" 
                className="gap-1.5"
                onClick={(e) => {
                  e.stopPropagation();
                  onApply(job);
                }}
                disabled={!userId || isLoading}
              >
                <Send className="w-3.5 h-3.5" />
                Apply
              </SignalButton>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5" />
              {job.type}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
            </span>
            <span className="ml-auto font-medium text-primary">
              {formatSalary(job.salary_min, job.salary_max)}
            </span>
          </div>
          {job.description && (
            <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
              {job.description}
            </p>
          )}
        </div>
      </div>
    </GlassPanel>
  );
};

const DashboardJobs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [userId, setUserId] = useState<string | undefined>();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);

  const navigate = useNavigate();
  const applyToJob = useApplyToJob();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id);
    });
  }, []);

  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Job[];
    },
  });

  const filteredJobs = jobs?.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApplyClick = (job: Job) => {
    setSelectedJob(job);
    setCoverLetter("");
    setApplyDialogOpen(true);
  };

  const handleSubmitApplication = async () => {
    if (!userId || !selectedJob) return;

    try {
      await applyToJob.mutateAsync({
        userId,
        jobId: selectedJob.id,
        coverLetter: coverLetter.trim() || undefined,
      });

      toast({
        title: "Application submitted!",
        description: `Your application to ${selectedJob.company} has been sent.`,
      });

      setApplyDialogOpen(false);
      setSelectedJob(null);
      setCoverLetter("");
    } catch (error: any) {
      console.error("Failed to apply:", error);
      toast({
        title: "Application failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
              Browse Jobs
            </h1>
            <p className="text-muted-foreground">Find your next opportunity</p>
          </div>
          <SignalButton 
            variant="primary" 
            className="gap-2"
            onClick={() => navigate("/dashboard/jobs/post")}
          >
            <Plus className="w-4 h-4" />
            Post a Job
          </SignalButton>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search jobs, companies, or keywords..." 
              className="pl-10 bg-muted/30 border-border/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <SignalButton variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </SignalButton>
        </div>

        {/* Job Listings */}
        <div className="space-y-4">
          {isLoading ? (
            <>
              <JobSkeleton />
              <JobSkeleton />
              <JobSkeleton />
            </>
          ) : error ? (
            <GlassPanel className="p-8 text-center">
              <p className="text-destructive">Failed to load jobs. Please try again later.</p>
            </GlassPanel>
          ) : filteredJobs?.length === 0 ? (
            <GlassPanel className="p-8 text-center">
              <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground">No jobs found matching your search.</p>
            </GlassPanel>
          ) : (
            filteredJobs?.map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
                userId={userId}
                onApply={handleApplyClick}
              />
            ))
          )}
        </div>
      </div>

      {/* Apply Dialog */}
      <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Apply to {selectedJob?.title}</DialogTitle>
            <DialogDescription>
              at {selectedJob?.company} • {selectedJob?.location}
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

export default DashboardJobs;
