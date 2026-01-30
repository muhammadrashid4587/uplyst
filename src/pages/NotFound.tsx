import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SignalButton } from "@/components/ui/SignalButton";
import { Home, ArrowLeft, Search, HelpCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <GlassPanel className="max-w-lg w-full text-center p-8 md:p-12">
          {/* 404 Graphic */}
          <div className="relative mb-8">
            <div className="text-[120px] md:text-[160px] font-display font-black text-primary/20 leading-none select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <HelpCircle className="w-10 h-10 text-primary" />
              </div>
            </div>
          </div>

          {/* Message */}
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
            Page Not Found
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </p>

          {/* Attempted path */}
          <div className="mb-8 p-3 rounded-lg bg-muted/30 border border-border/30">
            <p className="text-sm text-muted-foreground">
              Requested path: <code className="text-primary">{location.pathname}</code>
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/">
              <SignalButton variant="primary" className="gap-2">
                <Home className="w-4 h-4" />
                Go Home
              </SignalButton>
            </Link>
            <SignalButton 
              variant="outline" 
              className="gap-2"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </SignalButton>
          </div>

          {/* Quick Links */}
          <div className="mt-8 pt-6 border-t border-border/30">
            <p className="text-sm text-muted-foreground mb-3">Quick links:</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/talent" className="text-sm text-primary hover:underline">
                Browse Talent
              </Link>
              <span className="text-border">•</span>
              <Link to="/dashboard/jobs" className="text-sm text-primary hover:underline">
                Find Jobs
              </Link>
              <span className="text-border">•</span>
              <Link to="/dashboard" className="text-sm text-primary hover:underline">
                Dashboard
              </Link>
            </div>
          </div>
        </GlassPanel>
      </div>
    </Layout>
  );
};

export default NotFound;
