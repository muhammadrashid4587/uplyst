import { useNavigate, useLocation, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { UplystLogo } from "./SignalLogo";
import { NavLink } from "./NavLink";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  User as UserIcon, 
  Briefcase, 
  MessageSquare, 
  Bell, 
  Settings, 
  LogOut,
  Star,
  Search,
  ChevronRight,
  FileText,
  MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUnreadCounts } from "@/hooks/useUnreadCounts";
import { Profile } from "@/hooks/useProfile";

interface DashboardSidebarProps {
  user: User | null;
  profile?: Profile | null;
  onSearchClick?: () => void;
}

const accountNavItems = [
  { title: "Profile", url: "/dashboard/profile", icon: UserIcon },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar({ user, profile, onSearchClick }: DashboardSidebarProps) {
  const { counts } = useUnreadCounts(user?.id);

  const mainNavItems = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, badge: null as number | null },
    { title: "Browse Jobs", url: "/dashboard/jobs", icon: Briefcase, badge: null as number | null },
    { title: "My Applications", url: "/dashboard/applications", icon: FileText, badge: null as number | null },
    { title: "Saved", url: "/dashboard/saved", icon: Star, badge: null as number | null },
    { title: "Messages", url: "/dashboard/messages", icon: MessageSquare, badge: counts.messages > 0 ? counts.messages : null },
    { title: "Notifications", url: "/dashboard/notifications", icon: Bell, badge: counts.notifications > 0 ? counts.notifications : null },
  ];
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  // Use profile data first, fallback to auth metadata
  const userName = profile?.display_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User";
  const userAvatar = profile?.avatar_url || user?.user_metadata?.avatar_url;
  const userTitle = profile?.title;
  const userLocation = profile?.location;

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon" className="border-r border-border/20 bg-card/50 backdrop-blur-xl">
      <SidebarHeader className="border-b border-border/20 p-4">
        <div className={cn("flex items-center gap-3 transition-all duration-300", collapsed && "justify-center")}>
          {!collapsed ? (
            <UplystLogo size="sm" />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/10">
              <span className="font-display text-primary font-bold text-base">S</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        {/* Search */}
        {!collapsed && (
          <div className="px-1 mb-6">
            <button
              onClick={onSearchClick}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-muted/30 border border-border/20 text-muted-foreground text-sm cursor-pointer hover:bg-muted/50 hover:border-primary/20 transition-all duration-200 group"
            >
              <Search className="w-4 h-4 group-hover:text-primary transition-colors" />
              <span className="group-hover:text-foreground transition-colors">Search...</span>
              <kbd className="ml-auto text-xs bg-background/50 px-1.5 py-0.5 rounded border border-border/30">⌘K</kbd>
            </button>
          </div>
        )}

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={cn(
            "text-xs uppercase tracking-wider text-muted-foreground/70 font-semibold mb-2 px-2",
            collapsed && "sr-only"
          )}>
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainNavItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                      className="p-0"
                    >
                      <NavLink 
                        to={item.url} 
                        end 
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden",
                          active 
                            ? "bg-gradient-to-r from-primary/15 to-primary/5 text-primary shadow-sm" 
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                        )}
                        activeClassName=""
                      >
                        {/* Active indicator bar */}
                        {active && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                        )}
                        
                        {/* Hover glow effect */}
                        <div className={cn(
                          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
                          !active && "bg-gradient-to-r from-primary/5 to-transparent"
                        )} />
                        
                        <div className="relative">
                          <item.icon className={cn(
                            "w-5 h-5 transition-all duration-200 relative z-10",
                            active ? "text-primary" : "group-hover:text-primary group-hover:scale-110"
                          )} />
                          {/* Badge for collapsed state */}
                          {collapsed && item.badge && (
                            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold bg-primary text-primary-foreground rounded-full px-1 animate-pulse">
                              {item.badge > 9 ? '9+' : item.badge}
                            </span>
                          )}
                        </div>
                        
                        {!collapsed && (
                          <>
                            <span className={cn(
                              "font-medium relative z-10 transition-colors flex-1",
                              active ? "text-primary" : ""
                            )}>
                              {item.title}
                            </span>
                            {/* Badge for expanded state */}
                            {item.badge && (
                              <span className="min-w-[20px] h-5 flex items-center justify-center text-xs font-bold bg-primary text-primary-foreground rounded-full px-1.5 relative z-10">
                                {item.badge > 9 ? '9+' : item.badge}
                              </span>
                            )}
                            <ChevronRight className={cn(
                              "w-4 h-4 opacity-0 -translate-x-2 transition-all duration-200 relative z-10",
                              active ? "opacity-100 translate-x-0 text-primary" : "group-hover:opacity-50 group-hover:translate-x-0"
                            )} />
                          </>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account Navigation */}
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className={cn(
            "text-xs uppercase tracking-wider text-muted-foreground/70 font-semibold mb-2 px-2",
            collapsed && "sr-only"
          )}>
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {accountNavItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                      className="p-0"
                    >
                      <NavLink 
                        to={item.url} 
                        end 
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden",
                          active 
                            ? "bg-gradient-to-r from-primary/15 to-primary/5 text-primary shadow-sm" 
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                        )}
                        activeClassName=""
                      >
                        {active && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                        )}
                        
                        <div className={cn(
                          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
                          !active && "bg-gradient-to-r from-primary/5 to-transparent"
                        )} />
                        
                        <item.icon className={cn(
                          "w-5 h-5 transition-all duration-200 relative z-10",
                          active ? "text-primary" : "group-hover:text-primary group-hover:scale-110"
                        )} />
                        
                        {!collapsed && (
                          <>
                            <span className={cn(
                              "font-medium relative z-10 transition-colors",
                              active ? "text-primary" : ""
                            )}>
                              {item.title}
                            </span>
                            <ChevronRight className={cn(
                              "w-4 h-4 ml-auto opacity-0 -translate-x-2 transition-all duration-200 relative z-10",
                              active ? "opacity-100 translate-x-0 text-primary" : "group-hover:opacity-50 group-hover:translate-x-0"
                            )} />
                          </>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/20 p-3">
        {/* User Profile Card */}
        <Link
          to="/dashboard/profile"
          className={cn(
            "flex items-center gap-3 p-2.5 rounded-xl bg-muted/20 border border-border/20 mb-2 transition-all duration-200 hover:bg-muted/40 hover:border-primary/20 cursor-pointer group",
            collapsed && "justify-center p-2"
          )}
        >
          <Avatar className={cn("w-9 h-9 border-2 border-primary/20 group-hover:border-primary/40 transition-colors", collapsed && "w-8 h-8")}>
            <AvatarImage src={userAvatar || undefined} alt={userName} />
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-medium">
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{userName}</p>
              {userTitle ? (
                <p className="text-xs text-muted-foreground truncate">{userTitle}</p>
              ) : userLocation ? (
                <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {userLocation}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              )}
            </div>
          )}
        </Link>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground transition-all duration-200 group relative overflow-hidden",
            "hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="w-5 h-5 transition-transform duration-200 group-hover:scale-110 group-hover:-translate-x-0.5" />
          {!collapsed && <span className="font-medium">Sign Out</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
