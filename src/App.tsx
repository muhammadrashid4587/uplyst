import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DemoModeProvider } from "@/contexts/DemoModeContext";
import WaitlistLanding from "./pages/WaitlistLanding";
import ComingSoon from "./pages/ComingSoon";
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
            {/* Waitlist Landing - Main entry point */}
            <Route path="/" element={<WaitlistLanding />} />
            
            {/* Coming Soon - All product features gated */}
            <Route path="/talent" element={<ComingSoon />} />
            <Route path="/talent/:id" element={<ComingSoon />} />
            <Route path="/employers" element={<ComingSoon />} />
            <Route path="/auth" element={<ComingSoon />} />
            <Route path="/dashboard" element={<ComingSoon />} />
            <Route path="/dashboard/*" element={<ComingSoon />} />
            
            {/* Placeholder pages */}
            <Route path="/privacy" element={<ComingSoon />} />
            <Route path="/terms" element={<ComingSoon />} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </DemoModeProvider>
  </QueryClientProvider>
);

export default App;
