import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  opacity: number;
  speed: number;
}

interface ShootingStar {
  x: number;
  y: number;
  angle: number;
  speed: number;
  length: number;
  opacity: number;
  life: number;
  maxLife: number;
  trail: { x: number; y: number; opacity: number }[];
}

interface StarfieldProps {
  starCount?: number;
  className?: string;
}

export const Starfield = ({ starCount = 200, className = "" }: StarfieldProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
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

    // Create a new shooting star
    const createShootingStar = (rect: DOMRect): ShootingStar => {
      const startX = Math.random() * rect.width * 0.8;
      const startY = Math.random() * rect.height * 0.4;
      const angle = Math.PI * 0.15 + Math.random() * 0.2; // Diagonal angle (roughly 30-45 degrees)
      
      return {
        x: startX,
        y: startY,
        angle,
        speed: 8 + Math.random() * 6, // Faster speed
        length: 80 + Math.random() * 120, // Longer trails
        opacity: 0.9 + Math.random() * 0.1,
        life: 0,
        maxLife: 60 + Math.random() * 40, // Frames to live
        trail: [],
      };
    };

    // Animation loop
    let lastTime = 0;
    let shootingStarTimer = 0;
    
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

      // Spawn shooting stars more frequently
      shootingStarTimer += deltaTime;
      if (shootingStarTimer > 800 + Math.random() * 1200) { // Every 0.8-2 seconds
        shootingStarsRef.current.push(createShootingStar(rect));
        shootingStarTimer = 0;
      }

      // Update and draw shooting stars
      shootingStarsRef.current = shootingStarsRef.current.filter((star) => {
        star.life++;
        
        // Move the shooting star
        const moveX = Math.cos(star.angle) * star.speed;
        const moveY = Math.sin(star.angle) * star.speed;
        star.x += moveX;
        star.y += moveY;

        // Add current position to trail
        star.trail.unshift({ 
          x: star.x, 
          y: star.y, 
          opacity: star.opacity 
        });

        // Limit trail length
        const maxTrailLength = Math.floor(star.length / 3);
        if (star.trail.length > maxTrailLength) {
          star.trail.pop();
        }

        // Fade out near end of life
        const lifeRatio = star.life / star.maxLife;
        const fadeOpacity = lifeRatio > 0.7 ? (1 - (lifeRatio - 0.7) / 0.3) : 1;

        // Draw the trail with gradient
        if (star.trail.length > 1) {
          for (let i = 0; i < star.trail.length - 1; i++) {
            const t1 = star.trail[i];
            const t2 = star.trail[i + 1];
            const trailOpacity = (1 - i / star.trail.length) * fadeOpacity * star.opacity;
            const trailWidth = (1 - i / star.trail.length) * 3 + 0.5;

            // Draw trail segment
            ctx.beginPath();
            ctx.moveTo(t1.x, t1.y);
            ctx.lineTo(t2.x, t2.y);
            ctx.strokeStyle = `hsla(190, 95%, 75%, ${trailOpacity})`;
            ctx.lineWidth = trailWidth;
            ctx.lineCap = "round";
            ctx.stroke();
          }
        }

        // Draw bright head of shooting star
        const headGradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, 8
        );
        headGradient.addColorStop(0, `hsla(190, 100%, 95%, ${fadeOpacity * star.opacity})`);
        headGradient.addColorStop(0.3, `hsla(190, 95%, 80%, ${fadeOpacity * star.opacity * 0.8})`);
        headGradient.addColorStop(1, "transparent");
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = headGradient;
        ctx.fill();

        // Core of head
        ctx.beginPath();
        ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(0, 0%, 100%, ${fadeOpacity * star.opacity})`;
        ctx.fill();

        // Remove if life exceeded or out of bounds
        return star.life < star.maxLife && 
               star.x < rect.width + 100 && 
               star.y < rect.height + 100;
      });

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
