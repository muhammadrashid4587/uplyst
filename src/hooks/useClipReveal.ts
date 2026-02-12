import { useEffect, useRef, useState, useCallback } from "react";

type ClipDirection = "up" | "down" | "left" | "right" | "center";

interface UseClipRevealOptions {
  threshold?: number;
  direction?: ClipDirection;
  delay?: number;
  duration?: number;
  once?: boolean;
}

export const useClipReveal = (options: UseClipRevealOptions = {}) => {
  const {
    threshold = 0.15,
    direction = "up",
    delay = 0,
    duration = 900,
    once = true,
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [threshold, once]);

  const getClipPath = useCallback(() => {
    if (isVisible) return "inset(0 0 0 0)";

    switch (direction) {
      case "up": return "inset(100% 0 0 0)";
      case "down": return "inset(0 0 100% 0)";
      case "left": return "inset(0 100% 0 0)";
      case "right": return "inset(0 0 0 100%)";
      case "center": return "inset(50% 50% 50% 50%)";
      default: return "inset(100% 0 0 0)";
    }
  }, [isVisible, direction]);

  const getTransform = useCallback(() => {
    if (isVisible) return "translateY(0) scale(1)";

    switch (direction) {
      case "up": return "translateY(40px) scale(0.98)";
      case "down": return "translateY(-40px) scale(0.98)";
      case "left": return "translateX(40px) scale(0.98)";
      case "right": return "translateX(-40px) scale(0.98)";
      case "center": return "scale(0.9)";
      default: return "translateY(40px) scale(0.98)";
    }
  }, [isVisible, direction]);

  const style: React.CSSProperties = {
    clipPath: getClipPath(),
    transform: getTransform(),
    opacity: isVisible ? 1 : 0,
    transition: `clip-path ${duration}ms cubic-bezier(0.23, 1, 0.32, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.23, 1, 0.32, 1) ${delay}ms, opacity ${duration * 0.6}ms ease ${delay}ms`,
    willChange: "clip-path, transform, opacity",
  };

  return { ref, isVisible, style };
};

export default useClipReveal;
