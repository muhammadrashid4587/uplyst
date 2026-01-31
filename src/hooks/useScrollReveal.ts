import { useEffect, useRef, useState, useCallback } from "react";

type RevealDirection = "up" | "down" | "left" | "right" | "scale" | "fade";

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  direction?: RevealDirection;
  delay?: number;
  once?: boolean;
}

export const useScrollReveal = (
  thresholdOrOptions: number | UseScrollRevealOptions = 0.1,
  rootMargin = "0px"
) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Parse options
  const options: UseScrollRevealOptions = typeof thresholdOrOptions === "number"
    ? { threshold: thresholdOrOptions, rootMargin }
    : thresholdOrOptions;

  const {
    threshold = 0.1,
    rootMargin: margin = "0px",
    once = true,
  } = options;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: margin }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, margin, once]);

  return { ref, isVisible };
};

// Hook for staggered children reveals
export const useStaggerReveal = (
  itemCount: number,
  options: UseScrollRevealOptions & { staggerDelay?: number } = {}
) => {
  const { ref, isVisible } = useScrollReveal(options);
  const { staggerDelay = 100 } = options;

  const getStaggerDelay = useCallback(
    (index: number) => index * staggerDelay,
    [staggerDelay]
  );

  const getStaggerStyle = useCallback(
    (index: number) => ({
      transitionDelay: `${getStaggerDelay(index)}ms`,
    }),
    [getStaggerDelay]
  );

  return { ref, isVisible, getStaggerDelay, getStaggerStyle };
};

// CSS class helper for reveal animations
export const getRevealClasses = (
  isVisible: boolean,
  direction: RevealDirection = "up",
  duration = 700
) => {
  const baseClasses = `transition-all duration-${duration}`;
  
  const hiddenClasses: Record<RevealDirection, string> = {
    up: "opacity-0 translate-y-8",
    down: "opacity-0 -translate-y-8",
    left: "opacity-0 translate-x-8",
    right: "opacity-0 -translate-x-8",
    scale: "opacity-0 scale-95",
    fade: "opacity-0",
  };

  const visibleClasses = "opacity-100 translate-y-0 translate-x-0 scale-100";

  return `${baseClasses} ${isVisible ? visibleClasses : hiddenClasses[direction]}`;
};

export default useScrollReveal;
