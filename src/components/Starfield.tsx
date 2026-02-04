import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  opacity: number;
  speed: number;
}

interface StarfieldProps {
  starCount?: number;
  className?: string;
}

export const Starfield = ({ starCount = 200, className = "" }: StarfieldProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize stars
    const initStars = () => {
      const rect = canvas.getBoundingClientRect();
      starsRef.current = Array.from({ length: starCount }, () => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        z: Math.random() * 3 + 1, // Depth layer (1-4)
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        speed: Math.random() * 0.3 + 0.1,
      }));
    };

    initStars();

    // Track mouse for parallax
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left - rect.width / 2) / rect.width,
        y: (e.clientY - rect.top - rect.height / 2) / rect.height,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    let lastTime = 0;
    const animate = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Draw and update stars
      starsRef.current.forEach((star) => {
        // Parallax offset based on mouse and depth
        const parallaxX = mouseRef.current.x * star.z * 20;
        const parallaxY = mouseRef.current.y * star.z * 20;

        // Twinkle effect
        const twinkle = Math.sin(time * 0.002 * star.speed + star.x) * 0.3 + 0.7;

        // Draw star
        const drawX = star.x + parallaxX;
        const drawY = star.y + parallaxY;

        // Glow effect for larger stars
        if (star.size > 1.5) {
          const gradient = ctx.createRadialGradient(
            drawX, drawY, 0,
            drawX, drawY, star.size * 3
          );
          gradient.addColorStop(0, `hsla(190, 90%, 70%, ${star.opacity * twinkle * 0.5})`);
          gradient.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(drawX, drawY, star.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Core star
        ctx.beginPath();
        ctx.arc(drawX, drawY, star.size * (star.z / 4), 0, Math.PI * 2);
        ctx.fillStyle = `hsla(190, 80%, 80%, ${star.opacity * twinkle})`;
        ctx.fill();

        // Slowly drift stars upward
        star.y -= star.speed * (deltaTime / 16);
        
        // Wrap around
        if (star.y < -10) {
          star.y = rect.height + 10;
          star.x = Math.random() * rect.width;
        }
      });

      // Draw occasional shooting stars
      if (Math.random() < 0.001) {
        const shootingX = Math.random() * rect.width;
        const shootingY = Math.random() * rect.height * 0.5;
        
        const gradient = ctx.createLinearGradient(
          shootingX, shootingY,
          shootingX + 100, shootingY + 50
        );
        gradient.addColorStop(0, "hsla(190, 90%, 80%, 0.8)");
        gradient.addColorStop(1, "transparent");
        
        ctx.beginPath();
        ctx.moveTo(shootingX, shootingY);
        ctx.lineTo(shootingX + 100, shootingY + 50);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [starCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default Starfield;
