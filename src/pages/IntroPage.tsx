import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const IntroPage = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"waiting" | "laser" | "glow" | "reveal">("waiting");
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);

    const width = window.innerWidth;
    const height = window.innerHeight;

    // U shape path points (relative to center)
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = Math.min(width, height) * 0.2;

    // Define U path as series of points - more detailed for smoother movement
    const uPath: { x: number; y: number }[] = [];
    
    // Left side down
    for (let i = 0; i <= 40; i++) {
      uPath.push({
        x: centerX - scale * 0.5,
        y: centerY - scale * 0.6 + (scale * 0.9 * i) / 40
      });
    }
    
    // Bottom curve - more points for smooth curve
    for (let i = 0; i <= 60; i++) {
      const angle = Math.PI + (Math.PI * i) / 60;
      uPath.push({
        x: centerX + Math.cos(angle) * scale * 0.5,
        y: centerY + scale * 0.3 + Math.sin(angle) * scale * 0.35
      });
    }
    
    // Right side up
    for (let i = 0; i <= 40; i++) {
      uPath.push({
        x: centerX + scale * 0.5,
        y: centerY + scale * 0.3 - (scale * 0.9 * i) / 40
      });
    }

    let progress = 0;
    let animationId: number;
    const drawnPoints: { x: number; y: number; time: number }[] = [];
    const sparks: { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number; hue: number }[] = [];
    const glowParticles: { x: number; y: number; size: number; opacity: number }[] = [];
    let startTime = 0;
    let hasStarted = false;

    const animate = (timestamp: number) => {
      if (!hasStarted) {
        startTime = timestamp;
        hasStarted = true;
        setPhase("laser");
      }

      const elapsed = timestamp - startTime;
      
      // Clear with slight trail effect
      ctx.fillStyle = "rgba(8, 12, 20, 0.08)";
      ctx.fillRect(0, 0, width, height);

      // Draw ambient glow particles
      glowParticles.forEach((p, i) => {
        p.opacity -= 0.005;
        if (p.opacity <= 0) {
          glowParticles.splice(i, 1);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(190, 80%, 60%, ${p.opacity * 0.3})`;
          ctx.fill();
        }
      });

      // Update and draw sparks
      sparks.forEach((spark, i) => {
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.vy += 0.15; // gravity
        spark.vx *= 0.98; // air resistance
        spark.life -= 1;

        if (spark.life <= 0) {
          sparks.splice(i, 1);
        } else {
          const lifeRatio = spark.life / spark.maxLife;
          const size = spark.size * lifeRatio;
          
          // Spark glow
          const gradient = ctx.createRadialGradient(spark.x, spark.y, 0, spark.x, spark.y, size * 3);
          gradient.addColorStop(0, `hsla(${spark.hue}, 100%, 80%, ${lifeRatio})`);
          gradient.addColorStop(0.5, `hsla(${spark.hue}, 100%, 60%, ${lifeRatio * 0.5})`);
          gradient.addColorStop(1, "transparent");
          
          ctx.beginPath();
          ctx.arc(spark.x, spark.y, size * 3, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();

          // Spark core
          ctx.beginPath();
          ctx.arc(spark.x, spark.y, size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${spark.hue}, 100%, 95%, ${lifeRatio})`;
          ctx.fill();
        }
      });

      // Draw the carved path with molten glow effect
      if (drawnPoints.length > 1) {
        // Outer molten glow
        ctx.beginPath();
        ctx.moveTo(drawnPoints[0].x, drawnPoints[0].y);
        for (let i = 1; i < drawnPoints.length; i++) {
          ctx.lineTo(drawnPoints[i].x, drawnPoints[i].y);
        }
        ctx.strokeStyle = "hsla(190, 100%, 50%, 0.15)";
        ctx.lineWidth = 40;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();

        // Mid glow
        ctx.beginPath();
        ctx.moveTo(drawnPoints[0].x, drawnPoints[0].y);
        for (let i = 1; i < drawnPoints.length; i++) {
          ctx.lineTo(drawnPoints[i].x, drawnPoints[i].y);
        }
        ctx.strokeStyle = "hsla(190, 100%, 60%, 0.4)";
        ctx.lineWidth = 15;
        ctx.stroke();

        // Inner bright line
        ctx.beginPath();
        ctx.moveTo(drawnPoints[0].x, drawnPoints[0].y);
        for (let i = 1; i < drawnPoints.length; i++) {
          ctx.lineTo(drawnPoints[i].x, drawnPoints[i].y);
        }
        ctx.strokeStyle = "hsla(190, 100%, 80%, 0.9)";
        ctx.lineWidth = 4;
        ctx.stroke();

        // Core white line
        ctx.beginPath();
        ctx.moveTo(drawnPoints[0].x, drawnPoints[0].y);
        for (let i = 1; i < drawnPoints.length; i++) {
          ctx.lineTo(drawnPoints[i].x, drawnPoints[i].y);
        }
        ctx.strokeStyle = "hsla(180, 100%, 95%, 1)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Cooling effect - older parts glow less
        drawnPoints.forEach((point, i) => {
          const age = elapsed - point.time;
          if (age < 2000) {
            const heat = 1 - age / 2000;
            const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, 8 * heat);
            gradient.addColorStop(0, `hsla(30, 100%, 60%, ${heat * 0.3})`);
            gradient.addColorStop(1, "transparent");
            ctx.beginPath();
            ctx.arc(point.x, point.y, 8 * heat, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
          }
        });
      }

      // Slow cinematic progress - takes about 4 seconds
      if (phase === "laser" && progress < uPath.length) {
        const speed = 0.4; // Slow and deliberate
        progress += speed;
        
        const currentIndex = Math.floor(progress);
        if (currentIndex < uPath.length && (drawnPoints.length === 0 || currentIndex > drawnPoints.length - 1)) {
          const point = uPath[currentIndex];
          drawnPoints.push({ ...point, time: elapsed });

          // Add ambient glow particle
          glowParticles.push({
            x: point.x + (Math.random() - 0.5) * 20,
            y: point.y + (Math.random() - 0.5) * 20,
            size: Math.random() * 15 + 5,
            opacity: 1
          });

          // Spawn sparks - dramatic spray
          const sprayCount = Math.random() > 0.7 ? 5 : 2;
          for (let i = 0; i < sprayCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4 + 2;
            sparks.push({
              x: point.x,
              y: point.y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed - 3,
              life: 40 + Math.random() * 40,
              maxLife: 80,
              size: Math.random() * 2 + 1,
              hue: 180 + Math.random() * 40 // cyan to blue
            });
          }

          // Occasionally spawn orange/hot sparks
          if (Math.random() > 0.8) {
            for (let i = 0; i < 3; i++) {
              sparks.push({
                x: point.x,
                y: point.y,
                vx: (Math.random() - 0.5) * 6,
                vy: -Math.random() * 5 - 2,
                life: 60 + Math.random() * 30,
                maxLife: 90,
                size: Math.random() * 1.5 + 0.5,
                hue: 30 + Math.random() * 20 // orange/yellow
              });
            }
          }
        }

        // Draw laser head
        const point = uPath[Math.min(currentIndex, uPath.length - 1)];
        
        // Intense beam glow
        const beamGlow = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, 80);
        beamGlow.addColorStop(0, "hsla(190, 100%, 98%, 1)");
        beamGlow.addColorStop(0.1, "hsla(190, 100%, 80%, 0.9)");
        beamGlow.addColorStop(0.3, "hsla(190, 100%, 60%, 0.5)");
        beamGlow.addColorStop(0.6, "hsla(190, 100%, 50%, 0.2)");
        beamGlow.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.arc(point.x, point.y, 80, 0, Math.PI * 2);
        ctx.fillStyle = beamGlow;
        ctx.fill();

        // Pulsing core
        const pulse = Math.sin(elapsed * 0.02) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 8 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.shadowColor = "hsl(190, 100%, 70%)";
        ctx.shadowBlur = 30;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Beam flicker effect
        if (Math.random() > 0.9) {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 100, 0, Math.PI * 2);
          ctx.fillStyle = "hsla(190, 100%, 80%, 0.1)";
          ctx.fill();
        }
      }

      // Check if carving is complete
      if (progress >= uPath.length && phase === "laser") {
        setPhase("glow");
        
        setTimeout(() => {
          setPhase("reveal");
          setTimeout(() => {
            setOpacity(0);
            setTimeout(() => {
              navigate("/home");
            }, 1000);
          }, 800);
        }, 1500);
      }

      // Final glow pulse after complete
      if (phase === "glow" || phase === "reveal") {
        const pulse = Math.sin(elapsed * 0.008) * 0.4 + 0.6;
        
        ctx.beginPath();
        ctx.moveTo(drawnPoints[0]?.x || 0, drawnPoints[0]?.y || 0);
        for (let i = 1; i < drawnPoints.length; i++) {
          ctx.lineTo(drawnPoints[i].x, drawnPoints[i].y);
        }
        ctx.strokeStyle = `hsla(190, 100%, 70%, ${pulse * 0.6})`;
        ctx.lineWidth = 50;
        ctx.stroke();
      }

      animationId = requestAnimationFrame(animate);
    };

    // Initial clear
    ctx.fillStyle = "hsl(220, 40%, 6%)";
    ctx.fillRect(0, 0, width, height);

    // Start animation after a brief delay
    const startTimeout = setTimeout(() => {
      animationId = requestAnimationFrame(animate);
    }, 800);

    return () => {
      clearTimeout(startTimeout);
      cancelAnimationFrame(animationId);
    };
  }, [navigate, phase]);

  // Skip intro on click
  const handleSkip = () => {
    setOpacity(0);
    setTimeout(() => {
      navigate("/home");
    }, 500);
  };

  return (
    <div 
      className="fixed inset-0 bg-background z-50 cursor-pointer"
      style={{ 
        opacity, 
        transition: "opacity 1s ease-out",
        background: "hsl(220, 40%, 6%)"
      }}
      onClick={handleSkip}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ width: "100%", height: "100%" }}
      />
      
      {/* Skip hint */}
      <div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground/60 text-sm tracking-widest uppercase"
        style={{ 
          opacity: phase === "laser" || phase === "waiting" ? 0.6 : 0, 
          transition: "opacity 0.5s" 
        }}
      >
        Click to skip
      </div>
    </div>
  );
};

export default IntroPage;
