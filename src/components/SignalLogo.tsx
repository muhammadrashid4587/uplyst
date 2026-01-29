import { cn } from "@/lib/utils";

interface SignalLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showWordmark?: boolean;
}

const sizes = {
  sm: { icon: 24, text: "text-lg" },
  md: { icon: 32, text: "text-xl" },
  lg: { icon: 40, text: "text-2xl" },
  xl: { icon: 56, text: "text-3xl" },
};

export const SignalLogo = ({ 
  className, 
  size = "md", 
  showWordmark = true 
}: SignalLogoProps) => {
  const { icon, text } = sizes[size];
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Signal Icon - Stylized S from signal waves */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Outer signal arc */}
        <path
          d="M8 24C8 15.163 15.163 8 24 8"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="text-primary opacity-40"
        />
        {/* Middle signal arc */}
        <path
          d="M12 24C12 17.373 17.373 12 24 12"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="text-primary opacity-60"
        />
        {/* Inner signal arc */}
        <path
          d="M16 24C16 19.582 19.582 16 24 16"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="text-primary opacity-80"
        />
        {/* Center beacon dot */}
        <circle
          cx="24"
          cy="24"
          r="4"
          fill="currentColor"
          className="text-primary"
        />
        {/* Lower signal arcs forming S shape */}
        <path
          d="M40 24C40 32.837 32.837 40 24 40"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="text-primary opacity-40"
        />
        <path
          d="M36 24C36 30.627 30.627 36 24 36"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="text-primary opacity-60"
        />
        <path
          d="M32 24C32 28.418 28.418 32 24 32"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="text-primary opacity-80"
        />
      </svg>
      
      {showWordmark && (
        <span className={cn("font-display font-bold tracking-tight", text)}>
          Signal
        </span>
      )}
    </div>
  );
};

export default SignalLogo;
