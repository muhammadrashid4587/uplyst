import { useState } from "react";
import { Layout } from "@/components/Layout";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SignalButton } from "@/components/ui/SignalButton";
import { Badge } from "@/components/ui/SignalBadge";
import { mockTalent } from "@/data/mockTalent";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  Users,
  BookmarkPlus,
  Send,
  Filter,
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  Eye,
  Trash2,
  MoreHorizontal,
  Building,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

const EmployerPortal = () => {
  const [activeTab, setActiveTab] = useState<"dashboard" | "searches" | "shortlist" | "outreach">("dashboard");

  const savedSearches = [
    {
      id: 1,
      name: "VP Engineering - Cloud",
      filters: ["VP", "Cloud Infrastructure", "15+ years"],
      results: 23,
      lastUpdated: "2 hours ago",
    },
    {
      id: 2,
      name: "C-Suite Product Leaders",
      filters: ["C-Suite", "Enterprise SaaS", "Open to Relocation"],
      results: 8,
      lastUpdated: "1 day ago",
    },
    {
      id: 3,
      name: "ML Directors - Recently Laid Off",
      filters: ["Director", "AI/ML", "Recently Laid Off"],
      results: 12,
      lastUpdated: "3 days ago",
    },
  ];

  const shortlistedCandidates = mockTalent.slice(0, 4);
  const outreachQueue = mockTalent.slice(4, 7);

  const stats = [
    { label: "Profile Views", value: "156", change: "+12%", icon: Eye },
    { label: "Shortlisted", value: "24", change: "+5", icon: BookmarkPlus },
    { label: "Messages Sent", value: "18", change: "+3", icon: Send },
    { label: "Responses", value: "12", change: "67%", icon: CheckCircle },
  ];

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Zap },
    { id: "searches", label: "Saved Searches", icon: Search },
    { id: "shortlist", label: "Shortlist", icon: BookmarkPlus },
    { id: "outreach", label: "Outreach Queue", icon: Send },
  ];

  return (
    <Layout>
      {/* Header */}
      <section className="py-12 border-b border-border/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <Badge variant="primary" className="mb-3">Employer Portal</Badge>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
                Welcome back
              </h1>
              <p className="text-muted-foreground">
                Manage your searches, shortlists, and candidate outreach
              </p>
            </div>
            <Link to="/talent">
              <SignalButton variant="primary">
                <Search className="w-4 h-4 mr-2" />
                Search Talent
              </SignalButton>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Stats Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <GlassPanel key={stat.label} className="animate-fade-up" style={{ animationDelay: `${index * 50}ms` }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-display font-bold">{stat.value}</p>
                    <p className="text-sm text-primary mt-1">{stat.change}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </GlassPanel>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "bg-secondary text-secondary-foreground hover:bg-muted"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "dashboard" && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <GlassPanel>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-display font-semibold">Recent Activity</h3>
                  <span className="text-sm text-muted-foreground">Last 7 days</span>
                </div>
                <div className="space-y-4">
                  {[
                    { action: "Viewed profile", name: "Sarah Chen", time: "2 hours ago" },
                    { action: "Added to shortlist", name: "Marcus Johnson", time: "5 hours ago" },
                    { action: "Sent message", name: "Dr. Elena Rodriguez", time: "1 day ago" },
                    { action: "Received response", name: "David Park", time: "2 days ago" },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center gap-4 py-3 border-b border-border/30 last:border-0">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{activity.name[0]}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.name}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </GlassPanel>

              {/* Top Matches */}
              <GlassPanel>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-display font-semibold">Top Matches Today</h3>
                  <Link to="/talent" className="text-sm text-primary hover:underline">
                    View all
                  </Link>
                </div>
                <div className="space-y-4">
                  {mockTalent.slice(0, 4).map((profile) => (
                    <Link
                      key={profile.id}
                      to={`/talent/${profile.id}`}
                      className="flex items-center gap-4 py-3 border-b border-border/30 last:border-0 hover:bg-muted/30 -mx-4 px-4 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
                        <span className="text-sm font-bold text-primary">
                          {profile.name.split(" ").map((n) => n[0]).join("")}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{profile.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{profile.title}</p>
                      </div>
                      <Badge variant="primary" size="sm">
                        <Star className="w-3 h-3 mr-1" />
                        {profile.signalScore}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </GlassPanel>
            </div>
          )}

          {activeTab === "searches" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-display font-semibold">Saved Searches</h3>
                <SignalButton variant="secondary" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Search
                </SignalButton>
              </div>
              {savedSearches.map((search) => (
                <GlassPanel key={search.id} hover className="cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-display font-semibold mb-2">{search.name}</h4>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {search.filters.map((filter) => (
                          <Badge key={filter} variant="muted" size="sm">
                            {filter}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {search.results} results
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Updated {search.lastUpdated}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <SignalButton variant="ghost" size="sm">
                        <ArrowRight className="w-4 h-4" />
                      </SignalButton>
                      <SignalButton variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </SignalButton>
                    </div>
                  </div>
                </GlassPanel>
              ))}
            </div>
          )}

          {activeTab === "shortlist" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-display font-semibold">
                  Shortlisted Candidates ({shortlistedCandidates.length})
                </h3>
                <div className="flex gap-2">
                  <SignalButton variant="secondary" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </SignalButton>
                  <SignalButton variant="primary" size="sm">
                    <Send className="w-4 h-4 mr-2" />
                    Message All
                  </SignalButton>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {shortlistedCandidates.map((profile) => (
                  <GlassPanel key={profile.id} hover>
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
                        <span className="text-lg font-bold text-primary">
                          {profile.name.split(" ").map((n) => n[0]).join("")}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link to={`/talent/${profile.id}`}>
                          <h4 className="font-display font-semibold hover:text-primary transition-colors">
                            {profile.name}
                          </h4>
                        </Link>
                        <p className="text-sm text-muted-foreground mb-2">{profile.title}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="primary" size="sm">
                            <Star className="w-3 h-3 mr-1" />
                            {profile.signalScore}
                          </Badge>
                          <Badge variant="muted" size="sm">{profile.location.split(",")[0]}</Badge>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <SignalButton variant="ghost" size="sm">
                          <Send className="w-4 h-4" />
                        </SignalButton>
                        <SignalButton variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </SignalButton>
                      </div>
                    </div>
                  </GlassPanel>
                ))}
              </div>
            </div>
          )}

          {activeTab === "outreach" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-display font-semibold">
                  Outreach Queue ({outreachQueue.length})
                </h3>
                <SignalButton variant="primary" size="sm">
                  <Send className="w-4 h-4 mr-2" />
                  Send All Pending
                </SignalButton>
              </div>
              <div className="space-y-4">
                {outreachQueue.map((profile, index) => (
                  <GlassPanel key={profile.id}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
                        <span className="text-sm font-bold text-primary">
                          {profile.name.split(" ").map((n) => n[0]).join("")}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link to={`/talent/${profile.id}`}>
                          <h4 className="font-display font-semibold hover:text-primary transition-colors">
                            {profile.name}
                          </h4>
                        </Link>
                        <p className="text-sm text-muted-foreground">{profile.title}</p>
                      </div>
                      <Badge variant={index === 0 ? "success" : "muted"} size="sm">
                        {index === 0 ? "Ready to Send" : "Draft"}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <SignalButton variant="primary" size="sm">
                          <Send className="w-4 h-4 mr-1" />
                          Send
                        </SignalButton>
                        <SignalButton variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </SignalButton>
                      </div>
                    </div>
                  </GlassPanel>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Onboarding CTA (for new employers) */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <GlassPanel variant="strong" className="text-center py-12 relative overflow-hidden">
            <div className="absolute inset-0 grid-pattern opacity-30" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/20 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <Building className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-display font-bold mb-2">
                Upgrade to Growth
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Get unlimited profile views, advanced filters, and a dedicated success manager.
              </p>
              <SignalButton variant="primary">
                Upgrade Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </SignalButton>
            </div>
          </GlassPanel>
        </div>
      </section>
    </Layout>
  );
};

export default EmployerPortal;
