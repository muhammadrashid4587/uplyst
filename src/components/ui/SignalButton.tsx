import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface SignalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

const SignalButton = forwardRef<HTMLButtonElement, SignalButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-bold transition-all duration-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider font-display relative overflow-hidden group";
    
    const variants = {
      primary: "bg-primary text-primary-foreground shadow-glow hover:shadow-[0_0_30px_hsl(var(--primary)/0.6)] hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 active:shadow-glow",
      secondary: "bg-secondary/80 text-secondary-foreground border border-border/50 hover:bg-secondary hover:border-primary/40 hover:shadow-[0_0_20px_hsl(var(--primary)/0.2)] hover:-translate-y-0.5 backdrop-blur-sm active:translate-y-0",
      ghost: "text-muted-foreground hover:text-primary hover:bg-primary/10 hover:shadow-[0_0_15px_hsl(var(--primary)/0.15)]",
      outline: "border-2 border-primary/50 text-primary hover:bg-primary/10 hover:border-primary hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)] hover:-translate-y-0.5 active:translate-y-0",
    };

    const sizes = {
      sm: "px-5 py-2.5 text-xs",
      md: "px-7 py-3.5 text-sm",
      lg: "px-10 py-5 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {/* Animated glow effect on hover */}
        <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 animate-pulse" />
        </span>
        {/* Shine sweep effect for primary */}
        {variant === "primary" && (
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
        )}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
      </button>
    );
  }
);

SignalButton.displayName = "SignalButton";

export { SignalButton };
export default SignalButton;
