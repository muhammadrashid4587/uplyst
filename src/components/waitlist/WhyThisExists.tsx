import { cn } from "@/lib/utils";
import { useClipReveal } from "@/hooks/useClipReveal";
import { Quote } from "lucide-react";
import { useSectionParallax } from "@/hooks/useSectionParallax";

export const WhyThisExists = () => {
  const { ref: clipRef, style: clipStyle } = useClipReveal({ direction: "up", duration: 1000 });
  const { ref: parallaxRef, style: parallaxStyle } = useSectionParallax({ speed: 0.1 });

  return (
    <section className="py-16 md:py-20 relative" ref={parallaxRef} style={parallaxStyle}>
      {/* Dual-tone gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/6 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tl from-accent/5 via-transparent to-primary/5 pointer-events-none" />
      
      {/* Subtle gradient dividers */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
      
      <div className="container mx-auto px-4">
        <div ref={clipRef} style={clipStyle} className="max-w-3xl mx-auto text-center">
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
