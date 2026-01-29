import { DashboardLayout } from "@/components/DashboardLayout";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SignalButton } from "@/components/ui/SignalButton";
import { Briefcase, Search, Filter, MapPin, Clock, Building2, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";

const sampleJobs = [
  { id: 1, title: "Senior Frontend Developer", company: "TechCorp", location: "Remote", type: "Full-time", salary: "$120k - $150k", posted: "2 days ago" },
  { id: 2, title: "Product Designer", company: "DesignCo", location: "New York", type: "Full-time", salary: "$100k - $130k", posted: "1 week ago" },
  { id: 3, title: "Backend Engineer", company: "StartupXYZ", location: "San Francisco", type: "Contract", salary: "$90k - $120k", posted: "3 days ago" },
  { id: 4, title: "DevOps Engineer", company: "CloudInc", location: "Remote", type: "Full-time", salary: "$130k - $160k", posted: "5 days ago" },
  { id: 5, title: "UX Researcher", company: "UserFirst", location: "London", type: "Part-time", salary: "$70k - $90k", posted: "1 day ago" },
];

const DashboardJobs = () => {
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
            />
          </div>
          <SignalButton variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </SignalButton>
        </div>

        {/* Job Listings */}
        <div className="space-y-4">
          {sampleJobs.map((job) => (
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
                      {job.posted}
                    </span>
                    <span className="ml-auto font-medium text-primary">{job.salary}</span>
                  </div>
                </div>
              </div>
            </GlassPanel>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardJobs;
