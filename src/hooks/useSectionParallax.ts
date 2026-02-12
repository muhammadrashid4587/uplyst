import { useEffect, useRef, useState, useCallback } from "react";

interface UseSectionParallaxOptions {
  speed?: number; // 0 = no effect, 1 = full scroll offset
  scale?: boolean; // enable subtle scale on scroll
}

export const useSectionParallax = (options: UseSectionParallaxOptions = {}) => {
  const { speed = 0.15, scale = false } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  const handleScroll = useCallback(() => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const elementCenter = rect.top + rect.height / 2;
    const viewportCenter = windowHeight / 2;
    const offset = (elementCenter - viewportCenter) * speed;

    const progress = Math.max(0, Math.min(1, 1 - rect.top / windowHeight));
    const scaleValue = scale ? 0.95 + progress * 0.05 : 1;

    setStyle({
      transform: `translateY(${offset}px) scale(${scaleValue})`,
      willChange: "transform",
    });
  }, [speed, scale]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return { ref, style };
};

export default useSectionParallax;
