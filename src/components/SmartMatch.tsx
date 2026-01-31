import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SignalButton } from "@/components/ui/SignalButton";
import { Badge } from "@/components/ui/SignalBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Sparkles, 
  RefreshCw, 
  MapPin, 
  Building, 
  Briefcase,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  Zap,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface JobMatch {
  job_id: string;
  match_score: number;
  match_reasons: string[];
  potential_concerns: string[];
  recommendation: string;
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    description: string | null;
    requirements: string[] | null;
    salary_min: number | null;
    salary_max: number | null;
  };
}

export function SmartMatch() {
  const { demoMode } = useDemoMode();
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch current user and profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["current-user-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const fetchMatches = async () => {
    if (!profile) {
      toast.error("Please complete your profile first");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/smart-match`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            profile,
            useDemoData: demoMode.enabled,
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again later.");
        }
        if (response.status === 402) {
          throw new Error("AI credits exhausted. Please add credits.");
        }
        throw new Error("Failed to fetch matches");
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setMatches(data.matches || []);
      setHasSearched(true);
      
      if (data.matches?.length > 0) {
        toast.success(`Found ${data.matches.length} job matches for you!`);
      } else {
        toast.info("No matching jobs found. Try updating your profile.");
      }
    } catch (err) {
      console.error("Smart match error:", err);
      setError(err instanceof Error ? err.message : "Failed to find matches");
      toast.error(err instanceof Error ? err.message : "Failed to find matches");
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-primary";
    if (score >= 75) return "text-primary";
    if (score >= 60) return "text-accent";
    return "text-muted-foreground";
  };

  const getScoreBadgeVariant = (score: number): "success" | "primary" | "warning" | "muted" => {
    if (score >= 90) return "success";
    if (score >= 75) return "primary";
    if (score >= 60) return "warning";
    return "muted";
  };

  if (profileLoading) {
    return (
      <GlassPanel>
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div>
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </GlassPanel>
    );
  }

  return (
    <GlassPanel className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold flex items-center gap-2">
                Smart Match
                <Badge variant="primary" size="sm">AI</Badge>
              </h3>
              <p className="text-sm text-muted-foreground">
                AI-powered job recommendations based on your profile
              </p>
            </div>
          </div>
          <SignalButton
            variant="secondary"
            size="sm"
            onClick={fetchMatches}
            disabled={isLoading || !profile}
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Zap className="w-4 h-4 mr-1" />
                {hasSearched ? "Refresh" : "Find Matches"}
              </>
            )}
          </SignalButton>
        </div>

        {/* Content */}
        {!hasSearched && !isLoading && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h4 className="font-display font-semibold mb-2">
              Discover Your Perfect Match
            </h4>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
              Our AI analyzes your skills, experience, and preferences to find the best job opportunities for you.
            </p>
            <SignalButton variant="primary" onClick={fetchMatches} disabled={!profile}>
              <Sparkles className="w-4 h-4 mr-2" />
              Start Matching
            </SignalButton>
          </div>
        )}

        {isLoading && (
          <div className="space-y-4">
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  Analyzing your profile and finding matches...
                </p>
              </div>
            </div>
          </div>
        )}

        {error && !isLoading && (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-3" />
            <p className="text-sm text-destructive">{error}</p>
            <SignalButton variant="secondary" size="sm" onClick={fetchMatches} className="mt-4">
              Try Again
            </SignalButton>
          </div>
        )}

        {hasSearched && !isLoading && !error && matches.length === 0 && (
          <div className="text-center py-8">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h4 className="font-display font-semibold mb-2">No Matches Found</h4>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Try updating your profile with more skills and experience to find better matches.
            </p>
            <Link to="/dashboard/profile">
              <SignalButton variant="secondary" size="sm" className="mt-4">
                Update Profile
              </SignalButton>
            </Link>
          </div>
        )}

        {hasSearched && !isLoading && !error && matches.length > 0 && (
          <div className="space-y-4">
            {matches.map((match, index) => (
              <div
                key={match.job_id}
                className="p-4 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-muted-foreground">#{index + 1}</span>
                      <Badge variant={getScoreBadgeVariant(match.match_score)} size="sm">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {match.match_score}% Match
                      </Badge>
                    </div>
                    <h4 className="font-display font-semibold group-hover:text-primary transition-colors">
                      {match.job.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        {match.job.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {match.job.location}
                      </span>
                      <Badge variant="muted" size="sm">{match.job.type}</Badge>
                    </div>

                    {/* Match Reasons */}
                    <div className="mt-3 space-y-1">
                      {match.match_reasons.slice(0, 3).map((reason, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                          <span className="text-muted-foreground">{reason}</span>
                        </div>
                      ))}
                      {match.potential_concerns.length > 0 && (
                        <div className="flex items-start gap-2 text-sm">
                          <XCircle className="w-3.5 h-3.5 text-destructive mt-0.5 shrink-0" />
                          <span className="text-muted-foreground">{match.potential_concerns[0]}</span>
                        </div>
                      )}
                    </div>

                    {/* Recommendation */}
                    <p className="mt-3 text-sm text-foreground/80 italic">
                      "{match.recommendation}"
                    </p>

                    {/* Salary */}
                    {match.job.salary_min && match.job.salary_max && (
                      <p className="mt-2 text-sm font-medium text-primary">
                        ${match.job.salary_min.toLocaleString()} - ${match.job.salary_max.toLocaleString()}
                      </p>
                    )}
                  </div>
                  
                  <Link to={`/jobs/${match.job_id}`}>
                    <SignalButton variant="ghost" size="sm" className="shrink-0">
                      View
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </SignalButton>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </GlassPanel>
  );
}
