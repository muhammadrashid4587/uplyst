import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Briefcase, Building2, MapPin, Clock, FileText, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { SignalButton } from "@/components/ui/SignalButton";
import { useMyApplications, useWithdrawApplication, statusColors, statusLabels } from "@/hooks/useJobApplications";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ApplicationSkeleton = () => (
  <GlassPanel className="p-5">
    <div className="flex items-start gap-4">
      <Skeleton className="w-12 h-12 rounded-xl" />
      <div className="flex-1">
        <Skeleton className="h-5 w-48 mb-2" />
        <Skeleton className="h-4 w-32 mb-3" />
        <div className="flex gap-3">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  </GlassPanel>
);

const DashboardApplications = () => {
  const [userId, setUserId] = useState<string | undefined>();
  const [withdrawId, setWithdrawId] = useState<string | null>(null);

  const { data: applications, isLoading } = useMyApplications(userId);
  const withdrawApplication = useWithdrawApplication();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id);
    });
  }, []);

  const handleWithdraw = async () => {
    if (!withdrawId) return;

    try {
      await withdrawApplication.mutateAsync(withdrawId);
      toast({
        title: "Application withdrawn",
        description: "Your application has been withdrawn.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to withdraw application.",
        variant: "destructive",
      });
    } finally {
      setWithdrawId(null);
    }
  };

  const activeApplications = applications?.filter((a) => a.status !== "withdrawn") || [];
  const withdrawnApplications = applications?.filter((a) => a.status === "withdrawn") || [];

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
            My Applications
          </h1>
          <p className="text-muted-foreground">Track your job application status</p>
        </div>

        {/* Stats */}
        {!isLoading && applications && applications.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <GlassPanel className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{applications.length}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </GlassPanel>
            <GlassPanel className="p-4 text-center">
              <p className="text-2xl font-bold text-yellow-400">
                {applications.filter((a) => a.status === "pending").length}
              </p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </GlassPanel>
            <GlassPanel className="p-4 text-center">
              <p className="text-2xl font-bold text-purple-400">
                {applications.filter((a) => a.status === "interview").length}
              </p>
              <p className="text-sm text-muted-foreground">Interviews</p>
            </GlassPanel>
            <GlassPanel className="p-4 text-center">
              <p className="text-2xl font-bold text-green-400">
                {applications.filter((a) => a.status === "offered").length}
              </p>
              <p className="text-sm text-muted-foreground">Offers</p>
            </GlassPanel>
          </div>
        )}

        {/* Applications List */}
        <div className="space-y-4">
          {isLoading ? (
            <>
              <ApplicationSkeleton />
              <ApplicationSkeleton />
              <ApplicationSkeleton />
            </>
          ) : !applications?.length ? (
            <GlassPanel className="p-12 text-center">
              <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No applications yet</h3>
              <p className="text-muted-foreground mb-4">
                Start applying to jobs to track your progress here.
              </p>
              <SignalButton variant="primary" onClick={() => window.location.href = "/dashboard/jobs"}>
                Browse Jobs
              </SignalButton>
            </GlassPanel>
          ) : (
            <>
              {/* Active Applications */}
              {activeApplications.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground">Active Applications</h2>
                  {activeApplications.map((application) => (
                    <GlassPanel key={application.id} className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-6 h-6 text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {application.job?.title || "Job Title"}
                              </h3>
                              <p className="text-muted-foreground">
                                {application.job?.company || "Company"}
                              </p>
                            </div>
                            <div className={cn(
                              "px-3 py-1 rounded-full text-xs font-medium",
                              statusColors[application.status]?.bg,
                              statusColors[application.status]?.text
                            )}>
                              {statusLabels[application.status]}
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-muted-foreground">
                            {application.job?.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" />
                                {application.job.location}
                              </span>
                            )}
                            {application.job?.type && (
                              <span className="flex items-center gap-1">
                                <Briefcase className="w-3.5 h-3.5" />
                                {application.job.type}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              Applied {formatDistanceToNow(new Date(application.created_at), { addSuffix: true })}
                            </span>
                          </div>
                          {application.cover_letter && (
                            <div className="mt-3 p-3 rounded-lg bg-muted/30 border border-border/30">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                <FileText className="w-3.5 h-3.5" />
                                Cover Letter
                              </div>
                              <p className="text-sm text-foreground line-clamp-2">
                                {application.cover_letter}
                              </p>
                            </div>
                          )}
                          {application.status === "pending" && (
                            <div className="mt-4">
                              <SignalButton
                                variant="outline"
                                size="sm"
                                onClick={() => setWithdrawId(application.id)}
                              >
                                Withdraw Application
                              </SignalButton>
                            </div>
                          )}
                        </div>
                      </div>
                    </GlassPanel>
                  ))}
                </div>
              )}

              {/* Withdrawn Applications */}
              {withdrawnApplications.length > 0 && (
                <div className="space-y-4 mt-8">
                  <h2 className="text-lg font-semibold text-muted-foreground">Withdrawn</h2>
                  {withdrawnApplications.map((application) => (
                    <GlassPanel key={application.id} className="p-5 opacity-60">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-muted/20 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-semibold text-muted-foreground">
                                {application.job?.title || "Job Title"}
                              </h3>
                              <p className="text-muted-foreground/70">
                                {application.job?.company || "Company"}
                              </p>
                            </div>
                            <div className={cn(
                              "px-3 py-1 rounded-full text-xs font-medium",
                              statusColors[application.status]?.bg,
                              statusColors[application.status]?.text
                            )}>
                              {statusLabels[application.status]}
                            </div>
                          </div>
                        </div>
                      </div>
                    </GlassPanel>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Withdraw Confirmation Dialog */}
      <AlertDialog open={!!withdrawId} onOpenChange={() => setWithdrawId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Withdraw Application?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to withdraw this application? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={withdrawApplication.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleWithdraw}
              disabled={withdrawApplication.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {withdrawApplication.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Withdraw
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default DashboardApplications;
