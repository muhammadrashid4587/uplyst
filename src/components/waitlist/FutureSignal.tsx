import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Layers } from "lucide-react";

export const FutureSignal = () => {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <section className="py-12 md:py-16 relative" ref={ref}>
      <div className="container mx-auto px-4">
        <div
          className={cn(
            "max-w-xl mx-auto text-center transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <div className="inline-flex items-center gap-3 text-sm text-muted-foreground/70 hover:text-muted-foreground transition-colors duration-300 px-4 py-2 rounded-full border border-border/20 bg-card/20 backdrop-blur-sm">
            <Layers className="w-4 h-4 text-primary/50" />
            <span className="italic">
              Your resume is the first layer. Uplyst is being built to go further.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FutureSignal;
