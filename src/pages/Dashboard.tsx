import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Layout } from "@/components/Layout";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SignalButton } from "@/components/ui/SignalButton";
import { 
  User as UserIcon, 
  Settings, 
  Bell, 
  Briefcase, 
  Star, 
  MessageSquare,
  TrendingUp,
  Calendar
} from "lucide-react";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </Layout>
    );
  }

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
    <Layout>
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Welcome Header */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-2">
              {userAvatar ? (
                <img 
                  src={userAvatar} 
                  alt={userName}
                  className="w-16 h-16 rounded-full border-2 border-primary/30"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/30">
                  <UserIcon className="w-8 h-8 text-primary" />
                </div>
              )}
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                  Welcome back, {userName}!
                </h1>
                <p className="text-muted-foreground">{userEmail}</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {quickStats.map((stat, index) => (
              <GlassPanel 
                key={stat.label} 
                className="p-4 text-center"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </GlassPanel>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Profile Card */}
            <GlassPanel className="p-6 md:col-span-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-display font-semibold text-foreground">Your Profile</h2>
                <Settings className="w-5 h-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              </div>
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
            <GlassPanel className="p-6 md:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-display font-semibold text-foreground">Recent Activity</h2>
                <Bell className="w-5 h-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 border border-border/30">
                  <Star className="w-8 h-8 text-accent" />
                  <div>
                    <p className="font-medium text-foreground">Welcome to Signal!</p>
                    <p className="text-sm text-muted-foreground">
                      Get started by completing your profile and exploring opportunities.
                    </p>
                  </div>
                </div>
                <div className="text-center py-8 text-muted-foreground">
                  <p>No recent activity yet.</p>
                  <p className="text-sm">Start exploring to see your activity here!</p>
                </div>
              </div>
            </GlassPanel>

            {/* Quick Actions */}
            <GlassPanel className="p-6 md:col-span-3">
              <h2 className="text-lg font-display font-semibold text-foreground mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SignalButton variant="outline" className="h-auto py-4 flex-col gap-2">
                  <Briefcase className="w-6 h-6" />
                  <span>Browse Jobs</span>
                </SignalButton>
                <SignalButton variant="outline" className="h-auto py-4 flex-col gap-2">
                  <UserIcon className="w-6 h-6" />
                  <span>Edit Profile</span>
                </SignalButton>
                <SignalButton variant="outline" className="h-auto py-4 flex-col gap-2">
                  <MessageSquare className="w-6 h-6" />
                  <span>Messages</span>
                </SignalButton>
                <SignalButton variant="outline" className="h-auto py-4 flex-col gap-2">
                  <Settings className="w-6 h-6" />
                  <span>Settings</span>
                </SignalButton>
              </div>
            </GlassPanel>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
