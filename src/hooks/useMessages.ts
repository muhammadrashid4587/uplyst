import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender?: {
    display_name: string | null;
    avatar_url: string | null;
  };
}

export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  last_message?: Message;
  other_participant?: {
    user_id: string;
    display_name: string | null;
    avatar_url: string | null;
  };
  unread_count: number;
}

export function useConversations(userId: string | undefined) {
  const queryClient = useQueryClient();

  const { data: conversations, isLoading, error } = useQuery({
    queryKey: ["conversations", userId],
    queryFn: async () => {
      if (!userId) return [];

      // Get conversations the user is part of
      const { data: participations, error: partError } = await supabase
        .from("conversation_participants")
        .select("conversation_id")
        .eq("user_id", userId);

      if (partError) throw partError;
      if (!participations?.length) return [];

      const conversationIds = participations.map((p) => p.conversation_id);

      // Get conversations with their latest message
      const { data: convos, error: convosError } = await supabase
        .from("conversations")
        .select("*")
        .in("id", conversationIds)
        .order("updated_at", { ascending: false });

      if (convosError) throw convosError;

      // Get other participants and last messages for each conversation
      const enrichedConvos = await Promise.all(
        (convos || []).map(async (convo) => {
          // Get other participant
          const { data: participants } = await supabase
            .from("conversation_participants")
            .select("user_id")
            .eq("conversation_id", convo.id)
            .neq("user_id", userId);

          let otherParticipant = null;
          if (participants?.[0]) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("display_name, avatar_url")
              .eq("user_id", participants[0].user_id)
              .maybeSingle();

            otherParticipant = {
              user_id: participants[0].user_id,
              display_name: profile?.display_name || "Unknown User",
              avatar_url: profile?.avatar_url,
            };
          }

          // Get last message
          const { data: messages } = await supabase
            .from("messages")
            .select("*")
            .eq("conversation_id", convo.id)
            .order("created_at", { ascending: false })
            .limit(1);

          // Get unread count
          const { count } = await supabase
            .from("messages")
            .select("*", { count: "exact", head: true })
            .eq("conversation_id", convo.id)
            .eq("is_read", false)
            .neq("sender_id", userId);

          return {
            ...convo,
            last_message: messages?.[0] || null,
            other_participant: otherParticipant,
            unread_count: count || 0,
          } as Conversation;
        })
      );

      return enrichedConvos;
    },
    enabled: !!userId,
  });

  return { conversations, isLoading, error };
}

export function useMessages(conversationId: string | null, userId: string | undefined) {
  const queryClient = useQueryClient();
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  const { data: messages, isLoading, error } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      if (!conversationId) return [];

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Get sender profiles
      const senderIds = [...new Set(data?.map((m) => m.sender_id) || [])];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url")
        .in("user_id", senderIds);

      const profileMap = new Map(profiles?.map((p) => [p.user_id, p]) || []);

      return (data || []).map((message) => ({
        ...message,
        sender: profileMap.get(message.sender_id) || null,
      })) as Message[];
    },
    enabled: !!conversationId,
  });

  // Real-time subscription
  useEffect(() => {
    if (!conversationId) return;

    const newChannel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          console.log("New message received:", payload);
          
          // Get sender profile
          const { data: profile } = await supabase
            .from("profiles")
            .select("user_id, display_name, avatar_url")
            .eq("user_id", payload.new.sender_id)
            .maybeSingle();

          const newMessage: Message = {
            ...payload.new as Message,
            sender: profile || null,
          };

          queryClient.setQueryData(
            ["messages", conversationId],
            (old: Message[] | undefined) => [...(old || []), newMessage]
          );

          // Also refresh conversations to update last message
          queryClient.invalidateQueries({ queryKey: ["conversations"] });
        }
      )
      .subscribe();

    setChannel(newChannel);

    return () => {
      supabase.removeChannel(newChannel);
    };
  }, [conversationId, queryClient]);

  // Mark messages as read
  useEffect(() => {
    if (!conversationId || !userId || !messages?.length) return;

    const unreadMessages = messages.filter(
      (m) => !m.is_read && m.sender_id !== userId
    );

    if (unreadMessages.length > 0) {
      supabase
        .from("messages")
        .update({ is_read: true })
        .in(
          "id",
          unreadMessages.map((m) => m.id)
        )
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["conversations"] });
        });
    }
  }, [conversationId, userId, messages, queryClient]);

  return { messages, isLoading, error };
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      senderId,
      content,
    }: {
      conversationId: string;
      senderId: string;
      content: string;
    }) => {
      const { data, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          sender_id: senderId,
          content,
        })
        .select()
        .single();

      if (error) throw error;

      // Update conversation updated_at
      await supabase
        .from("conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", conversationId);

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      currentUserId,
      otherUserId,
    }: {
      currentUserId: string;
      otherUserId: string;
    }) => {
      // Create conversation
      const { data: convo, error: convoError } = await supabase
        .from("conversations")
        .insert({})
        .select()
        .single();

      if (convoError) throw convoError;

      // Add participants
      const { error: partError } = await supabase
        .from("conversation_participants")
        .insert([
          { conversation_id: convo.id, user_id: currentUserId },
          { conversation_id: convo.id, user_id: otherUserId },
        ]);

      if (partError) throw partError;

      return convo;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
