import { useScrollReveal } from "@/hooks/useScrollReveal";
import { GlassPanel } from "./ui/GlassPanel";
import { Badge } from "./ui/SignalBadge";
import { cn } from "@/lib/utils";
import { Sparkles, Shield, Target, Zap } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Create Your Signal Profile",
    description: "Upload your resume and evidence of experience. Add achievements, leadership roles, and notable projects that define your career.",
    icon: Sparkles,
    color: "from-primary/20 to-signal-maroon/20",
  },
  {
    step: "02",
    title: "Get Verified",
    description: "Signal analyzes and verifies seniority indicators — credentials, tenure, impact metrics, and references that prove your worth.",
    icon: Shield,
    color: "from-primary/20 to-primary/5",
  },
  {
    step: "03",
    title: "Connect Directly",
    description: "Employers search by signal strength and fast-track outreach to verified senior professionals like you.",
    icon: Target,
    color: "from-signal-maroon/20 to-primary/10",
  },
];

export const AnimatedTimeline = () => {
  const { ref, isVisible } = useScrollReveal(0.15);

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-20" ref={ref}>
          <Badge 
            variant="primary" 
            className={cn(
              "mb-6 transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <Zap className="w-3 h-3 mr-1" />
            How It Works
          </Badge>
          <h2 
            className={cn(
              "text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-3d transition-all duration-700 delay-100",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            Three steps to{" "}
            <span className="text-primary text-glow">visibility</span>
          </h2>
          <p 
            className={cn(
              "text-lg text-muted-foreground max-w-2xl mx-auto transition-all duration-700 delay-200",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            We've streamlined the process to get you in front of the right employers as fast as possible.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connecting line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/30 to-transparent hidden lg:block" />

          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, index) => (
              <div
                key={step.step}
                className={cn(
                  "relative transition-all duration-700",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12",
                  index % 2 === 0 ? "lg:pr-[55%]" : "lg:pl-[55%]"
                )}
                style={{ transitionDelay: `${300 + index * 200}ms` }}
              >
                {/* Step number on timeline (desktop) */}
                <div className="absolute left-1/2 -translate-x-1/2 top-8 hidden lg:flex">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-display font-bold text-xl shadow-glow pulse-ring">
                    {step.step}
                  </div>
                </div>

                <GlassPanel
                  hover
                  className={cn(
                    "relative card-3d p-8 lg:p-10",
                    "bg-gradient-to-br",
                    step.color
                  )}
                >
                  {/* Step number (mobile) */}
                  <div className="flex items-center gap-4 mb-6 lg:hidden">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-display font-bold shadow-glow">
                      {step.step}
                    </div>
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>

                  {/* Icon (desktop) */}
                  <div className="hidden lg:block mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <step.icon className="w-8 h-8 text-primary animate-glow-pulse" />
                    </div>
                  </div>

                  <h3 className="text-2xl lg:text-3xl font-display font-bold mb-4">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {step.description}
                  </p>
                </GlassPanel>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnimatedTimeline;
