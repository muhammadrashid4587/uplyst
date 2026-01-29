import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface SignalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

const SignalButton = forwardRef<HTMLButtonElement, SignalButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-bold transition-all duration-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider font-display relative overflow-hidden";
    
    const variants = {
      primary: "bg-primary text-primary-foreground shadow-glow hover:shadow-glow-hover hover:brightness-110 hover:-translate-y-0.5",
      secondary: "bg-secondary/80 text-secondary-foreground border border-border/50 hover:bg-secondary hover:border-primary/30 hover:-translate-y-0.5 backdrop-blur-sm",
      ghost: "text-muted-foreground hover:text-primary hover:bg-primary/5",
      outline: "border-2 border-primary/50 text-primary hover:bg-primary/10 hover:border-primary hover:-translate-y-0.5",
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
        {/* Shine effect for primary */}
        {variant === "primary" && (
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
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
