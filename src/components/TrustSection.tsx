import { useScrollReveal } from "@/hooks/useScrollReveal";
import { GlassPanel } from "./ui/GlassPanel";
import { Badge } from "./ui/SignalBadge";
import { cn } from "@/lib/utils";
import { CheckCircle, Lock, Users, Eye, ShieldCheck } from "lucide-react";

const trustFeatures = [
  {
    icon: CheckCircle,
    title: "Resume Verification",
    description: "We cross-check employment history and credentials with trusted sources.",
  },
  {
    icon: Lock,
    title: "Identity Protection",
    description: "Your data is encrypted and only shared with verified employers.",
  },
  {
    icon: Users,
    title: "Reference Checks",
    description: "Optional reference verification adds another layer of credibility.",
  },
  {
    icon: Eye,
    title: "Invite-Only Access",
    description: "Employers are vetted before accessing the talent pool.",
  },
];

export const TrustSection = () => {
  const { ref, isVisible } = useScrollReveal(0.15);

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/40 to-background" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-20" ref={ref}>
          <Badge 
            variant="primary" 
            className={cn(
              "mb-6 transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <ShieldCheck className="w-3 h-3 mr-1" />
            Trust & Security
          </Badge>
          <h2 
            className={cn(
              "text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-3d transition-all duration-700 delay-100",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            Built on{" "}
            <span className="text-primary text-glow">credibility</span>
          </h2>
          <p 
            className={cn(
              "text-lg text-muted-foreground max-w-2xl mx-auto transition-all duration-700 delay-200",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            We take verification seriously. Your credentials are protected, and employers are vetted.
          </p>
        </div>

        {/* Trust cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustFeatures.map((feature, index) => (
            <GlassPanel
              key={feature.title}
              hover
              className={cn(
                "text-center card-3d transition-all duration-700",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              )}
              style={{ transitionDelay: `${300 + index * 100}ms` }}
            >
              <div className="relative w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
                <feature.icon className="w-8 h-8 text-primary" />
                {/* Glow behind icon */}
                <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </GlassPanel>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
