import { cn } from "@/lib/utils";

type CelestialVariant = "radiance" | "divine" | "aurora" | "convergence" | "ethereal";

interface CelestialBackgroundProps {
  variant?: CelestialVariant;
  className?: string;
  intensity?: "subtle" | "medium" | "strong";
}

export const CelestialBackground = ({
  variant = "radiance",
  className = "",
  intensity = "medium",
}: CelestialBackgroundProps) => {
  const opacityMap = {
    subtle: { primary: 0.04, secondary: 0.03, glow: 0.06 },
    medium: { primary: 0.08, secondary: 0.05, glow: 0.12 },
    strong: { primary: 0.12, secondary: 0.08, glow: 0.18 },
  };
  const o = opacityMap[intensity];

  const breathe = "celestial-breathe";

  return (
    <div className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)}>
      <style>{`
        @keyframes celestial-breathe {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.04); }
        }
        .${breathe} {
          animation: celestial-breathe 6s ease-in-out infinite;
        }
        .${breathe}-slow {
          animation: celestial-breathe 8s ease-in-out infinite;
        }
        .${breathe}-fast {
          animation: celestial-breathe 4.5s ease-in-out infinite;
        }
      `}</style>

      {variant === "radiance" && (
        <>
          <div
            className={`absolute left-1/2 -translate-x-1/2 -top-20 w-[600px] h-[800px] ${breathe}`}
            style={{
              background: `radial-gradient(ellipse at center top, hsl(var(--primary) / ${o.glow}) 0%, hsl(var(--primary) / ${o.primary}) 30%, transparent 70%)`,
            }}
          />
          <div
            className={`absolute -left-20 top-0 w-[400px] h-full ${breathe}-slow`}
            style={{
              background: `linear-gradient(135deg, hsl(var(--primary) / ${o.secondary}) 0%, transparent 60%)`,
            }}
          />
          <div
            className={`absolute -right-20 top-0 w-[400px] h-full ${breathe}-slow`}
            style={{
              background: `linear-gradient(225deg, hsl(var(--accent) / ${o.secondary}) 0%, transparent 60%)`,
              animationDelay: "3s",
            }}
          />
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent" />
        </>
      )}

      {variant === "divine" && (
        <>
          <div
            className={`absolute left-1/2 -translate-x-1/2 -top-40 w-[900px] h-[600px] ${breathe}`}
            style={{
              background: `conic-gradient(from 180deg at 50% 0%, transparent 30%, hsl(var(--primary) / ${o.glow}) 40%, transparent 50%, hsl(var(--primary) / ${o.primary}) 60%, transparent 70%)`,
            }}
          />
          <div
            className={`absolute inset-0 ${breathe}-slow`}
            style={{
              background: `radial-gradient(ellipse 120% 80% at 50% -10%, hsl(var(--primary) / ${o.primary}) 0%, transparent 70%)`,
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-full h-1/2"
            style={{
              background: `linear-gradient(to top, hsl(var(--background)) 0%, transparent 100%)`,
            }}
          />
        </>
      )}

      {variant === "aurora" && (
        <>
          <div
            className={`absolute inset-0 ${breathe}-slow`}
            style={{
              background: `
                linear-gradient(170deg, hsl(var(--primary) / ${o.secondary}) 0%, transparent 30%),
                linear-gradient(190deg, transparent 60%, hsl(var(--accent) / ${o.secondary}) 100%)
              `,
            }}
          />
          <div
            className={`absolute left-[20%] top-0 w-px h-full ${breathe}-fast`}
            style={{
              background: `linear-gradient(to bottom, transparent 10%, hsl(var(--primary) / ${o.glow * 0.5}) 40%, transparent 80%)`,
            }}
          />
          <div
            className={`absolute left-[50%] top-0 w-px h-full ${breathe}`}
            style={{
              background: `linear-gradient(to bottom, transparent 20%, hsl(var(--primary) / ${o.glow * 0.7}) 50%, transparent 90%)`,
              animationDelay: "2s",
            }}
          />
          <div
            className={`absolute left-[80%] top-0 w-px h-full ${breathe}-fast`}
            style={{
              background: `linear-gradient(to bottom, transparent 5%, hsl(var(--accent) / ${o.glow * 0.4}) 35%, transparent 75%)`,
              animationDelay: "1s",
            }}
          />
          <div
            className={`absolute inset-0 ${breathe}-slow`}
            style={{
              background: `radial-gradient(ellipse at 50% 50%, hsl(var(--primary) / ${o.secondary}) 0%, transparent 60%)`,
              animationDelay: "3s",
            }}
          />
        </>
      )}

      {variant === "convergence" && (
        <>
          <div
            className={`absolute -top-10 -left-10 w-[500px] h-[500px] ${breathe}`}
            style={{
              background: `radial-gradient(circle at 0% 0%, hsl(var(--primary) / ${o.primary}) 0%, transparent 60%)`,
            }}
          />
          <div
            className={`absolute -top-10 -right-10 w-[500px] h-[500px] ${breathe}`}
            style={{
              background: `radial-gradient(circle at 100% 0%, hsl(var(--accent) / ${o.primary}) 0%, transparent 60%)`,
              animationDelay: "3s",
            }}
          />
          <div
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] ${breathe}-fast`}
            style={{
              background: `radial-gradient(circle, hsl(var(--primary) / ${o.glow}) 0%, transparent 60%)`,
            }}
          />
          <div
            className={`absolute bottom-0 left-0 w-full h-1/3 ${breathe}-slow`}
            style={{
              background: `linear-gradient(to top, hsl(var(--primary) / ${o.secondary}) 0%, transparent 100%)`,
            }}
          />
        </>
      )}

      {variant === "ethereal" && (
        <>
          <div
            className={`absolute inset-0 ${breathe}-slow`}
            style={{
              background: `
                radial-gradient(ellipse 100% 60% at 30% 20%, hsl(var(--primary) / ${o.primary}) 0%, transparent 50%),
                radial-gradient(ellipse 80% 50% at 70% 80%, hsl(var(--accent) / ${o.secondary}) 0%, transparent 50%)
              `,
            }}
          />
          <div
            className={`absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] ${breathe}`}
            style={{
              background: `radial-gradient(ellipse, hsl(var(--primary) / ${o.glow * 0.6}) 0%, transparent 70%)`,
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-full h-px"
            style={{
              background: `linear-gradient(to right, transparent 10%, hsl(var(--primary) / 0.3) 50%, transparent 90%)`,
            }}
          />
        </>
      )}

      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />
    </div>
  );
};

export default CelestialBackground;
