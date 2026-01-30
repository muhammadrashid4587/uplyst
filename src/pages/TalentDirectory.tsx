import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SignalButton } from "@/components/ui/SignalButton";
import { Badge } from "@/components/ui/SignalBadge";
import { FilterPill } from "@/components/ui/FilterPill";
import { ProfileCard } from "@/components/ProfileCard";
import { mockTalent, TalentProfile } from "@/data/mockTalent";
import { Input } from "@/components/ui/input";
import { TalentChatbot } from "@/components/TalentChatbot";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, X, Users } from "lucide-react";

type SortOption = "signalScore" | "verified" | "recentlyLaidOff" | "yearsExperience";

const domains = [
  "All Domains",
  "Cloud Infrastructure",
  "Enterprise SaaS",
  "AI/ML",
  "Finance & Operations",
  "Product Design",
  "Cybersecurity",
  "Human Resources",
  "Full-Stack Engineering",
  "Growth & Marketing",
  "Backend Systems",
  "Customer Experience",
  "Data Platform",
];

const seniorityLevels = ["All Levels", "Principal", "Director", "Senior Manager", "VP", "C-Suite"];

const TalentDirectory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("All Domains");
  const [selectedSeniority, setSelectedSeniority] = useState("All Levels");
  const [sortBy, setSortBy] = useState<SortOption>("signalScore");
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const quickFilters = [
    { id: "verified", label: "Verified" },
    { id: "recentlyLaidOff", label: "Recently Laid Off" },
    { id: "openToRelocation", label: "Open to Relocation" },
    { id: "securityClearance", label: "Security Clearance" },
  ];

  const toggleFilter = (filterId: string) => {
    setActiveFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((f) => f !== filterId)
        : [...prev, filterId]
    );
  };

  const filteredTalent = useMemo(() => {
    let result = [...mockTalent];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.title.toLowerCase().includes(query) ||
          p.skills.some((s) => s.toLowerCase().includes(query)) ||
          p.domain.toLowerCase().includes(query)
      );
    }

    // Domain filter
    if (selectedDomain !== "All Domains") {
      result = result.filter((p) => p.domain === selectedDomain);
    }

    // Seniority filter
    if (selectedSeniority !== "All Levels") {
      result = result.filter((p) => p.seniorityLevel === selectedSeniority);
    }

    // Quick filters
    if (activeFilters.includes("verified")) {
      result = result.filter((p) => p.verified);
    }
    if (activeFilters.includes("recentlyLaidOff")) {
      result = result.filter((p) => p.recentlyLaidOff);
    }
    if (activeFilters.includes("openToRelocation")) {
      result = result.filter((p) => p.openToRelocation);
    }
    if (activeFilters.includes("securityClearance")) {
      result = result.filter((p) => p.securityClearance);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "signalScore":
          return b.signalScore - a.signalScore;
        case "verified":
          return (b.verified ? 1 : 0) - (a.verified ? 1 : 0);
        case "recentlyLaidOff":
          return (b.recentlyLaidOff ? 1 : 0) - (a.recentlyLaidOff ? 1 : 0);
        case "yearsExperience":
          return b.yearsExperience - a.yearsExperience;
        default:
          return 0;
      }
    });

    return result;
  }, [searchQuery, selectedDomain, selectedSeniority, sortBy, activeFilters]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedDomain("All Domains");
    setSelectedSeniority("All Levels");
    setActiveFilters([]);
  };

  const hasActiveFilters =
    searchQuery ||
    selectedDomain !== "All Domains" ||
    selectedSeniority !== "All Levels" ||
    activeFilters.length > 0;

  return (
    <Layout>
      {/* Header */}
      <section className="py-16 border-b border-border/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <Badge variant="primary" className="mb-4">Talent Directory</Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Find senior talent
            </h1>
            <p className="text-lg text-muted-foreground">
              Browse verified senior professionals ready for their next role.
              Filter by experience, domain, and signal strength.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Search and Filters Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name, title, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-card border-border/50"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                <SelectTrigger className="w-[180px] h-12 bg-card border-border/50">
                  <SelectValue placeholder="Domain" />
                </SelectTrigger>
                <SelectContent>
                  {domains.map((domain) => (
                    <SelectItem key={domain} value={domain}>
                      {domain}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSeniority} onValueChange={setSelectedSeniority}>
                <SelectTrigger className="w-[160px] h-12 bg-card border-border/50">
                  <SelectValue placeholder="Seniority" />
                </SelectTrigger>
                <SelectContent>
                  {seniorityLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="w-[180px] h-12 bg-card border-border/50">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="signalScore">Highest Signal</SelectItem>
                  <SelectItem value="verified">Most Verified</SelectItem>
                  <SelectItem value="recentlyLaidOff">Recently Laid Off</SelectItem>
                  <SelectItem value="yearsExperience">Most Experience</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            {quickFilters.map((filter) => (
              <FilterPill
                key={filter.id}
                label={filter.label}
                active={activeFilters.includes(filter.id)}
                onToggle={() => toggleFilter(filter.id)}
              />
            ))}

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <X className="w-4 h-4" />
                Clear all
              </button>
            )}
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-5 h-5" />
              <span>
                <span className="text-foreground font-medium">{filteredTalent.length}</span>{" "}
                professionals found
              </span>
            </div>
          </div>

          {/* Results Grid */}
          {filteredTalent.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTalent.map((profile, index) => (
                <div
                  key={profile.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ProfileCard profile={profile} index={index} />
                </div>
              ))}
            </div>
          ) : (
            <GlassPanel className="text-center py-16">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-display font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or search query
              </p>
              <SignalButton variant="secondary" onClick={clearAllFilters}>
                Clear all filters
              </SignalButton>
            </GlassPanel>
          )}
        </div>
      </section>

      <TalentChatbot />
    </Layout>
  );
};

export default TalentDirectory;
