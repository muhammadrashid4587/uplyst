import { useState } from "react";
import { cn } from "@/lib/utils";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/SignalBadge";
import { SignalButton } from "@/components/ui/SignalButton";
import { useClipReveal } from "@/hooks/useClipReveal";
import { useSectionParallax } from "@/hooks/useSectionParallax";
import { 
  FileSearch, 
  Zap, 
  Send, 
  Lock, 
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const products = [
  {
    icon: FileSearch,
    title: "ATS Optimizer",
    description: "AI-powered resume optimization that passes ATS filters while maintaining authenticity.",
    demo: "ats",
    features: ["Keyword optimization", "Format compliance", "Score prediction"],
  },
  {
    icon: Zap,
    title: "Recruiter Skim Pack",
    description: "Get your resume to the top of the pile with recruiter-optimized formatting.",
    demo: "skim",
    features: ["6-second scan ready", "Impact highlights", "Visual hierarchy"],
  },
  {
    icon: Send,
    title: "Outreach Pack Generator",
    description: "Personalized cold outreach templates that actually get responses.",
    demo: "outreach",
    features: ["LinkedIn messages", "Email sequences", "Follow-up cadence"],
  },
];

const SkeletonDemo = ({ type }: { type: string }) => {
  if (type === "ats") {
    return (
      <div className="space-y-3 p-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-24 bg-primary/30 rounded animate-pulse" />
          <div className="h-4 w-12 bg-primary/50 rounded-full text-[10px] flex items-center justify-center text-primary">
            92%
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-2 w-full bg-muted/50 rounded animate-pulse" style={{ animationDelay: "0.1s" }} />
          <div className="h-2 w-3/4 bg-muted/50 rounded animate-pulse" style={{ animationDelay: "0.2s" }} />
          <div className="h-2 w-5/6 bg-muted/50 rounded animate-pulse" style={{ animationDelay: "0.3s" }} />
        </div>
        <div className="flex gap-1 mt-3">
          {["React", "TypeScript", "AWS"].map((tag, i) => (
            <span 
              key={tag}
              className="text-[8px] px-1.5 py-0.5 bg-primary/20 text-primary rounded animate-pulse"
              style={{ animationDelay: `${0.4 + i * 0.1}s` }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (type === "skim") {
    return (
      <div className="p-4 font-mono text-[10px] text-muted-foreground">
        <div className="text-primary mb-2">▸ Analyzing resume structure...</div>
        <div className="animate-pulse" style={{ animationDelay: "0.2s" }}>
          ✓ Header optimized
        </div>
        <div className="animate-pulse" style={{ animationDelay: "0.4s" }}>
          ✓ Impact metrics highlighted
        </div>
        <div className="animate-pulse" style={{ animationDelay: "0.6s" }}>
          ✓ Visual hierarchy: A+
        </div>
        <div className="text-primary mt-2 animate-pulse" style={{ animationDelay: "0.8s" }}>
          ▸ Ready for recruiter skim
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-2">
      <div className="flex gap-2 items-center">
        <div className="w-6 h-6 rounded-full bg-primary/20 animate-pulse" />
        <div className="h-2 w-20 bg-muted/50 rounded animate-pulse" />
      </div>
      <div className="ml-8 space-y-1.5">
        <div className="h-1.5 w-full bg-muted/30 rounded animate-pulse" style={{ animationDelay: "0.1s" }} />
        <div className="h-1.5 w-4/5 bg-muted/30 rounded animate-pulse" style={{ animationDelay: "0.2s" }} />
        <div className="h-1.5 w-3/5 bg-muted/30 rounded animate-pulse" style={{ animationDelay: "0.3s" }} />
      </div>
    </div>
  );
};

export const ProductPreview = () => {
  const { ref: titleRef, style: titleStyle } = useClipReveal({ direction: "up", duration: 800 });
  const { ref: parallaxRef, style: parallaxStyle } = useSectionParallax({ speed: 0.08 });
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCTAClick = () => {
    setDialogOpen(true);
  };

  const scrollToWaitlist = () => {
    setDialogOpen(false);
    const el = document.getElementById("waitlist");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-24 relative overflow-hidden" ref={parallaxRef} style={parallaxStyle}>
      {/* Dual-tone gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-card/20 to-accent/6 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tl from-accent/5 via-transparent to-primary/5 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16" ref={titleRef} style={titleStyle}>
          <Badge variant="primary" className="mb-6">
            <Sparkles className="w-3 h-3 mr-1" />
            Product Preview
          </Badge>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Tools Built for <span className="text-primary text-glow">Senior Talent</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Truth-first optimization. No fabrication. Designed to pass ATS and win the recruiter skim.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <ProductCard
              key={product.title}
              product={product}
              index={index}
              onCTAClick={handleCTAClick}
            />
          ))}
        </div>
      </div>

      {/* Waitlist Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass-panel-strong border-primary/20">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-display">
              <Lock className="w-5 h-5 text-primary" />
              Early Access Required
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              This feature is currently in development. Join our waitlist to be among the first to access it.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4">
            <SignalButton variant="primary" onClick={scrollToWaitlist}>
              <Sparkles className="w-4 h-4 mr-2" />
              Join the Waitlist
            </SignalButton>
            <SignalButton variant="ghost" onClick={() => setDialogOpen(false)}>
              Maybe Later
            </SignalButton>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

const ProductCard = ({
  product,
  index,
  onCTAClick,
}: {
  product: typeof products[0];
  index: number;
  onCTAClick: () => void;
}) => {
  const { ref, style } = useClipReveal({
    direction: index === 0 ? "left" : index === 2 ? "right" : "up",
    delay: index * 120,
    duration: 900,
  });

  return (
    <div ref={ref} style={style}>
      <GlassPanel
        hover
        className="relative overflow-hidden group h-full hover-image-reveal"
      >
        {/* Coming Soon Badge */}
        <div className="absolute top-4 right-4 z-10">
          <Badge variant="muted" className="bg-muted/80 backdrop-blur-sm">
            <Lock className="w-3 h-3 mr-1" />
            Coming Soon
          </Badge>
        </div>

        {/* Hover reveal overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Icon */}
        <div className="relative w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
          <product.icon className="w-7 h-7 text-primary" />
          <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Content */}
        <h3 className="text-xl font-display font-bold mb-2">{product.title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{product.description}</p>

        {/* Features */}
        <ul className="space-y-1 mb-6">
          {product.features.map((feature) => (
            <li key={feature} className="text-xs text-muted-foreground flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-primary" />
              {feature}
            </li>
          ))}
        </ul>

        {/* Demo Preview */}
        <div className="rounded-lg bg-card/50 border border-border/50 overflow-hidden mb-6 h-28">
          <SkeletonDemo type={product.demo} />
        </div>

        {/* CTA */}
        <SignalButton 
          variant="ghost" 
          size="sm" 
          className="w-full"
          onClick={onCTAClick}
        >
          Get Early Access
        </SignalButton>
      </GlassPanel>
    </div>
  );
};

export default ProductPreview;
