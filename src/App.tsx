import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TalentDirectory from "./pages/TalentDirectory";
import TalentProfile from "./pages/TalentProfile";
import EmployerPortal from "./pages/EmployerPortal";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import DashboardJobs from "./pages/DashboardJobs";
import DashboardApplications from "./pages/DashboardApplications";
import DashboardSaved from "./pages/DashboardSaved";
import DashboardMessages from "./pages/DashboardMessages";
import DashboardNotifications from "./pages/DashboardNotifications";
import DashboardProfile from "./pages/DashboardProfile";
import DashboardSettings from "./pages/DashboardSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/talent" element={<TalentDirectory />} />
          <Route path="/talent/:id" element={<TalentProfile />} />
          <Route path="/employers" element={<EmployerPortal />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/jobs" element={<DashboardJobs />} />
          <Route path="/dashboard/applications" element={<DashboardApplications />} />
          <Route path="/dashboard/saved" element={<DashboardSaved />} />
          <Route path="/dashboard/messages" element={<DashboardMessages />} />
          <Route path="/dashboard/notifications" element={<DashboardNotifications />} />
          <Route path="/dashboard/profile" element={<DashboardProfile />} />
          <Route path="/dashboard/settings" element={<DashboardSettings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
