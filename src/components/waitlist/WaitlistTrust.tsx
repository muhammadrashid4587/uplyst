import { cn } from "@/lib/utils";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/SignalBadge";
import { useClipReveal } from "@/hooks/useClipReveal";
import { useSectionParallax } from "@/hooks/useSectionParallax";
import { Shield, Heart, Target, Zap, ShieldCheck } from "lucide-react";
import { CelestialBackground } from "@/components/ui/CelestialBackground";

const trustPoints = [
  {
    icon: Shield,
    title: "Built for Senior Talent",
    description: "Designed specifically for experienced professionals navigating layoffs and career pivots.",
  },
  {
    icon: Heart,
    title: "Truth-First Optimization",
    description: "We enhance your real achievements. No fabrication, no exaggeration — just clarity.",
  },
  {
    icon: Target,
    title: "ATS + Human Optimized",
    description: "Pass automated filters AND win the 6-second recruiter skim. Best of both worlds.",
  },
  {
    icon: Zap,
    title: "Speed to Impact",
    description: "Get interview-ready in hours, not weeks. Our AI accelerates your job search.",
  },
];

export const WaitlistTrust = () => {
  const { ref: titleRef, style: titleStyle } = useClipReveal({ direction: "up", duration: 800 });
  const { ref: parallaxRef, style: parallaxStyle } = useSectionParallax({ speed: 0.1, scale: true });

  return (
    <section className="py-24 relative overflow-hidden" id="trust" ref={parallaxRef} style={parallaxStyle}>
      <CelestialBackground variant="radiance" intensity="medium" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16" ref={titleRef} style={titleStyle}>
          <Badge variant="primary" className="mb-6">
            <ShieldCheck className="w-3 h-3 mr-1" />
            Our Promise
          </Badge>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Why <span className="text-primary text-glow">Uplyst</span>?
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            We're building the career tools we wish existed when we were job hunting.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPoints.map((point, index) => (
            <TrustCard key={point.title} point={point} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const TrustCard = ({ point, index }: { point: typeof trustPoints[0]; index: number }) => {
  const { ref, style } = useClipReveal({
    direction: "up",
    delay: 200 + index * 100,
    duration: 800,
  });

  return (
    <div ref={ref} style={style}>
      <GlassPanel hover className="text-center group h-full hover-image-reveal">
        <div className="relative w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
          <point.icon className="w-7 h-7 text-primary" />
          <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <h3 className="text-lg font-display font-bold mb-2">{point.title}</h3>
        <p className="text-sm text-muted-foreground">{point.description}</p>
        
        {/* Hover reveal line */}
        <div className="w-0 h-0.5 bg-gradient-to-r from-primary/50 to-accent/50 mx-auto mt-4 group-hover:w-12 transition-all duration-500" />
      </GlassPanel>
    </div>
  );
};

export default WaitlistTrust;
