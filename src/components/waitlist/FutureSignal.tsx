import { cn } from "@/lib/utils";
import { useClipReveal } from "@/hooks/useClipReveal";
import { Layers } from "lucide-react";
import { CelestialBackground } from "@/components/ui/CelestialBackground";

export const FutureSignal = () => {
  const { ref, style } = useClipReveal({ direction: "center", duration: 1000 });

  return (
    <section className="py-12 md:py-16 relative overflow-hidden">
      <CelestialBackground variant="convergence" intensity="subtle" />
      <div className="container mx-auto px-4">
        <div ref={ref} style={style} className="max-w-xl mx-auto text-center">
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
