import { useEffect, useRef } from "react";
import Lenis from "lenis";

export const useSmoothScroll = () => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Don't initialize on touch devices for native scroll feel
    if ('ontouchstart' in window) {
      return;
    }

    const lenis = new Lenis({
      duration: 0.8, // Faster, snappier response like Mac
      easing: (t) => 1 - Math.pow(1 - t, 3), // Cubic ease-out for natural deceleration
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.2, // More responsive wheel
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return lenisRef;
};

export default useSmoothScroll;
