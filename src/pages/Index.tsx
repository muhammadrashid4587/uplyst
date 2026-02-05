import { Layout } from "@/components/Layout";
import { Hero3D } from "@/components/Hero3D";
import { AnimatedStats } from "@/components/AnimatedStats";
import { AnimatedTimeline } from "@/components/AnimatedTimeline";
import { FloatingProfileCards } from "@/components/FloatingProfileCards";
import { EmployerSection } from "@/components/EmployerSection";
import { TrustSection } from "@/components/TrustSection";
import { PricingSection } from "@/components/PricingSection";
import { FAQSection } from "@/components/FAQSection";
import { FinalCTA } from "@/components/FinalCTA";
import { CustomCursor } from "@/components/CustomCursor";
import { useEffect, useState, useRef } from "react";

const Index = () => {
  // Check sessionStorage synchronously before first render
  const shouldSlide = useRef(
    typeof window !== "undefined" && sessionStorage.getItem("fromIntro") === "true"
  );
  const [isSliding, setIsSliding] = useState(shouldSlide.current);
  
  useEffect(() => {
    if (shouldSlide.current) {
      sessionStorage.removeItem("fromIntro");
      // Trigger the slide-in animation after a tiny delay
      const startTimer = setTimeout(() => {
        setIsSliding(false);
      }, 50);
      return () => clearTimeout(startTimer);
    }
  }, []);

  return (
    <div
      style={{
        opacity: isSliding ? 0 : 1,
        transform: isSliding ? "translateY(80px)" : "translateY(0)",
        transition: isSliding ? "none" : "opacity 0.8s ease-out, transform 0.8s ease-out",
      }}
    >
      <Layout>
        <CustomCursor />
        <Hero3D />
        <AnimatedStats />
        <AnimatedTimeline />
        <FloatingProfileCards />
        <EmployerSection />
        <TrustSection />
        <PricingSection />
        <FAQSection />
        <FinalCTA />
      </Layout>
    </div>
  );
};

export default Index;
