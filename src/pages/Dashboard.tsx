import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { DashboardLayout } from "@/components/DashboardLayout";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SignalButton } from "@/components/ui/SignalButton";
import { 
  User as UserIcon, 
  Star, 
  TrendingUp,
  Calendar,
  Briefcase,
  MessageSquare
} from "lucide-react";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User";
  const userAvatar = user?.user_metadata?.avatar_url;
  const userEmail = user?.email;

  const quickStats = [
    { label: "Profile Views", value: "0", icon: TrendingUp, color: "text-primary" },
    { label: "Saved Jobs", value: "0", icon: Briefcase, color: "text-accent" },
    { label: "Messages", value: "0", icon: MessageSquare, color: "text-primary" },
    { label: "Interviews", value: "0", icon: Calendar, color: "text-accent" },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            {userAvatar ? (
              <img 
                src={userAvatar} 
                alt={userName}
                className="w-14 h-14 rounded-full border-2 border-primary/30"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/30">
                <UserIcon className="w-7 h-7 text-primary" />
              </div>
            )}
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Welcome back, {userName}!
              </h1>
              <p className="text-muted-foreground text-sm">{userEmail}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, index) => (
            <GlassPanel 
              key={stat.label} 
              className="p-4 text-center hover:border-primary/30 transition-colors"
            >
              <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </GlassPanel>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <GlassPanel className="p-6">
            <h2 className="text-lg font-display font-semibold text-foreground mb-4">Your Profile</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {userAvatar ? (
                  <img 
                    src={userAvatar} 
                    alt={userName}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-primary" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-foreground">{userName}</p>
                  <p className="text-sm text-muted-foreground">Complete your profile</p>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '20%' }} />
              </div>
              <p className="text-xs text-muted-foreground">Profile 20% complete</p>
              <SignalButton variant="outline" size="sm" className="w-full justify-center">
                Edit Profile
              </SignalButton>
            </div>
          </GlassPanel>

          {/* Recent Activity */}
          <GlassPanel className="p-6 lg:col-span-2">
            <h2 className="text-lg font-display font-semibold text-foreground mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 border border-border/30">
                <Star className="w-8 h-8 text-accent flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Welcome to Signal!</p>
                  <p className="text-sm text-muted-foreground">
                    Get started by completing your profile and exploring opportunities.
                  </p>
                </div>
              </div>
              <div className="text-center py-6 text-muted-foreground">
                <p>No recent activity yet.</p>
                <p className="text-sm">Start exploring to see your activity here!</p>
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
