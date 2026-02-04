import { cn } from "@/lib/utils";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/SignalBadge";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Shield, Heart, Target, Zap, ShieldCheck } from "lucide-react";

const trustPoints = [
  {
    icon: Shield,
    title: "Built for Senior Talent",
    description: "Designed specifically for experienced professionals navigating layoffs and career pivots.",
  },
  {
    icon: Heart,
    title: "Truth-First Optimization",
    description: "We enhance your real achievements. No fabrication, no exaggeration — just clarity.",
  },
  {
    icon: Target,
    title: "ATS + Human Optimized",
    description: "Pass automated filters AND win the 6-second recruiter skim. Best of both worlds.",
  },
  {
    icon: Zap,
    title: "Speed to Impact",
    description: "Get interview-ready in hours, not weeks. Our AI accelerates your job search.",
  },
];

export const WaitlistTrust = () => {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <section className="py-24 relative overflow-hidden" id="trust" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <Badge 
            variant="primary" 
            className={cn(
              "mb-6 transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <ShieldCheck className="w-3 h-3 mr-1" />
            Our Promise
          </Badge>
          <h2 
            className={cn(
              "text-4xl md:text-5xl font-display font-bold mb-4 transition-all duration-700 delay-100",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            Why <span className="text-primary text-glow">Uplyst</span>?
          </h2>
          <p 
            className={cn(
              "text-lg text-muted-foreground max-w-xl mx-auto transition-all duration-700 delay-200",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            We're building the career tools we wish existed when we were job hunting.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPoints.map((point, index) => (
            <GlassPanel
              key={point.title}
              hover
              className={cn(
                "text-center group transition-all duration-700",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              )}
              style={{ transitionDelay: `${300 + index * 100}ms` }}
            >
              <div className="relative w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
                <point.icon className="w-7 h-7 text-primary" />
                <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-lg font-display font-bold mb-2">{point.title}</h3>
              <p className="text-sm text-muted-foreground">{point.description}</p>
            </GlassPanel>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WaitlistTrust;
