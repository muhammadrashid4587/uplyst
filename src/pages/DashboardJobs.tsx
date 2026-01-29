import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SignalButton } from "@/components/ui/SignalButton";
import { Briefcase, Search, Filter, MapPin, Clock, Building2, ChevronRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

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

const DashboardJobs = () => {
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
            Browse Jobs
          </h1>
          <p className="text-muted-foreground">Find your next opportunity</p>
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
              <GlassPanel 
                key={job.id} 
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
                      <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
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
                  </div>
                </div>
              </GlassPanel>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardJobs;
