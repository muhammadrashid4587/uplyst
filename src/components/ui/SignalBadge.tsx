import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "muted";
  size?: "sm" | "md";
  className?: string;
}

export const Badge = ({
  children,
  variant = "default",
  size = "sm",
  className,
}: BadgeProps) => {
  const variants = {
    default: "bg-secondary text-secondary-foreground border-border",
    primary: "bg-primary/10 text-primary border-primary/30",
    success: "bg-green-500/10 text-green-400 border-green-500/30",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    muted: "bg-muted text-muted-foreground border-border",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full border",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
