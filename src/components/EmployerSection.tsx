import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { GlassPanel } from "./ui/GlassPanel";
import { Badge } from "./ui/SignalBadge";
import { SignalButton } from "./ui/SignalButton";
import { cn } from "@/lib/utils";
import { ArrowRight, Filter, Clock, Award, Users, Briefcase } from "lucide-react";

const employerFilters = [
  "Years of Experience",
  "Leadership History",
  "Domain Expertise",
  "Open to Relocation",
  "Security Clearance",
  "Recently Laid Off",
  "Verification Level",
  "Signal Score",
];

export const EmployerSection = () => {
  const { ref, isVisible } = useScrollReveal(0.15);

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      {/* Floating accent */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] float-slow" style={{
        background: "radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)",
      }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center" ref={ref}>
          {/* Left content */}
          <div>
            <Badge 
              variant="primary" 
              className={cn(
                "mb-6 transition-all duration-700",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              <Briefcase className="w-3 h-3 mr-1" />
              For Employers
            </Badge>
            
            <h2 
              className={cn(
                "text-4xl md:text-5xl lg:text-5xl font-display font-bold mb-6 text-3d transition-all duration-700 delay-100",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
            >
              Stop filtering out the people who{" "}
              <span className="text-primary text-glow">built the industry.</span>
            </h2>
            
            <p 
              className={cn(
                "text-lg text-muted-foreground mb-10 leading-relaxed transition-all duration-700 delay-200",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
            >
              Traditional job boards bury senior talent under mountains of keywords and AI screening. 
              Uplyst gives you direct access to verified professionals with proven leadership experience.
            </p>
            
            <div
              className={cn(
                "transition-all duration-700 delay-300",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
            >
              <Link to="/employers">
              <SignalButton variant="primary" size="lg" className="group">
                Start Hiring on Uplyst
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </SignalButton>
              </Link>
            </div>
          </div>

          {/* Right - Filters card */}
          <GlassPanel
            className={cn(
              "p-8 lg:p-10 card-3d transition-all duration-700 delay-200",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            )}
          >
            <h4 className="text-xl font-display font-bold mb-8 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Filter className="w-6 h-6 text-primary" />
              </div>
              Advanced Filters
            </h4>
            
            <div className="flex flex-wrap gap-3 mb-8">
              {employerFilters.map((filter, index) => (
                <div
                  key={filter}
                  className={cn(
                    "px-4 py-2.5 rounded-lg bg-secondary/60 border border-border/40 text-sm font-medium text-foreground hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer duration-300",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  )}
                  style={{ transitionDelay: `${400 + index * 50}ms` }}
                >
                  {filter}
                </div>
              ))}
            </div>
            
            <div className="pt-6 border-t border-border/30">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">24 hours</div>
                    <div>Avg response time</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">92%</div>
                    <div>Verified profiles</div>
                  </div>
                </div>
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>
    </section>
  );
};

export default EmployerSection;
