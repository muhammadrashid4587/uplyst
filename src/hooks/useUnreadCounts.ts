import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";

export interface UnreadCounts {
  messages: number;
  notifications: number;
}

export function useUnreadCounts(userId: string | undefined) {
  const queryClient = useQueryClient();
  const [channels, setChannels] = useState<RealtimeChannel[]>([]);

  const { data: counts, isLoading } = useQuery({
    queryKey: ["unread-counts", userId],
    queryFn: async (): Promise<UnreadCounts> => {
      if (!userId) return { messages: 0, notifications: 0 };

      // Get unread messages count
      // First get all conversations the user is part of
      const { data: participations } = await supabase
        .from("conversation_participants")
        .select("conversation_id")
        .eq("user_id", userId);

      let messagesCount = 0;
      if (participations?.length) {
        const conversationIds = participations.map((p) => p.conversation_id);
        
        const { count } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .in("conversation_id", conversationIds)
          .eq("is_read", false)
          .neq("sender_id", userId);

        messagesCount = count || 0;
      }

      // Get unread notifications count
      const { count: notificationsCount } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("is_read", false);

      return {
        messages: messagesCount,
        notifications: notificationsCount || 0,
      };
    },
    enabled: !!userId,
    refetchInterval: 30000, // Refetch every 30 seconds as backup
  });

  // Real-time subscriptions
  useEffect(() => {
    if (!userId) return;

    const newChannels: RealtimeChannel[] = [];

    // Subscribe to messages changes
    const messagesChannel = supabase
      .channel(`unread-messages-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        () => {
          console.log("Messages changed, refreshing unread counts");
          queryClient.invalidateQueries({ queryKey: ["unread-counts", userId] });
        }
      )
      .subscribe();

    newChannels.push(messagesChannel);

    // Subscribe to notifications changes
    const notificationsChannel = supabase
      .channel(`unread-notifications-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          console.log("Notifications changed, refreshing unread counts");
          queryClient.invalidateQueries({ queryKey: ["unread-counts", userId] });
        }
      )
      .subscribe();

    newChannels.push(notificationsChannel);
    setChannels(newChannels);

    return () => {
      newChannels.forEach((channel) => supabase.removeChannel(channel));
    };
  }, [userId, queryClient]);

  return {
    counts: counts || { messages: 0, notifications: 0 },
    isLoading,
  };
}
