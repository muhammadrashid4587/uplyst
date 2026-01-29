import { DashboardLayout } from "@/components/DashboardLayout";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Star, Building2, MapPin, Briefcase, Trash2 } from "lucide-react";
import { SignalButton } from "@/components/ui/SignalButton";

const savedItems = [
  { id: 1, title: "Senior Frontend Developer", company: "TechCorp", location: "Remote", type: "Full-time" },
  { id: 2, title: "Product Designer", company: "DesignCo", location: "New York", type: "Full-time" },
];

const DashboardSaved = () => {
  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
            Saved Items
          </h1>
          <p className="text-muted-foreground">Jobs and opportunities you've bookmarked</p>
        </div>

        {/* Saved Items */}
        {savedItems.length > 0 ? (
          <div className="space-y-4">
            {savedItems.map((item) => (
              <GlassPanel key={item.id} className="p-5 hover:border-primary/30 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 text-accent" />
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
          <GlassPanel className="p-12 text-center">
            <Star className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No saved items yet</h3>
            <p className="text-muted-foreground mb-4">
              Start browsing jobs and save the ones you're interested in.
            </p>
            <SignalButton variant="primary">Browse Jobs</SignalButton>
          </GlassPanel>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardSaved;
