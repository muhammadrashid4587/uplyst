import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { SignalButton } from "./SignalButton";
import { GlassPanel } from "./GlassPanel";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "outline";
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <GlassPanel className={cn("text-center py-16 px-8", className)}>
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-xl font-display font-semibold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        {description}
      </p>
      <div className="flex items-center justify-center gap-3">
        {action && (
          <SignalButton
            variant={action.variant || "primary"}
            onClick={action.onClick}
          >
            {action.label}
          </SignalButton>
        )}
        {secondaryAction && (
          <SignalButton variant="outline" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </SignalButton>
        )}
      </div>
    </GlassPanel>
  );
}

export default EmptyState;
