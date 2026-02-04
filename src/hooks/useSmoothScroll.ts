import { useEffect } from "react";

export const useSmoothScroll = () => {
  useEffect(() => {
    // Native scrolling - no Lenis for natural browser behavior
    document.documentElement.style.scrollBehavior = "smooth";
    
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  return null;
};

export default useSmoothScroll;
