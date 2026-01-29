import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Bell, Check, Briefcase, MessageSquare, Star, UserCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  link: string | null;
  created_at: string;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "application":
      return Briefcase;
    case "message":
      return MessageSquare;
    case "saved":
      return Star;
    case "profile":
      return UserCheck;
    default:
      return Bell;
  }
};

const NotificationSkeleton = () => (
  <GlassPanel className="p-4">
    <div className="flex items-start gap-4">
      <Skeleton className="w-10 h-10 rounded-xl" />
      <div className="flex-1">
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-3 w-64 mb-2" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  </GlassPanel>
);

const DashboardNotifications = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id || null);
    });
  }, []);

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications", userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Notification[];
    },
    enabled: !!userId,
  });

  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-counts"] });
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      if (!userId) return;

      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", userId)
        .eq("is_read", false);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-counts"] });
      toast({
        title: "All caught up!",
        description: "All notifications have been marked as read.",
      });
    },
  });

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markAsRead.mutate(notification.id);
    }
  };

  const unreadCount = notifications?.filter((n) => !n.is_read).length || 0;

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
          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead.mutate()}
              disabled={markAllAsRead.isPending}
              className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1 disabled:opacity-50"
            >
              {markAllAsRead.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {isLoading ? (
            <>
              <NotificationSkeleton />
              <NotificationSkeleton />
              <NotificationSkeleton />
            </>
          ) : notifications?.length === 0 ? (
            <GlassPanel className="p-12 text-center">
              <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No notifications</h3>
              <p className="text-muted-foreground">
                You're all caught up! Check back later for updates.
              </p>
            </GlassPanel>
          ) : (
            notifications?.map((notif) => {
              const Icon = getNotificationIcon(notif.type);
              return (
                <GlassPanel
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={cn(
                    "p-4 transition-all cursor-pointer",
                    !notif.is_read && "border-primary/20 bg-primary/5"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                        !notif.is_read ? "bg-primary/20" : "bg-muted/50"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-5 h-5",
                          !notif.is_read ? "text-primary" : "text-muted-foreground"
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3
                          className={cn(
                            "font-medium",
                            !notif.is_read ? "text-foreground" : "text-muted-foreground"
                          )}
                        >
                          {notif.title}
                        </h3>
                        {!notif.is_read && <div className="w-2 h-2 bg-primary rounded-full" />}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{notif.message}</p>
                      <p className="text-xs text-muted-foreground/70 mt-2">
                        {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </GlassPanel>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardNotifications;
