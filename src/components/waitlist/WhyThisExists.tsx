import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export const WhyThisExists = () => {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <section className="py-12 relative" ref={ref}>
      <div className="container mx-auto px-4">
        <div
          className={cn(
            "max-w-2xl mx-auto text-center transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="relative inline-block">
            <div className="absolute -left-4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent" />
            <p className="text-lg md:text-xl text-muted-foreground italic leading-relaxed pl-4">
              "Uplyst exists because experienced professionals are being filtered out — 
              not because they lack value, but because systems fail to read depth."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyThisExists;
