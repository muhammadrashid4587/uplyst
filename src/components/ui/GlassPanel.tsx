import { cn } from "@/lib/utils";
import { ReactNode, CSSProperties, MouseEventHandler } from "react";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "strong" | "subtle";
  hover?: boolean;
  style?: CSSProperties;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export const GlassPanel = ({
  children,
  className,
  variant = "default",
  hover = false,
  style,
  onClick,
}: GlassPanelProps) => {
  const variants = {
    default: "glass-panel",
    strong: "glass-panel-strong",
    subtle: "bg-card/50 backdrop-blur-lg border border-border/30",
  };

  return (
    <div
      className={cn(
        variants[variant],
        "rounded-lg p-6",
        hover && "hover-lift card-highlight transition-all duration-300",
        onClick && "cursor-pointer",
        className
      )}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default GlassPanel;
