import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SignalButton } from "@/components/ui/SignalButton";
import { UplystLogo } from "@/components/UplystLogo";
import { Lock, Sparkles, ArrowLeft } from "lucide-react";

const ComingSoon = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center noise-overlay relative p-4">
      <AnimatedBackground />
      
      <div className="relative z-10 w-full max-w-md">
        <GlassPanel className="text-center p-8 md:p-12">
          <div className="mb-8">
            <UplystLogo size="lg" />
          </div>
          
          <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          
          <h1 className="text-3xl font-display font-bold mb-4">
            Coming Soon
          </h1>
          
          <p className="text-muted-foreground mb-8">
            This feature is currently under development. Join our waitlist to be notified when it launches.
          </p>
          
          <div className="flex flex-col gap-3">
            <SignalButton 
              variant="primary" 
              size="lg"
              onClick={() => navigate("/")}
              className="w-full font-display uppercase tracking-wider"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Join the Waitlist
            </SignalButton>
            
            <SignalButton 
              variant="ghost" 
              size="md"
              onClick={() => navigate(-1)}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </SignalButton>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};

export default ComingSoon;
