import { cn } from "@/lib/utils";
import GlassPanel from "./GlassPanel";

interface SignalMetricCardProps {
  value: string;
  label: string;
  className?: string;
  delay?: number;
}

export const SignalMetricCard = ({
  value,
  label,
  className,
  delay = 0,
}: SignalMetricCardProps) => {
  return (
    <GlassPanel
      variant="subtle"
      className={cn(
        "text-center p-6 animate-fade-up",
        className
      )}
      style={{ animationDelay: `${delay}ms` } as React.CSSProperties}
    >
      <div className="text-4xl md:text-5xl font-display font-bold text-primary mb-2">
        {value}
      </div>
      <div className="text-sm text-muted-foreground uppercase tracking-wider">
        {label}
      </div>
    </GlassPanel>
  );
};

export default SignalMetricCard;
