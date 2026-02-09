import { useState } from "react";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ChevronDown, FileSearch, Languages, Target, Shield } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";

const steps = [
  {
    icon: FileSearch,
    number: "1",
    title: "We parse real experience",
    description: "Your resume is broken into structured, verifiable facts.",
  },
  {
    icon: Languages,
    number: "2",
    title: "We map it to job language",
    description: "Without inventing skills, titles, or metrics.",
  },
  {
    icon: Target,
    number: "3",
    title: "We optimize for screening systems",
    description: "So you reach a human review.",
  },
  {
    icon: Shield,
    number: "4",
    title: "We preserve credibility",
    description: "No exaggeration. No fabrication. Ever.",
  },
];

export const HowItWorks = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <section className="py-12 md:py-16 relative" ref={ref}>
      <div className="container mx-auto px-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "w-full max-w-lg mx-auto group block",
            "transition-all duration-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <GlassPanel 
            hover 
            className="py-4 px-6 flex items-center justify-center gap-3"
          >
            <span className="text-base md:text-lg font-display font-semibold text-foreground">
              How Uplyst Works
            </span>
            <span className="text-xs md:text-sm text-muted-foreground hidden sm:inline">
              (At a High Level)
            </span>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-primary transition-transform duration-300 ml-1",
                isExpanded && "rotate-180"
              )}
            />
          </GlassPanel>
        </button>

        <div
          className={cn(
            "overflow-hidden transition-all duration-500 ease-out",
            isExpanded ? "max-h-[800px] opacity-100 mt-8" : "max-h-0 opacity-0 mt-0"
          )}
        >
          <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-5">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={cn(
                  "transition-all duration-500 ease-out",
                  isExpanded 
                    ? "opacity-100 translate-y-0 scale-100" 
                    : "opacity-0 translate-y-4 scale-95"
                )}
                style={{ transitionDelay: isExpanded ? `${index * 75}ms` : "0ms" }}
              >
                <GlassPanel
                  className="flex items-start gap-4 p-6 h-full"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-display font-semibold text-foreground mb-1.5">
                      {step.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </GlassPanel>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
