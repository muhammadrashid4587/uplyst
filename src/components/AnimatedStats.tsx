import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCountUp } from "@/hooks/useCountUp";
import { GlassPanel } from "./ui/GlassPanel";
import { cn } from "@/lib/utils";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

const stats: StatItem[] = [
  { value: 92, suffix: "%", label: "Verified Experience" },
  { value: 18, suffix: "+", label: "Avg Years in Industry" },
  { value: 85, suffix: "%", label: "Leadership Roles" },
  { value: 3, suffix: "x", label: "Faster Time-to-Interview" },
];

const StatCard = ({ stat, index, isVisible }: { stat: StatItem; index: number; isVisible: boolean }) => {
  const count = useCountUp(stat.value, 2000, 0, isVisible);

  return (
    <div
      className={cn(
        "text-center transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <GlassPanel
        variant="subtle"
        hover
        className="p-8 card-3d h-full"
      >
        <div className="relative">
          {/* Glow behind number */}
          <div className="absolute inset-0 flex items-center justify-center blur-2xl opacity-50">
            <span className="text-6xl font-display font-black text-primary">
              {count}{stat.suffix}
            </span>
          </div>
          
          <div className="relative text-5xl md:text-6xl font-display font-black text-primary mb-4 counter-value">
            {count}
            <span className="text-primary">{stat.suffix}</span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground uppercase tracking-[0.2em] font-medium">
          {stat.label}
        </div>
      </GlassPanel>
    </div>
  );
};

export const AnimatedStats = () => {
  const { ref, isVisible } = useScrollReveal(0.2);

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              stat={stat}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnimatedStats;
