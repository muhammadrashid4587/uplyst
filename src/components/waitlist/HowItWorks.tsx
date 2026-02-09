import { useState } from "react";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ChevronDown, FileSearch, Languages, Target, Shield } from "lucide-react";

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
    <section className="py-16 relative" ref={ref}>
      <div className="container mx-auto px-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "w-full max-w-2xl mx-auto group",
            "transition-all duration-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="flex items-center justify-center gap-3 py-4 px-6 rounded-xl border border-border/30 bg-card/30 backdrop-blur-sm hover:border-primary/30 hover:bg-card/50 transition-all duration-300">
            <span className="text-lg font-display font-semibold text-foreground">
              How Uplyst Works
            </span>
            <span className="text-sm text-muted-foreground">(At a High Level)</span>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-muted-foreground transition-transform duration-300",
                isExpanded && "rotate-180"
              )}
            />
          </div>
        </button>

        <div
          className={cn(
            "overflow-hidden transition-all duration-500 ease-out",
            isExpanded ? "max-h-[600px] opacity-100 mt-8" : "max-h-0 opacity-0 mt-0"
          )}
        >
          <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-4">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={cn(
                  "flex items-start gap-4 p-5 rounded-xl border border-border/30 bg-card/20 backdrop-blur-sm",
                  "transition-all duration-300 delay-100",
                  isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: isExpanded ? `${index * 75}ms` : "0ms" }}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">
                    {step.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
