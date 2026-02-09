import { cn } from "@/lib/utils";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/SignalBadge";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Clock, Users, Rocket, Globe } from "lucide-react";

const phases = [
  {
    icon: Clock,
    phase: "Phase 1",
    title: "Waitlist",
    status: "current",
    description: "Building the foundation. Join now to secure your spot and shape the product.",
    eta: "Now",
  },
  {
    icon: Users,
    phase: "Phase 2",
    title: "Private Beta",
    status: "upcoming",
    description: "Early access for waitlist members. Test, provide feedback, and help us refine.",
    eta: "Q2 2026",
  },
  {
    icon: Rocket,
    phase: "Phase 3",
    title: "Public Launch",
    status: "future",
    description: "Full platform access with all features. Waitlist members get lifetime perks.",
    eta: "Q3 2026",
  },
];

export const RoadmapTimeline = () => {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <section className="py-24 relative overflow-hidden" ref={ref}>
      {/* Dual-tone gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/6 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tl from-accent/5 via-transparent to-primary/5 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <Badge 
            variant="primary" 
            className={cn(
              "mb-6 transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <Globe className="w-3 h-3 mr-1" />
            Roadmap
          </Badge>
          <h2 
            className={cn(
              "text-4xl md:text-5xl font-display font-bold mb-4 transition-all duration-700 delay-100",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            The Journey <span className="text-primary text-glow">Ahead</span>
          </h2>
          <p 
            className={cn(
              "text-lg text-muted-foreground max-w-xl mx-auto transition-all duration-700 delay-200",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            From waitlist to launch — here's where we're headed.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent md:-translate-x-1/2" />

            {phases.map((phase, index) => (
              <div
                key={phase.phase}
                className={cn(
                  "relative flex items-start gap-6 mb-12 last:mb-0 transition-all duration-700",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12",
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                )}
                style={{ transitionDelay: `${300 + index * 150}ms` }}
              >
                {/* Node */}
                <div
                  className={cn(
                    "absolute left-8 md:left-1/2 w-4 h-4 rounded-full border-2 -translate-x-1/2 z-10",
                    phase.status === "current"
                      ? "bg-primary border-primary animate-pulse"
                      : "bg-background border-primary/50"
                  )}
                />

                {/* Content */}
                <div className={cn(
                  "ml-16 md:ml-0 md:w-[calc(50%-2rem)]",
                  index % 2 === 0 ? "md:text-right md:pr-8" : "md:text-left md:pl-8"
                )}>
                  <GlassPanel
                    hover
                    className={cn(
                      "inline-block text-left",
                      phase.status === "current" && "border-primary/30"
                    )}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        phase.status === "current"
                          ? "bg-primary/20 border border-primary/30"
                          : "bg-muted/50"
                      )}>
                        <phase.icon className={cn(
                          "w-5 h-5",
                          phase.status === "current" ? "text-primary" : "text-muted-foreground"
                        )} />
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">
                          {phase.phase}
                        </span>
                        <h3 className="font-display font-bold">{phase.title}</h3>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {phase.description}
                    </p>
                    <Badge 
                      variant={phase.status === "current" ? "primary" : "muted"}
                      className="text-xs"
                    >
                      {phase.eta}
                    </Badge>
                  </GlassPanel>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoadmapTimeline;
