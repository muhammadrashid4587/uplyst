import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import { ApplicationStatus, AvailabilityStatus } from "@/types";
import { 
  Clock, CheckCircle2, XCircle, MessageSquare, 
  FileText, Star, Briefcase, AlertCircle 
} from "lucide-react";

interface StatusBadgeProps {
  status: ApplicationStatus | AvailabilityStatus | string;
  type?: "application" | "availability";
  className?: string;
}

const applicationStatusConfig: Record<ApplicationStatus, { label: string; className: string; icon: React.ElementType }> = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground", icon: FileText },
  pending: { label: "Submitted", className: "bg-primary/20 text-primary", icon: Clock },
  reviewed: { label: "Reviewed", className: "bg-accent/20 text-accent-foreground", icon: CheckCircle2 },
  interview: { label: "Interview", className: "bg-signal-cyan/20 text-signal-cyan", icon: MessageSquare },
  offer: { label: "Offer", className: "bg-green-500/20 text-green-400", icon: Star },
  rejected: { label: "Rejected", className: "bg-destructive/20 text-destructive", icon: XCircle },
  withdrawn: { label: "Withdrawn", className: "bg-muted text-muted-foreground", icon: AlertCircle },
};

const availabilityStatusConfig: Record<AvailabilityStatus, { label: string; className: string; icon: React.ElementType }> = {
  laid_off: { label: "Recently Laid Off", className: "bg-primary/20 text-primary", icon: Briefcase },
  exploring: { label: "Exploring Opportunities", className: "bg-accent/20 text-accent-foreground", icon: Clock },
  employed_looking: { label: "Employed, Looking", className: "bg-signal-cyan/20 text-signal-cyan", icon: Star },
  not_looking: { label: "Not Looking", className: "bg-muted text-muted-foreground", icon: XCircle },
};

export function StatusBadge({ status, type = "application", className }: StatusBadgeProps) {
  const config = type === "application" 
    ? applicationStatusConfig[status as ApplicationStatus]
    : availabilityStatusConfig[status as AvailabilityStatus];

  if (!config) {
    return (
      <Badge variant="secondary" className={className}>
        {status}
      </Badge>
    );
  }

  const Icon = config.icon;

  return (
    <Badge 
      variant="secondary" 
      className={cn(
        "flex items-center gap-1.5 font-medium",
        config.className,
        className
      )}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
}

export default StatusBadge;
