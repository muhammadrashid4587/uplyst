import { useState, useEffect, ReactNode } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { AnimatedBackground } from "./AnimatedBackground";
import { SearchCommand, useSearchCommand } from "./SearchCommand";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Search, User as UserIcon } from "lucide-react";
import { useProfile, Profile } from "@/hooks/useProfile";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { open: searchOpen, setOpen: setSearchOpen } = useSearchCommand();
  
  const { profile } = useProfile(user?.id);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session?.user) {
          navigate("/auth");
        } else {
          setUser(session.user);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const displayName = profile?.display_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User";
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background noise-overlay relative">
        <AnimatedBackground />
        
        <DashboardSidebar user={user} profile={profile} onSearchClick={() => setSearchOpen(true)} />
        
        <SidebarInset className="flex-1">
          {/* Top Header Bar */}
          <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-border/30 bg-background/80 backdrop-blur-xl px-4">
            <SidebarTrigger className="-ml-1" />
            
            {/* Search Bar in Header */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex-1 max-w-md flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/30 border border-border/30 text-muted-foreground text-sm hover:bg-muted/50 hover:border-primary/20 transition-all cursor-pointer group"
            >
              <Search className="w-4 h-4 group-hover:text-primary transition-colors" />
              <span className="group-hover:text-foreground transition-colors">Search...</span>
              <kbd className="ml-auto text-xs bg-background/50 px-1.5 py-0.5 rounded border border-border/30 hidden sm:inline-block">⌘K</kbd>
            </button>
            
            <div className="flex-1" />
            
            <button className="p-2 rounded-lg hover:bg-muted/50 transition-colors relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            </button>
            
            {/* User Profile in Header */}
            <Link 
              to="/dashboard/profile"
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-lg hover:bg-muted/50 transition-colors group"
            >
              <Avatar className="w-8 h-8 border border-border/30 group-hover:border-primary/30 transition-colors">
                <AvatarImage src={avatarUrl || undefined} alt={displayName} />
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground hidden md:block">{displayName}</span>
            </Link>
          </header>

          {/* Main Content */}
          <main className="flex-1 relative z-10">
            {children}
          </main>
        </SidebarInset>
        
        {/* Search Command Dialog */}
        <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
      </div>
    </SidebarProvider>
  );
}
