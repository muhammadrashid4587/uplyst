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

const Index = () => {
  return (
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
  );
};

export default Index;
