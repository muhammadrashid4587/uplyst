import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Quote } from "lucide-react";

export const WhyThisExists = () => {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <section className="py-16 md:py-20 relative" ref={ref}>
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/3 pointer-events-none" />
      
      {/* Subtle gradient dividers */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
      
      <div className="container mx-auto px-4">
        <div
          className={cn(
            "max-w-3xl mx-auto text-center transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <Quote className="w-8 h-8 text-primary/40 mx-auto mb-6 rotate-180" />
          <p className="text-xl md:text-2xl lg:text-3xl text-foreground/90 font-display leading-relaxed mb-6">
            Uplyst exists because experienced professionals are being filtered out — 
            <span className="text-primary"> not because they lack value</span>, 
            but because systems fail to read depth.
          </p>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto" />
        </div>
      </div>
    </section>
  );
};

export default WhyThisExists;
