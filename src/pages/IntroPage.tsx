import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const IntroPage = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"laser" | "glow" | "reveal">("laser");
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

    // U shape path points (relative to center)
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const scale = Math.min(window.innerWidth, window.innerHeight) * 0.25;

    // Define U path as series of points
    const uPath: { x: number; y: number }[] = [];
    
    // Left side down
    for (let i = 0; i <= 20; i++) {
      uPath.push({
        x: centerX - scale * 0.4,
        y: centerY - scale * 0.5 + (scale * 0.7 * i) / 20
      });
    }
    
    // Bottom curve
    for (let i = 0; i <= 30; i++) {
      const angle = Math.PI + (Math.PI * i) / 30;
      uPath.push({
        x: centerX + Math.cos(angle) * scale * 0.4,
        y: centerY + scale * 0.2 + Math.sin(angle) * scale * 0.3
      });
    }
    
    // Right side up
    for (let i = 0; i <= 20; i++) {
      uPath.push({
        x: centerX + scale * 0.4,
        y: centerY + scale * 0.2 - (scale * 0.7 * i) / 20
      });
    }

    let currentPoint = 0;
    let animationId: number;
    const drawnPoints: { x: number; y: number }[] = [];
    const particles: { x: number; y: number; vx: number; vy: number; life: number; size: number }[] = [];

    const animate = () => {
      ctx.fillStyle = "rgba(10, 15, 25, 0.15)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      // Draw particles (sparks)
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        p.vy += 0.1; // gravity

        if (p.life > 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(190, 100%, 70%, ${p.life})`;
          ctx.fill();
        } else {
          particles.splice(i, 1);
        }
      });

      // Draw the carved path with glow
      if (drawnPoints.length > 1) {
        // Outer glow
        ctx.beginPath();
        ctx.moveTo(drawnPoints[0].x, drawnPoints[0].y);
        for (let i = 1; i < drawnPoints.length; i++) {
          ctx.lineTo(drawnPoints[i].x, drawnPoints[i].y);
        }
        ctx.strokeStyle = "hsla(190, 100%, 60%, 0.3)";
        ctx.lineWidth = 20;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();

        // Inner glow
        ctx.beginPath();
        ctx.moveTo(drawnPoints[0].x, drawnPoints[0].y);
        for (let i = 1; i < drawnPoints.length; i++) {
          ctx.lineTo(drawnPoints[i].x, drawnPoints[i].y);
        }
        ctx.strokeStyle = "hsla(190, 100%, 70%, 0.6)";
        ctx.lineWidth = 8;
        ctx.stroke();

        // Core line
        ctx.beginPath();
        ctx.moveTo(drawnPoints[0].x, drawnPoints[0].y);
        for (let i = 1; i < drawnPoints.length; i++) {
          ctx.lineTo(drawnPoints[i].x, drawnPoints[i].y);
        }
        ctx.strokeStyle = "hsla(190, 100%, 90%, 1)";
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Draw laser head
      if (currentPoint < uPath.length && phase === "laser") {
        const point = uPath[currentPoint];
        drawnPoints.push(point);

        // Laser head glow
        const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, 40);
        gradient.addColorStop(0, "hsla(190, 100%, 95%, 1)");
        gradient.addColorStop(0.2, "hsla(190, 100%, 70%, 0.8)");
        gradient.addColorStop(0.5, "hsla(190, 100%, 50%, 0.4)");
        gradient.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.arc(point.x, point.y, 40, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core bright point
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();

        // Spawn sparks
        for (let i = 0; i < 3; i++) {
          particles.push({
            x: point.x,
            y: point.y,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8 - 2,
            life: 1,
            size: Math.random() * 3 + 1
          });
        }

        currentPoint += 2; // Speed of carving
      }

      // Check if carving is complete
      if (currentPoint >= uPath.length && phase === "laser") {
        setPhase("glow");
        
        // After glow phase, transition out
        setTimeout(() => {
          setPhase("reveal");
          setTimeout(() => {
            setOpacity(0);
            setTimeout(() => {
              navigate("/home");
            }, 800);
          }, 500);
        }, 1000);
      }

      // Pulsing glow effect after carving complete
      if (phase === "glow" || phase === "reveal") {
        const pulse = Math.sin(Date.now() * 0.005) * 0.3 + 0.7;
        
        ctx.beginPath();
        ctx.moveTo(drawnPoints[0]?.x || 0, drawnPoints[0]?.y || 0);
        for (let i = 1; i < drawnPoints.length; i++) {
          ctx.lineTo(drawnPoints[i].x, drawnPoints[i].y);
        }
        ctx.strokeStyle = `hsla(190, 100%, 70%, ${pulse * 0.5})`;
        ctx.lineWidth = 30;
        ctx.stroke();
      }

      animationId = requestAnimationFrame(animate);
    };

    // Initial clear
    ctx.fillStyle = "hsl(220, 30%, 8%)";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    // Start animation after a brief delay
    setTimeout(() => {
      animate();
    }, 500);

    return () => {
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
        transition: "opacity 0.8s ease-out",
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
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground text-sm animate-pulse"
        style={{ opacity: phase === "laser" ? 1 : 0, transition: "opacity 0.5s" }}
      >
        Click anywhere to skip
      </div>

      {/* Sound effect simulation with visual pulse */}
      {phase === "laser" && (
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary/20 animate-ping"
            style={{ animationDuration: "0.5s" }}
          />
        </div>
      )}
    </div>
  );
};

export default IntroPage;
