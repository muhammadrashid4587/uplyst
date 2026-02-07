import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Pre-generate the impact sound
const playImpactSound = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-sfx`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          prompt: "Heavy metallic clang impact, industrial metal hitting concrete floor, reverberant echo",
          duration: 2,
        }),
      }
    );

    if (!response.ok) {
      console.error("Failed to generate sound effect");
      return;
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.volume = 0.7;
    await audio.play();
  } catch (error) {
    console.error("Error playing impact sound:", error);
  }
};

// Ambient hum during laser carving
let ambientAudio: HTMLAudioElement | null = null;

const startAmbientHum = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-sfx`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          prompt: "Subtle electronic hum, low frequency drone, sci-fi laser charging ambient, quiet industrial machinery",
          duration: 6,
        }),
      }
    );

    if (!response.ok) {
      console.error("Failed to generate ambient sound");
      return;
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    ambientAudio = new Audio(audioUrl);
    ambientAudio.volume = 0.25;
    ambientAudio.loop = true;
    await ambientAudio.play();
  } catch (error) {
    console.error("Error playing ambient sound:", error);
  }
};

const fadeOutAmbientHum = () => {
  if (!ambientAudio) return;
  
  const fadeInterval = setInterval(() => {
    if (ambientAudio && ambientAudio.volume > 0.02) {
      ambientAudio.volume = Math.max(0, ambientAudio.volume - 0.02);
    } else {
      clearInterval(fadeInterval);
      if (ambientAudio) {
        ambientAudio.pause();
        ambientAudio = null;
      }
    }
  }, 50);
};

const IntroPage = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [, setPhase] = useState<"waiting" | "laser" | "wallFall" | "reveal">("waiting");
  const phaseRef = useRef<"waiting" | "laser" | "wallFall" | "reveal">("waiting");
  const [wallRotation, setWallRotation] = useState(0);
  const [wallOpacity, setWallOpacity] = useState(1);
  const hasNavigated = useRef(false);

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
        y: centerY - scale * 0.6 + (scale * 1.0 * i) / 50 // ends at centerY + 0.4
      });
    }
    
    // Bottom - curved arc
    for (let i = 0; i <= 40; i++) {
      const angle = Math.PI + (Math.PI * i) / 40; // From PI to 2*PI (bottom half of circle)
      uPath.push({
        x: centerX + Math.cos(angle) * scale * 0.5,
        y: centerY + scale * 0.4 - Math.sin(angle) * scale * 0.5
      });
    }
    
    // Right side up - straight line
    for (let i = 0; i <= 50; i++) {
      uPath.push({
        x: centerX + scale * 0.5,
        y: centerY + scale * 0.4 - (scale * 1.0 * i) / 50 // starts at centerY + 0.4, ends at centerY - 0.6
      });
    }

    let progress = 0;
    let animationId: number;
    const drawnPoints: { x: number; y: number; time: number }[] = [];
    const sparks: { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number; hue: number }[] = [];
    const glowParticles: { x: number; y: number; size: number; opacity: number }[] = [];
    let startTime = 0;
    let hasStarted = false;
    let wallFallStartTime = 0;
    let ambientStarted = false;

    const animate = (timestamp: number) => {
      if (!hasStarted) {
        startTime = timestamp;
        hasStarted = true;
        phaseRef.current = "laser";
        setPhase("laser");
        
        // Start ambient hum
        if (!ambientStarted) {
          ambientStarted = true;
          startAmbientHum();
        }
      }

      const elapsed = timestamp - startTime;
      
      // Clear with slight trail effect
      ctx.fillStyle = "rgba(8, 12, 20, 0.08)";
      ctx.fillRect(0, 0, width, height);

      // Handle wall fall phase
      if (phaseRef.current === "wallFall") {
        if (wallFallStartTime === 0) {
          wallFallStartTime = timestamp;
          // Play impact sound when wall starts falling
          playImpactSound();
        }
        
        const wallFallElapsed = timestamp - wallFallStartTime;
        const wallFallDuration = 1200;
        const wallProgress = Math.min(wallFallElapsed / wallFallDuration, 1);
        
        // Eased rotation for wall falling forward
        const eased = 1 - Math.pow(1 - wallProgress, 3);
        setWallRotation(eased * 90);
        setWallOpacity(1 - eased);
        
        // Navigate after wall falls
        if (wallProgress >= 1 && !hasNavigated.current) {
          phaseRef.current = "reveal";
          setPhase("reveal");
          hasNavigated.current = true;
          setTimeout(() => {
            sessionStorage.setItem("fromIntro", "true");
            navigate("/home");
          }, 300);
        }
      }

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
      if (drawnPoints.length > 1 && phaseRef.current !== "wallFall" && phaseRef.current !== "reveal") {
        ctx.save();
        
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

        // Cooling effect - older parts glow less (only during laser phase)
        if (phaseRef.current === "laser") {
          drawnPoints.forEach((point) => {
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
        
        ctx.restore();
      }

      // Cinematic progress - takes about 2.5-3 seconds
      if (phaseRef.current === "laser" && progress < uPath.length) {
        const speed = 1.5; // Balanced pacing
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

      // Check if carving is complete - trigger wall fall
      if (progress >= uPath.length && phaseRef.current === "laser") {
        phaseRef.current = "wallFall";
        setPhase("wallFall");
        
        // Fade out ambient hum
        fadeOutAmbientHum();
      }

      animationId = requestAnimationFrame(animate);
    };

    // Initial clear
    ctx.fillStyle = "hsl(220, 40%, 6%)";
    ctx.fillRect(0, 0, width, height);

    // Start animation after a brief delay
    const startTimeout = setTimeout(() => {
      animationId = requestAnimationFrame(animate);
    }, 300);

    return () => {
      clearTimeout(startTimeout);
      cancelAnimationFrame(animationId);
      
      // Clean up ambient audio
      if (ambientAudio) {
        ambientAudio.pause();
        ambientAudio = null;
      }
    };
  }, [navigate]);

  // Skip intro on click
  const handleSkip = () => {
    if (hasNavigated.current) return;
    hasNavigated.current = true;
    setWallOpacity(0);
    setTimeout(() => {
      sessionStorage.setItem("fromIntro", "true");
      navigate("/home");
    }, 500);
  };

  return (
    <div 
      className="fixed inset-0 bg-background z-50 cursor-pointer"
      style={{ 
        opacity: wallOpacity,
        transform: `perspective(1000px) rotateX(${wallRotation}deg)`,
        transformOrigin: "top center",
        transition: "opacity 0.5s ease-out, transform 1.2s cubic-bezier(0.55, 0.085, 0.68, 0.53)",
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
          opacity: phaseRef.current === "laser" || phaseRef.current === "waiting" ? 0.6 : 0, 
          transition: "opacity 0.5s" 
        }}
      >
        Click to skip
      </div>
    </div>
  );
};

export default IntroPage;
