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
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Index = () => {
  const location = useLocation();
  const [isSliding, setIsSliding] = useState(false);
  
  useEffect(() => {
    // Check if we came from the intro page
    const fromIntro = sessionStorage.getItem("fromIntro");
    if (fromIntro) {
      setIsSliding(true);
      sessionStorage.removeItem("fromIntro");
      // Remove sliding state after animation completes
      const timer = setTimeout(() => {
        setIsSliding(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <div
      style={{
        transform: isSliding ? "translateY(0)" : undefined,
        animation: isSliding ? "slideInFromBottom 0.8s ease-out forwards" : undefined,
      }}
    >
      <style>
        {`
          @keyframes slideInFromBottom {
            from {
              transform: translateY(100px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}
      </style>
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
