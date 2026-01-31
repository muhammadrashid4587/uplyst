import { cn } from "@/lib/utils";
import uplystLogoImg from "@/assets/uplyst-logo.png";

interface UplystLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showWordmark?: boolean;
}

const sizes = {
  sm: { icon: 28, text: "text-lg" },
  md: { icon: 36, text: "text-xl" },
  lg: { icon: 48, text: "text-2xl" },
  xl: { icon: 64, text: "text-3xl" },
};

export const UplystLogo = ({ 
  className, 
  size = "md", 
  showWordmark = true 
}: UplystLogoProps) => {
  const { icon, text } = sizes[size];
  
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <img
        src={uplystLogoImg}
        alt="Uplyst Logo"
        width={icon}
        height={icon}
        className="flex-shrink-0 object-contain"
      />
      
      {showWordmark && (
        <span className={cn("font-display font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent", text)}>
          Uplyst
        </span>
      )}
    </div>
  );
};

export default UplystLogo;
