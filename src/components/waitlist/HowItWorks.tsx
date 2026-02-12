import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { useClipReveal } from "@/hooks/useClipReveal";
import { ChevronDown, FileSearch, Languages, Target, Shield } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { CelestialBackground } from "@/components/ui/CelestialBackground";

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

const playAccordionSound = async (isExpanding: boolean) => {
  try {
    const prompt = isExpanding 
      ? "subtle soft whoosh expand sound, gentle and smooth, 0.5 seconds"
      : "subtle soft collapse sound, light and quick, 0.3 seconds";
    
    const duration = isExpanding ? 0.5 : 0.3;

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-sfx`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ prompt, duration }),
      }
    );

    if (response.ok) {
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.volume = 0.3;
      await audio.play();
    }
  } catch (error) {
    console.debug("Sound effect generation skipped:", error);
  }
};

export const HowItWorks = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { ref: clipRef, style: clipStyle } = useClipReveal({ direction: "center", duration: 800 });

  const handleToggle = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    playAccordionSound(newState);
  };

  return (
    <section className="py-12 md:py-16 relative overflow-hidden">
      <CelestialBackground variant="ethereal" intensity="subtle" />
      <div className="container mx-auto px-4">
        <div ref={clipRef} style={clipStyle}>
          <button
            onClick={handleToggle}
            className="w-full max-w-lg mx-auto group block transition-all duration-500"
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
        </div>

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
                  className="flex items-start gap-4 p-6 h-full group hover-image-reveal"
                  hover
                >
                  <div className="flex-shrink-0 relative w-14 h-14">
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold border border-primary/30">
                      {step.number}
                    </div>
                    <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <step.icon className="w-6 h-6 text-primary" />
                    </div>
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
