import { Link } from "react-router-dom";
import { ArrowRight, Search, Zap } from "lucide-react";
import { SignalButton } from "./ui/SignalButton";
import { SignalLogo } from "./SignalLogo";
import { mockTalent } from "@/data/mockTalent";
import { useParallax } from "@/hooks/useParallax";
import { useMouseGlow } from "@/hooks/useMouseGlow";

export const Hero3D = () => {
  const parallaxOffset = useParallax(0.3);
  const mousePosition = useMouseGlow();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

      {/* Cursor glow effect */}
      <div
        className="cursor-glow hidden lg:block"
        style={{
          left: mousePosition.x - 150,
          top: mousePosition.y - 150,
        }}
      />

      {/* Floating orbs with cyan color */}
      <div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full float-slow"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary) / 0.12) 0%, transparent 70%)",
          transform: `translateY(${-parallaxOffset * 0.8}px)`,
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full float-delayed"
        style={{
          background: "radial-gradient(circle, hsl(var(--accent) / 0.1) 0%, transparent 70%)",
          transform: `translateY(${-parallaxOffset * 0.5}px)`,
        }}
      />
      <div
        className="absolute top-1/2 right-1/3 w-[300px] h-[300px] rounded-full float"
        style={{
          background: "radial-gradient(circle, hsl(var(--signal-blue) / 0.15) 0%, transparent 70%)",
          transform: `translateY(${-parallaxOffset * 0.6}px)`,
        }}
      />

      {/* Accent lines - now cyan */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Main content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center perspective-1000">
          {/* Badge with pulse */}
          <div 
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/30 mb-10 animate-fade-up glow-border"
            style={{ animationDelay: "200ms" }}
          >
            <div className="relative">
              <Zap className="w-4 h-4 text-primary" />
              <div className="absolute inset-0 animate-ping">
                <Zap className="w-4 h-4 text-primary opacity-50" />
              </div>
            </div>
            <span className="text-sm text-primary font-semibold tracking-wide uppercase">
              For senior professionals who've earned their place
            </span>
          </div>

          {/* 3D Hero Headline */}
          <h1 
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black mb-8 leading-[0.95] tracking-tight preserve-3d animate-hero-text"
          >
            <span className="block text-3d text-foreground">
              Senior talent
            </span>
            <span className="block mt-2">
              <span className="text-3d text-foreground">shouldn't be </span>
              <span className="text-3d-primary text-primary animated-underline">invisible.</span>
            </span>
          </h1>

          {/* Subheadline */}
          <p 
            className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 animate-fade-up leading-relaxed"
            style={{ animationDelay: "400ms" }}
          >
            Signal highlights <span className="text-foreground font-medium">real experience</span> when resumes and algorithms fail.
            <br className="hidden md:block" />
            Get verified. Get seen. <span className="text-primary font-semibold">Get hired.</span>
          </p>

          {/* CTAs with glow */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-fade-up"
            style={{ animationDelay: "600ms" }}
          >
            <SignalButton variant="primary" size="lg" className="group min-w-[240px]">
              <span>Create Your Signal</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </SignalButton>
            <Link to="/talent">
              <SignalButton variant="outline" size="lg" className="min-w-[240px]">
                <Search className="w-5 h-5 mr-2" />
                Browse Senior Talent
              </SignalButton>
            </Link>
          </div>

          {/* Social proof */}
          <div 
            className="mt-20 flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-up"
            style={{ animationDelay: "800ms" }}
          >
            <div className="flex -space-x-4">
              {mockTalent.slice(0, 6).map((profile, i) => (
                <div
                  key={profile.id}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 border-2 border-background flex items-center justify-center text-sm font-bold text-primary hover:scale-110 hover:z-10 transition-all duration-300 cursor-pointer"
                  style={{ animationDelay: `${800 + i * 100}ms` }}
                >
                  {profile.name[0]}
                </div>
              ))}
            </div>
            <p className="text-muted-foreground">
              <span className="text-foreground font-bold text-lg">500+</span>
              <span className="ml-2">senior professionals already on Signal</span>
            </p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs text-muted-foreground uppercase tracking-widest">Scroll</span>
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1">
          <div className="w-1.5 h-2.5 bg-primary rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default Hero3D;
