import { DashboardLayout } from "@/components/DashboardLayout";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Bell, Check, Briefcase, MessageSquare, Star, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const notifications = [
  { id: 1, type: "application", title: "Application Received", message: "TechCorp has received your application for Senior Frontend Developer", time: "2 hours ago", read: false, icon: Briefcase },
  { id: 2, type: "message", title: "New Message", message: "Sarah from TechCorp sent you a message", time: "5 hours ago", read: false, icon: MessageSquare },
  { id: 3, type: "saved", title: "Job Updated", message: "A job you saved has been updated - Product Designer at DesignCo", time: "1 day ago", read: true, icon: Star },
  { id: 4, type: "profile", title: "Profile View", message: "Your profile was viewed by 3 recruiters this week", time: "2 days ago", read: true, icon: UserCheck },
];

const DashboardNotifications = () => {
  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
              Notifications
            </h1>
            <p className="text-muted-foreground">Stay updated on your activity</p>
          </div>
          <button className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
            <Check className="w-4 h-4" />
            Mark all as read
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.map((notif) => (
            <GlassPanel 
              key={notif.id} 
              className={cn(
                "p-4 transition-all cursor-pointer",
                !notif.read && "border-primary/20 bg-primary/5"
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                  !notif.read ? "bg-primary/20" : "bg-muted/50"
                )}>
                  <notif.icon className={cn(
                    "w-5 h-5",
                    !notif.read ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={cn(
                      "font-medium",
                      !notif.read ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {notif.title}
                    </h3>
                    {!notif.read && (
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{notif.message}</p>
                  <p className="text-xs text-muted-foreground/70 mt-2">{notif.time}</p>
                </div>
              </div>
            </GlassPanel>
          ))}
        </div>

        {notifications.length === 0 && (
          <GlassPanel className="p-12 text-center">
            <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No notifications</h3>
            <p className="text-muted-foreground">
              You're all caught up! Check back later for updates.
            </p>
          </GlassPanel>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardNotifications;
