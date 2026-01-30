import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";
import { GlassPanel } from "./GlassPanel";

interface SkeletonCardProps {
  variant?: "profile" | "job" | "message" | "application";
  className?: string;
}

export function SkeletonCard({ variant = "profile", className }: SkeletonCardProps) {
  if (variant === "profile") {
    return (
      <GlassPanel className={cn("p-6", className)}>
        <div className="flex items-start gap-4">
          <Skeleton className="w-16 h-16 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
      </GlassPanel>
    );
  }

  if (variant === "job") {
    return (
      <GlassPanel className={cn("p-6", className)}>
        <div className="space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </GlassPanel>
    );
  }

  if (variant === "message") {
    return (
      <GlassPanel className={cn("p-4", className)}>
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-3 w-12" />
        </div>
      </GlassPanel>
    );
  }

  if (variant === "application") {
    return (
      <GlassPanel className={cn("p-6", className)}>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full mt-4" />
        <Skeleton className="h-4 w-3/4 mt-2" />
      </GlassPanel>
    );
  }

  return null;
}

export default SkeletonCard;
