import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DemoModeProvider } from "@/contexts/DemoModeContext";
import IntroPage from "./pages/IntroPage";
import WaitlistLanding from "./pages/WaitlistLanding";
import ComingSoon from "./pages/ComingSoon";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DemoModeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Intro Animation Page */}
            <Route path="/" element={<IntroPage />} />
            
            {/* Waitlist Landing - Main content */}
            <Route path="/home" element={<WaitlistLanding />} />
            
            {/* Legal Pages */}
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            
            {/* Coming Soon - All product features gated */}
            <Route path="/talent" element={<ComingSoon />} />
            <Route path="/talent/:id" element={<ComingSoon />} />
            <Route path="/employers" element={<ComingSoon />} />
            <Route path="/auth" element={<ComingSoon />} />
            <Route path="/dashboard" element={<ComingSoon />} />
            <Route path="/dashboard/*" element={<ComingSoon />} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </DemoModeProvider>
  </QueryClientProvider>
);

export default App;
