import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

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

export const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    let stars: Star[] = [];
    let shootingStars: ShootingStar[] = [];
    let mouseX = 0;
    let mouseY = 0;
    let lastTime = 0;
    let shootingStarTimer = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
      initStars();
    };

    const initParticles = () => {
      particles = [];
      const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
      
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
    };

    const initStars = () => {
      stars = Array.from({ length: 200 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 3 + 1,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        speed: Math.random() * 0.3 + 0.1,
      }));
    };

    const drawParticle = (p: Particle) => {
      if (!ctx) return;
      
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
      gradient.addColorStop(0, `hsla(200, 80%, 60%, ${p.opacity})`);
      gradient.addColorStop(0.5, `hsla(220, 70%, 50%, ${p.opacity * 0.5})`);
      gradient.addColorStop(1, "transparent");
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(200, 90%, 70%, ${p.opacity})`;
      ctx.fill();
    };

    const drawConnections = () => {
      if (!ctx) return;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const opacity = (1 - distance / 150) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `hsla(210, 70%, 55%, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    };

    const drawWaves = (time: number) => {
      if (!ctx) return;

      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);

        for (let x = 0; x <= canvas.width; x += 10) {
          const y = canvas.height * 0.6 + 
            Math.sin(x * 0.003 + time * 0.0005 + i) * 80 +
            Math.sin(x * 0.007 + time * 0.0003) * 40 +
            i * 50;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, canvas.height * 0.4, 0, canvas.height);
        gradient.addColorStop(0, `hsla(${200 + i * 20}, 70%, 50%, ${0.03 - i * 0.008})`);
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    };

    const createShootingStar = (): ShootingStar => {
      const startX = Math.random() * canvas.width * 0.8;
      const startY = Math.random() * canvas.height * 0.4;
      const angle = Math.PI * 0.15 + Math.random() * 0.2;
      
      return {
        x: startX,
        y: startY,
        angle,
        speed: 8 + Math.random() * 6,
        length: 80 + Math.random() * 120,
        opacity: 0.9 + Math.random() * 0.1,
        life: 0,
        maxLife: 60 + Math.random() * 40,
        trail: [],
      };
    };

    const animate = (time: number) => {
      if (!ctx) return;

      const deltaTime = time - lastTime;
      lastTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw stars first (background layer)
      stars.forEach((star) => {
        const parallaxX = (mouseX - canvas.width / 2) / canvas.width * star.z * 20;
        const parallaxY = (mouseY - canvas.height / 2) / canvas.height * star.z * 20;
        const twinkle = Math.sin(time * 0.002 * star.speed + star.x) * 0.3 + 0.7;

        const drawX = star.x + parallaxX;
        const drawY = star.y + parallaxY;

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

        ctx.beginPath();
        ctx.arc(drawX, drawY, star.size * (star.z / 4), 0, Math.PI * 2);
        ctx.fillStyle = `hsla(190, 80%, 80%, ${star.opacity * twinkle})`;
        ctx.fill();

        star.y -= star.speed * (deltaTime / 16);
        
        if (star.y < -10) {
          star.y = canvas.height + 10;
          star.x = Math.random() * canvas.width;
        }
      });

      // Draw shooting stars
      shootingStarTimer += deltaTime;
      if (shootingStarTimer > 800 + Math.random() * 1200) {
        shootingStars.push(createShootingStar());
        shootingStarTimer = 0;
      }

      shootingStars = shootingStars.filter((star) => {
        star.life++;
        
        const moveX = Math.cos(star.angle) * star.speed;
        const moveY = Math.sin(star.angle) * star.speed;
        star.x += moveX;
        star.y += moveY;

        star.trail.unshift({ 
          x: star.x, 
          y: star.y, 
          opacity: star.opacity 
        });

        const maxTrailLength = Math.floor(star.length / 3);
        if (star.trail.length > maxTrailLength) {
          star.trail.pop();
        }

        const lifeRatio = star.life / star.maxLife;
        const fadeOpacity = lifeRatio > 0.7 ? (1 - (lifeRatio - 0.7) / 0.3) : 1;

        if (star.trail.length > 1) {
          for (let i = 0; i < star.trail.length - 1; i++) {
            const t1 = star.trail[i];
            const t2 = star.trail[i + 1];
            const trailOpacity = (1 - i / star.trail.length) * fadeOpacity * star.opacity;
            const trailWidth = (1 - i / star.trail.length) * 3 + 0.5;

            ctx.beginPath();
            ctx.moveTo(t1.x, t1.y);
            ctx.lineTo(t2.x, t2.y);
            ctx.strokeStyle = `hsla(190, 95%, 75%, ${trailOpacity})`;
            ctx.lineWidth = trailWidth;
            ctx.lineCap = "round";
            ctx.stroke();
          }
        }

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

        ctx.beginPath();
        ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(0, 0%, 100%, ${fadeOpacity * star.opacity})`;
        ctx.fill();

        return star.life < star.maxLife && 
               star.x < canvas.width + 100 && 
               star.y < canvas.height + 100;
      });

      // Draw aurora waves
      drawWaves(time);

      // Update and draw particles
      particles.forEach((p) => {
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 200) {
          const force = (200 - dist) / 200 * 0.02;
          p.vx -= dx * force * 0.01;
          p.vy -= dy * force * 0.01;
        }

        p.x += p.vx;
        p.y += p.vy;

        p.vx *= 0.99;
        p.vy *= 0.99;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        p.x = Math.max(0, Math.min(canvas.width, p.x));
        p.y = Math.max(0, Math.min(canvas.height, p.y));

        drawParticle(p);
      });

      drawConnections();

      animationId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    
    resize();
    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: "transparent" }}
    />
  );
};

export default AnimatedBackground;
