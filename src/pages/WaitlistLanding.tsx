import { useEffect } from "react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { WaitlistNav } from "@/components/waitlist/WaitlistNav";
import { WaitlistHero } from "@/components/waitlist/WaitlistHero";
import { ProductPreview } from "@/components/waitlist/ProductPreview";
import { WaitlistTrust } from "@/components/waitlist/WaitlistTrust";
import { RoadmapTimeline } from "@/components/waitlist/RoadmapTimeline";
import { WaitlistFAQ } from "@/components/waitlist/WaitlistFAQ";
import { WaitlistForm } from "@/components/waitlist/WaitlistForm";
import { WaitlistFooter } from "@/components/waitlist/WaitlistFooter";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

const WaitlistLanding = () => {
  useSmoothScroll();

  useEffect(() => {
    // Apply dark mode by default
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="min-h-screen flex flex-col noise-overlay relative">
      <AnimatedBackground />
      <WaitlistNav />
      <main className="flex-1 pt-16 md:pt-20 relative z-10">
        <WaitlistHero />
        <div id="products">
          <ProductPreview />
        </div>
        <WaitlistTrust />
        <RoadmapTimeline />
        <WaitlistFAQ />
        <WaitlistForm />
      </main>
      <WaitlistFooter />
    </div>
  );
};

export default WaitlistLanding;
