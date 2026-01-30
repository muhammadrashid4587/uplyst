import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { EmptyState } from "@/components/ui/EmptyState";
import { Star, Building2, MapPin, Briefcase, Trash2, Bookmark, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const savedJobs = [
  { id: 1, title: "Senior Frontend Developer", company: "TechCorp", location: "Remote", type: "Full-time" },
  { id: 2, title: "Product Designer", company: "DesignCo", location: "New York", type: "Full-time" },
];

const savedCandidates = [
  { id: 1, name: "Sarah Chen", title: "VP of Engineering", location: "San Francisco", companies: ["Stripe", "Google"] },
];

const DashboardSaved = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
            Saved Items
          </h1>
          <p className="text-muted-foreground">Jobs and candidates you've bookmarked</p>
        </div>

        <Tabs defaultValue="jobs" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="jobs" className="gap-2">
              <Briefcase className="w-4 h-4" />
              Saved Jobs
            </TabsTrigger>
            <TabsTrigger value="candidates" className="gap-2">
              <Users className="w-4 h-4" />
              Saved Candidates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jobs">
            {savedJobs.length > 0 ? (
              <div className="space-y-4">
                {savedJobs.map((item) => (
                  <GlassPanel key={item.id} className="p-5 hover:border-primary/30 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-6 h-6 text-accent-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                        <p className="text-muted-foreground">{item.company}</p>
                        <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {item.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3.5 h-3.5" />
                            {item.type}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors">
                          <Star className="w-5 h-5 fill-current" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </GlassPanel>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Bookmark}
                title="No saved jobs yet"
                description="Browse jobs and save the ones you're interested in. They'll appear here for easy access."
                action={{
                  label: "Browse Jobs",
                  onClick: () => navigate("/dashboard/jobs"),
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="candidates">
            {savedCandidates.length > 0 ? (
              <div className="space-y-4">
                {savedCandidates.map((candidate) => (
                  <GlassPanel key={candidate.id} className="p-5 hover:border-primary/30 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-semibold text-primary">
                          {candidate.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground">{candidate.name}</h3>
                        <p className="text-muted-foreground">{candidate.title}</p>
                        <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {candidate.location}
                          </span>
                          <span className="text-xs">
                            Previously: {candidate.companies.join(", ")}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors">
                          <Bookmark className="w-5 h-5 fill-current" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </GlassPanel>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Users}
                title="No saved candidates yet"
                description="Browse talent and save candidates to your shortlist. They'll appear here for easy comparison."
                action={{
                  label: "Browse Talent",
                  onClick: () => navigate("/talent"),
                }}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DashboardSaved;
