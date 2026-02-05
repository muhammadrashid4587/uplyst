import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface ShatterPiece {
  points: { x: number; y: number }[];
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

const IntroPage = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [, setPhase] = useState<"waiting" | "laser" | "fall" | "shatter" | "reveal">("waiting");
  const phaseRef = useRef<"waiting" | "laser" | "fall" | "shatter" | "reveal">("waiting");
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

    // U shape path points (relative to center) - ANGULAR/STRAIGHT version
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = Math.min(width, height) * 0.2;

    const uPath: { x: number; y: number }[] = [];
    
    // Left side down - straight line
    for (let i = 0; i <= 50; i++) {
      uPath.push({
        x: centerX - scale * 0.5,
        y: centerY - scale * 0.6 + (scale * 1.0 * i) / 50
      });
    }
    
    // Bottom - straight horizontal lines (angular corners)
    // Left corner going right
    for (let i = 0; i <= 30; i++) {
      uPath.push({
        x: centerX - scale * 0.5 + (scale * 1.0 * i) / 30,
        y: centerY + scale * 0.4
      });
    }
    
    // Right side up - straight line
    for (let i = 0; i <= 50; i++) {
      uPath.push({
        x: centerX + scale * 0.5,
        y: centerY + scale * 0.4 - (scale * 1.0 * i) / 50
      });
    }

    let progress = 0;
    let animationId: number;
    const drawnPoints: { x: number; y: number; time: number }[] = [];
    const sparks: { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number; hue: number }[] = [];
    const glowParticles: { x: number; y: number; size: number; opacity: number }[] = [];
    let startTime = 0;
    let hasStarted = false;
    let fallProgress = 0;
    let fallStartTime = 0;
    let uRotation = 0;
    let uOffsetY = 0;
    const shatterPieces: ShatterPiece[] = [];
    let shatterStartTime = 0;
    let hasShattered = false;
    let flashOpacity = 0;

    const animate = (timestamp: number) => {
      if (!hasStarted) {
        startTime = timestamp;
        hasStarted = true;
        phaseRef.current = "laser";
        setPhase("laser");
      }

      const elapsed = timestamp - startTime;
      
      // Clear with slight trail effect
      ctx.fillStyle = "rgba(8, 12, 20, 0.08)";
      ctx.fillRect(0, 0, width, height);

      // Draw flash effect
      if (flashOpacity > 0) {
        const gradient = ctx.createRadialGradient(centerX, height - 100, 0, centerX, height - 100, Math.max(width, height));
        gradient.addColorStop(0, `hsla(190, 100%, 95%, ${flashOpacity})`);
        gradient.addColorStop(0.3, `hsla(190, 100%, 70%, ${flashOpacity * 0.7})`);
        gradient.addColorStop(0.6, `hsla(200, 100%, 50%, ${flashOpacity * 0.3})`);
        gradient.addColorStop(1, `hsla(220, 100%, 30%, 0)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        flashOpacity -= 0.04;
      }

      // Calculate fall physics (only during fall phase, not shatter)
      if ((phaseRef.current === "fall" || fallStartTime > 0) && !hasShattered) {
        if (fallStartTime === 0) {
          fallStartTime = timestamp;
        }
        const fallElapsed = timestamp - fallStartTime;
        const fallDuration = 1200;
        fallProgress = Math.min(fallElapsed / fallDuration, 1);
        
        // Gravity acceleration
        const gravity = fallProgress * fallProgress;
        uOffsetY = gravity * (height * 0.8);
        
        // Slight rotation as it falls
        uRotation = fallProgress * 0.3;
      }

      // Handle shatter phase
      if (phaseRef.current === "shatter" || hasShattered) {
        if (!hasShattered && drawnPoints.length > 0) {
          hasShattered = true;
          shatterStartTime = timestamp;
          flashOpacity = 1; // Trigger flash
          
          // Create shatter pieces from the U shape
          const pieceSize = 8; // Points per piece
          for (let i = 0; i < drawnPoints.length; i += pieceSize) {
            const piecePoints = drawnPoints.slice(i, Math.min(i + pieceSize, drawnPoints.length));
            if (piecePoints.length < 2) continue;
            
            // Calculate center of piece
            const avgX = piecePoints.reduce((sum, p) => sum + p.x, 0) / piecePoints.length;
            const avgY = piecePoints.reduce((sum, p) => sum + p.y, 0) / piecePoints.length + uOffsetY;
            
            // Create piece with physics
            shatterPieces.push({
              points: piecePoints.map(p => ({ x: p.x - avgX, y: p.y - avgY })),
              x: avgX,
              y: avgY,
              vx: (Math.random() - 0.5) * 15,
              vy: -Math.random() * 12 - 5,
              rotation: 0,
              rotationSpeed: (Math.random() - 0.5) * 0.3,
              opacity: 1
            });
          }
          
          // Create explosion sparks
          for (let i = 0; i < 50; i++) {
            sparks.push({
              x: centerX + (Math.random() - 0.5) * scale,
              y: height - 100,
              vx: (Math.random() - 0.5) * 20,
              vy: -Math.random() * 15 - 5,
              life: 40 + Math.random() * 40,
              maxLife: 80,
              size: Math.random() * 3 + 1,
              hue: 180 + Math.random() * 40
            });
          }
        }
        
        // Update and draw shatter pieces
        shatterPieces.forEach((piece, i) => {
          piece.vy += 0.5; // gravity
          piece.x += piece.vx;
          piece.y += piece.vy;
          piece.rotation += piece.rotationSpeed;
          piece.vx *= 0.99;
          
          // Fade out pieces that fall off screen
          if (piece.y > height + 50) {
            piece.opacity -= 0.05;
          }
          
          if (piece.opacity > 0 && piece.points.length > 1) {
            ctx.save();
            ctx.translate(piece.x, piece.y);
            ctx.rotate(piece.rotation);
            ctx.globalAlpha = piece.opacity;
            
            // Draw piece with glow
            ctx.beginPath();
            ctx.moveTo(piece.points[0].x, piece.points[0].y);
            for (let j = 1; j < piece.points.length; j++) {
              ctx.lineTo(piece.points[j].x, piece.points[j].y);
            }
            ctx.strokeStyle = "hsla(190, 100%, 50%, 0.3)";
            ctx.lineWidth = 15;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(piece.points[0].x, piece.points[0].y);
            for (let j = 1; j < piece.points.length; j++) {
              ctx.lineTo(piece.points[j].x, piece.points[j].y);
            }
            ctx.strokeStyle = "hsla(190, 100%, 80%, 0.9)";
            ctx.lineWidth = 4;
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(piece.points[0].x, piece.points[0].y);
            for (let j = 1; j < piece.points.length; j++) {
              ctx.lineTo(piece.points[j].x, piece.points[j].y);
            }
            ctx.strokeStyle = "hsla(180, 100%, 95%, 1)";
            ctx.lineWidth = 2;
            ctx.stroke();
            
            ctx.restore();
          }
        });
        
        // Check if shatter animation is complete
        const shatterElapsed = timestamp - shatterStartTime;
        if (shatterElapsed > 1500 && phaseRef.current !== "reveal") {
          phaseRef.current = "reveal";
          setPhase("reveal");
        }
      }

      // Draw ambient glow particles
      glowParticles.forEach((p, i) => {
        p.opacity -= 0.005;
        if (p.opacity <= 0) {
          glowParticles.splice(i, 1);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y + uOffsetY, p.size, 0, Math.PI * 2);
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

      // Draw the carved path with molten glow effect (with fall offset)
      if (drawnPoints.length > 1 && !hasShattered) {
        ctx.save();
        
        // Apply fall transformation
        if (uOffsetY > 0) {
          ctx.translate(centerX, centerY);
          ctx.rotate(uRotation);
          ctx.translate(-centerX, -centerY);
        }
        
        // Outer molten glow
        ctx.beginPath();
        ctx.moveTo(drawnPoints[0].x, drawnPoints[0].y + uOffsetY);
        for (let i = 1; i < drawnPoints.length; i++) {
          ctx.lineTo(drawnPoints[i].x, drawnPoints[i].y + uOffsetY);
        }
        ctx.strokeStyle = "hsla(190, 100%, 50%, 0.15)";
        ctx.lineWidth = 40;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();

        // Mid glow
        ctx.beginPath();
        ctx.moveTo(drawnPoints[0].x, drawnPoints[0].y + uOffsetY);
        for (let i = 1; i < drawnPoints.length; i++) {
          ctx.lineTo(drawnPoints[i].x, drawnPoints[i].y + uOffsetY);
        }
        ctx.strokeStyle = "hsla(190, 100%, 60%, 0.4)";
        ctx.lineWidth = 15;
        ctx.stroke();

        // Inner bright line
        ctx.beginPath();
        ctx.moveTo(drawnPoints[0].x, drawnPoints[0].y + uOffsetY);
        for (let i = 1; i < drawnPoints.length; i++) {
          ctx.lineTo(drawnPoints[i].x, drawnPoints[i].y + uOffsetY);
        }
        ctx.strokeStyle = "hsla(190, 100%, 80%, 0.9)";
        ctx.lineWidth = 4;
        ctx.stroke();

        // Core white line
        ctx.beginPath();
        ctx.moveTo(drawnPoints[0].x, drawnPoints[0].y + uOffsetY);
        for (let i = 1; i < drawnPoints.length; i++) {
          ctx.lineTo(drawnPoints[i].x, drawnPoints[i].y + uOffsetY);
        }
        ctx.strokeStyle = "hsla(180, 100%, 95%, 1)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Cooling effect - older parts glow less (only during laser phase)
        if (phaseRef.current === "laser") {
          drawnPoints.forEach((point) => {
            const age = elapsed - point.time;
            if (age < 2000) {
              const heat = 1 - age / 2000;
              const gradient = ctx.createRadialGradient(point.x, point.y + uOffsetY, 0, point.x, point.y + uOffsetY, 8 * heat);
              gradient.addColorStop(0, `hsla(30, 100%, 60%, ${heat * 0.3})`);
              gradient.addColorStop(1, "transparent");
              ctx.beginPath();
              ctx.arc(point.x, point.y + uOffsetY, 8 * heat, 0, Math.PI * 2);
              ctx.fillStyle = gradient;
              ctx.fill();
            }
          });
        }
        
        ctx.restore();
      }

      // Even slower cinematic progress - takes about 6-7 seconds
      if (phaseRef.current === "laser" && progress < uPath.length) {
        const speed = 0.25; // Even slower and more deliberate
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
      if (progress >= uPath.length && phaseRef.current === "laser") {
        phaseRef.current = "fall";
        setPhase("fall");
        fallStartTime = timestamp;
      }

      // Trigger shatter when U hits the floor
      if (phaseRef.current === "fall" && fallProgress >= 1 && !hasShattered) {
        phaseRef.current = "shatter";
        setPhase("shatter");
        
        // Screen shake effect
        const shakeIntensity = 15;
        let shakeCount = 0;
        const shakeInterval = setInterval(() => {
          canvas.style.transform = `translate(${(Math.random() - 0.5) * shakeIntensity}px, ${(Math.random() - 0.5) * shakeIntensity}px)`;
          shakeCount++;
          if (shakeCount > 8) {
            clearInterval(shakeInterval);
            canvas.style.transform = '';
          }
        }, 40);
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
  }, [navigate]);

  // Handle fade transition when reveal phase is reached
  useEffect(() => {
    if (phaseRef.current === "reveal") {
      // Start fading out
      setOpacity(0);
      // Navigate after fade completes
      const timer = setTimeout(() => {
        navigate("/home");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [navigate]);

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
        style={{ width: "100%", height: "100%", transition: "transform 0.1s" }}
      />
      
      {/* Skip hint */}
      <div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground/60 text-sm tracking-widest uppercase"
        style={{ 
          opacity: phaseRef.current === "laser" || phaseRef.current === "waiting" || phaseRef.current === "fall" ? 0.6 : 0, 
          transition: "opacity 0.5s" 
        }}
      >
        Click to skip
      </div>
    </div>
  );
};

export default IntroPage;
