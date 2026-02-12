import { useEffect } from "react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { CustomCursor } from "@/components/CustomCursor";
import { WaitlistNav } from "@/components/waitlist/WaitlistNav";
import { WaitlistHero } from "@/components/waitlist/WaitlistHero";
import { HowItWorks } from "@/components/waitlist/HowItWorks";
import { WhyThisExists } from "@/components/waitlist/WhyThisExists";
import { ProductPreview } from "@/components/waitlist/ProductPreview";
import { WaitlistTrust } from "@/components/waitlist/WaitlistTrust";
import { RoadmapTimeline } from "@/components/waitlist/RoadmapTimeline";
import { WaitlistFAQ } from "@/components/waitlist/WaitlistFAQ";
import { WaitlistForm } from "@/components/waitlist/WaitlistForm";
import { FutureSignal } from "@/components/waitlist/FutureSignal";
import { WaitlistFooter } from "@/components/waitlist/WaitlistFooter";
import { CompanyMarquee } from "@/components/waitlist/CompanyMarquee";
import { GlobeSection } from "@/components/waitlist/GlobeSection";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

const WaitlistLanding = () => {
  useSmoothScroll();

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="min-h-screen flex flex-col noise-overlay relative animate-fade-in">
      <CustomCursor />
      <AnimatedBackground />
      <WaitlistNav />
      <main className="flex-1 pt-16 md:pt-20 relative z-10">
        <WaitlistHero />
        <CompanyMarquee direction="left" speed={35} className="mt-8" />
        <HowItWorks />
        <CompanyMarquee direction="right" speed={45} className="opacity-60" />
        <WhyThisExists />
        <GlobeSection />
        <div id="products">
          <ProductPreview />
        </div>
        <CompanyMarquee direction="left" speed={50} className="opacity-40" />
        <WaitlistTrust />
        <RoadmapTimeline />
        <WaitlistFAQ />
        <WaitlistForm />
        <FutureSignal />
      </main>
      <WaitlistFooter />
    </div>
  );
};

export default WaitlistLanding;
