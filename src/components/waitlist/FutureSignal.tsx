import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Layers } from "lucide-react";

export const FutureSignal = () => {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <section className="py-8 relative" ref={ref}>
      <div className="container mx-auto px-4">
        <div
          className={cn(
            "max-w-md mx-auto text-center transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground/60 hover:text-muted-foreground transition-colors duration-300">
            <Layers className="w-3.5 h-3.5" />
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
