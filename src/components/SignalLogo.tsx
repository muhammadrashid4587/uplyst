import { cn } from "@/lib/utils";
import signalLogoImg from "@/assets/signal-logo.png";

interface SignalLogoProps {
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

export const SignalLogo = ({ 
  className, 
  size = "md", 
  showWordmark = true 
}: SignalLogoProps) => {
  const { icon, text } = sizes[size];
  
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <img
        src={signalLogoImg}
        alt="Signal Logo"
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

export default SignalLogo;
