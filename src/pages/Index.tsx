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

interface StaggeredSectionProps {
  children: React.ReactNode;
  delay: number;
  isAnimating: boolean;
}

const StaggeredSection = ({ children, delay, isAnimating }: StaggeredSectionProps) => {
  const [isVisible, setIsVisible] = useState(!isAnimating);
  
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, delay]);
  
  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(60px)",
        transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
      }}
    >
      {children}
    </div>
  );
};

const Index = () => {
  // Check sessionStorage synchronously before first render
  const shouldSlide = useRef(
    typeof window !== "undefined" && sessionStorage.getItem("fromIntro") === "true"
  );
  const [isAnimating, setIsAnimating] = useState(shouldSlide.current);
  
  useEffect(() => {
    if (shouldSlide.current) {
      sessionStorage.removeItem("fromIntro");
      // Keep animating state for staggered children
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 1500); // After all stagger animations complete
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div>
      <Layout>
        <CustomCursor />
        <StaggeredSection delay={0} isAnimating={isAnimating}>
          <Hero3D />
        </StaggeredSection>
        <StaggeredSection delay={100} isAnimating={isAnimating}>
          <AnimatedStats />
        </StaggeredSection>
        <StaggeredSection delay={200} isAnimating={isAnimating}>
          <AnimatedTimeline />
        </StaggeredSection>
        <StaggeredSection delay={300} isAnimating={isAnimating}>
          <FloatingProfileCards />
        </StaggeredSection>
        <StaggeredSection delay={400} isAnimating={isAnimating}>
          <EmployerSection />
        </StaggeredSection>
        <StaggeredSection delay={500} isAnimating={isAnimating}>
          <TrustSection />
        </StaggeredSection>
        <StaggeredSection delay={600} isAnimating={isAnimating}>
          <PricingSection />
        </StaggeredSection>
        <StaggeredSection delay={700} isAnimating={isAnimating}>
          <FAQSection />
        </StaggeredSection>
        <StaggeredSection delay={800} isAnimating={isAnimating}>
          <FinalCTA />
        </StaggeredSection>
      </Layout>
    </div>
  );
};

export default Index;
