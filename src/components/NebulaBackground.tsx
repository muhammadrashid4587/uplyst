import { useEffect, useRef } from "react";

interface NebulaBackgroundProps {
  className?: string;
}

export const NebulaBackground = ({ className = "" }: NebulaBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    // Nebula colors (cyan/blue theme matching Uplyst)
    const nebulaColors = [
      { r: 0, g: 212, b: 255, a: 0.08 },   // Cyan
      { r: 0, g: 136, b: 255, a: 0.06 },   // Blue
      { r: 100, g: 0, b: 255, a: 0.04 },   // Purple
      { r: 0, g: 255, b: 200, a: 0.05 },   // Teal
    ];

    const nebulaBlobs = nebulaColors.map((color, i) => ({
      color,
      x: Math.random(),
      y: Math.random(),
      size: 0.3 + Math.random() * 0.4,
      speedX: (Math.random() - 0.5) * 0.0002,
      speedY: (Math.random() - 0.5) * 0.0002,
      phase: i * Math.PI * 0.5,
    }));

    const drawNebula = () => {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

      // Clear with transparency
      ctx.clearRect(0, 0, width, height);

      // Draw each nebula blob
      nebulaBlobs.forEach((blob) => {
        // Animate position with slow drift
        blob.x += blob.speedX;
        blob.y += blob.speedY;

        // Wrap around edges
        if (blob.x < -0.3) blob.x = 1.3;
        if (blob.x > 1.3) blob.x = -0.3;
        if (blob.y < -0.3) blob.y = 1.3;
        if (blob.y > 1.3) blob.y = -0.3;

        // Pulsing size animation
        const pulseSize = blob.size + Math.sin(time * 0.0005 + blob.phase) * 0.1;
        const centerX = blob.x * width;
        const centerY = blob.y * height;
        const radius = Math.max(width, height) * pulseSize;

        // Pulsing opacity
        const pulseAlpha = blob.color.a * (0.7 + Math.sin(time * 0.0003 + blob.phase) * 0.3);

        // Create radial gradient for nebula effect
        const gradient = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          radius
        );

        gradient.addColorStop(
          0,
          `rgba(${blob.color.r}, ${blob.color.g}, ${blob.color.b}, ${pulseAlpha})`
        );
        gradient.addColorStop(
          0.4,
          `rgba(${blob.color.r}, ${blob.color.g}, ${blob.color.b}, ${pulseAlpha * 0.5})`
        );
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      });

      // Add aurora wave effect
      const waveCount = 3;
      for (let w = 0; w < waveCount; w++) {
        ctx.beginPath();
        ctx.moveTo(0, height * 0.5);

        const wavePhase = time * 0.0002 + w * Math.PI * 0.7;
        const waveAmplitude = height * 0.15;
        const waveY = height * (0.3 + w * 0.2);

        for (let x = 0; x <= width; x += 10) {
          const y =
            waveY +
            Math.sin((x / width) * Math.PI * 2 + wavePhase) * waveAmplitude +
            Math.sin((x / width) * Math.PI * 4 + wavePhase * 1.5) * (waveAmplitude * 0.3);
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        // Create gradient for aurora wave
        const waveGradient = ctx.createLinearGradient(0, waveY - waveAmplitude, 0, waveY + waveAmplitude);
        const alpha = 0.03 + Math.sin(time * 0.0004 + w) * 0.02;
        
        if (w === 0) {
          waveGradient.addColorStop(0, `rgba(0, 212, 255, 0)`);
          waveGradient.addColorStop(0.5, `rgba(0, 212, 255, ${alpha})`);
          waveGradient.addColorStop(1, `rgba(0, 212, 255, 0)`);
        } else if (w === 1) {
          waveGradient.addColorStop(0, `rgba(0, 136, 255, 0)`);
          waveGradient.addColorStop(0.5, `rgba(0, 136, 255, ${alpha})`);
          waveGradient.addColorStop(1, `rgba(0, 136, 255, 0)`);
        } else {
          waveGradient.addColorStop(0, `rgba(100, 0, 255, 0)`);
          waveGradient.addColorStop(0.5, `rgba(100, 0, 255, ${alpha})`);
          waveGradient.addColorStop(1, `rgba(100, 0, 255, 0)`);
        }

        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = waveGradient;
        ctx.fill();
      }

      time += 16;
      animationId = requestAnimationFrame(drawNebula);
    };

    drawNebula();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default NebulaBackground;
