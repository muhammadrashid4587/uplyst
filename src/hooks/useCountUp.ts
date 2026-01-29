import { useEffect, useState } from "react";

export const useCountUp = (
  end: number,
  duration: number = 2000,
  start: number = 0,
  isActive: boolean = true
) => {
  const [count, setCount] = useState(start);

  useEffect(() => {
    if (!isActive) {
      setCount(start);
      return;
    }

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(start + (end - start) * easeOutQuart));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, start, isActive]);

  return count;
};

export default useCountUp;
