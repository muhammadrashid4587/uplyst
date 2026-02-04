import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { SignalButton } from "@/components/ui/SignalButton";
import { Badge } from "@/components/ui/SignalBadge";
import { HologramU } from "@/components/HologramU";
import { Starfield } from "@/components/Starfield";
import { useParallax } from "@/hooks/useParallax";
import { useWaitlist } from "@/hooks/useWaitlist";
import { ArrowDown, Sparkles, Users } from "lucide-react";

export const WaitlistHero = () => {
  const parallaxOffset = useParallax(0.3);
  const { getTotalSignups } = useWaitlist();
  const [signupCount, setSignupCount] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    getTotalSignups().then(setSignupCount);
  }, []);

  // Animated counter
  useEffect(() => {
    if (signupCount === 0) return;
    
    const duration = 2000;
    const steps = 60;
    const increment = signupCount / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= signupCount) {
        setDisplayCount(signupCount);
        clearInterval(timer);
      } else {
        setDisplayCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [signupCount]);

  const scrollToWaitlist = () => {
    const el = document.getElementById("waitlist");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Starfield background */}
      <Starfield starCount={150} className="opacity-40" />
      
      {/* Parallax background layer */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ transform: `translateY(${parallaxOffset}px)` }}
      >
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          {/* Left: Content */}
          <div className="flex-1 text-center lg:text-left relative z-30">
            <Badge 
              variant="primary" 
              className="mb-6 animate-fade-in inline-flex"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Early Access Opening Soon
            </Badge>

            <h1 
              className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 text-3d animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              Land Your Next
              <br />
              <span className="text-primary text-glow">Senior Role</span>
            </h1>

            <p 
              className="text-lg md:text-xl text-muted-foreground max-w-xl mb-8 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              AI-powered tools built for experienced professionals navigating career transitions. 
              Truth-first optimization. No fabrication.
            </p>

            <div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <SignalButton 
                variant="primary" 
                size="lg"
                onClick={scrollToWaitlist}
                className="font-display uppercase tracking-wider"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Join the Waitlist
              </SignalButton>
              <SignalButton 
                variant="ghost" 
                size="lg"
                onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
                className="font-display uppercase tracking-wider"
              >
                See What's Coming
                <ArrowDown className="w-4 h-4 ml-2" />
              </SignalButton>
            </div>

            {/* Social proof */}
            {signupCount > 0 && (
              <div 
                className="mt-8 flex items-center gap-3 justify-center lg:justify-start animate-fade-in"
                style={{ animationDelay: "0.4s" }}
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border-2 border-background flex items-center justify-center"
                    >
                      <Users className="w-3 h-3 text-primary/70" />
                    </div>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  <span className="text-primary font-bold">{displayCount}+</span> professionals on the waitlist
                </span>
              </div>
            )}
          </div>

          {/* Right: 3D Logo */}
          <div 
            className="flex-1 flex justify-center lg:justify-end animate-fade-in relative z-10"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="w-full max-w-sm lg:max-w-md aspect-square">
              <HologramU />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowDown className="w-6 h-6 text-muted-foreground" />
      </div>
    </section>
  );
};

export default WaitlistHero;
