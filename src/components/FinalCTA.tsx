import { useScrollReveal } from "@/hooks/useScrollReveal";
import { GlassPanel } from "./ui/GlassPanel";
import { SignalButton } from "./ui/SignalButton";
import { SignalLogo } from "./SignalLogo";
import { cn } from "@/lib/utils";
import { ArrowRight, Sparkles } from "lucide-react";
import { useMouseGlow } from "@/hooks/useMouseGlow";

export const FinalCTA = () => {
  const { ref, isVisible } = useScrollReveal(0.2);
  const mousePosition = useMouseGlow();

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <GlassPanel
          variant="strong"
          className={cn(
            "relative overflow-hidden py-20 px-8 lg:px-16 text-center transition-all duration-1000",
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}
        >
          {/* Background effects */}
          <div className="absolute inset-0 grid-pattern-animated opacity-20" />
          
          {/* Floating orbs */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] float-slow"
            style={{
              background: "radial-gradient(ellipse, hsl(var(--primary) / 0.25) 0%, transparent 60%)",
            }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-[300px] h-[300px] float-delayed"
            style={{
              background: "radial-gradient(circle, hsl(var(--signal-maroon) / 0.2) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-0 left-1/4 w-[250px] h-[250px] float"
            style={{
              background: "radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)",
            }}
          />

          {/* Content */}
          <div className="relative z-10">
            {/* Logo with pulse */}
            <div 
              className={cn(
                "inline-flex mb-10 transition-all duration-700 delay-100",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
            >
              <div className="relative">
                <SignalLogo size="xl" showWordmark={false} className="animate-glow-pulse" />
                <div className="absolute inset-0 blur-2xl opacity-50">
                  <SignalLogo size="xl" showWordmark={false} />
                </div>
              </div>
            </div>

            <h2 
              className={cn(
                "text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-3d transition-all duration-700 delay-200",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
            >
              Ready to be{" "}
              <span className="text-primary text-glow animated-underline">seen?</span>
            </h2>
            
            <p 
              className={cn(
                "text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 transition-all duration-700 delay-300",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
            >
              Join hundreds of senior professionals who are already getting noticed on Signal. 
              Your experience deserves visibility.
            </p>

            <div 
              className={cn(
                "flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-400",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
            >
              <SignalButton variant="primary" size="lg" className="group min-w-[240px]">
                <Sparkles className="w-5 h-5 mr-2" />
                Create Your Signal
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </SignalButton>
            </div>
          </div>

          {/* Border glow effect */}
          <div className="absolute inset-0 rounded-lg pointer-events-none">
            <div className="absolute inset-0 rounded-lg border border-primary/20" />
            <div 
              className="absolute w-32 h-32 rounded-full blur-xl"
              style={{
                left: mousePosition.x - 64,
                top: mousePosition.y - 64,
                background: "radial-gradient(circle, hsl(var(--primary) / 0.3) 0%, transparent 70%)",
                pointerEvents: "none",
                position: "fixed",
              }}
            />
          </div>
        </GlassPanel>
      </div>
    </section>
  );
};

export default FinalCTA;
