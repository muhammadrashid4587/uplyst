import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface FilterPillProps {
  label: string;
  active?: boolean;
  onToggle?: () => void;
  onRemove?: () => void;
  removable?: boolean;
  className?: string;
}

export const FilterPill = ({
  label,
  active = false,
  onToggle,
  onRemove,
  removable = false,
  className,
}: FilterPillProps) => {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full border transition-all duration-200",
        active
          ? "bg-primary/10 text-primary border-primary/40 shadow-glow"
          : "bg-secondary text-secondary-foreground border-border hover:border-primary/30 hover:text-primary",
        className
      )}
    >
      {label}
      {removable && active && (
        <X
          className="w-3.5 h-3.5 cursor-pointer hover:text-primary"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
        />
      )}
    </button>
  );
};

export default FilterPill;
