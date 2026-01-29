import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { MessageSquare, Search, Send, Loader2, Plus, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useConversations, useMessages, useSendMessage, useCreateConversation, Message } from "@/hooks/useMessages";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
const ConversationSkeleton = () => (
  <div className="p-3 rounded-xl">
    <div className="flex items-start gap-3">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  </div>
);

const MessageBubble = ({ message, isOwn }: { message: Message; isOwn: boolean }) => (
  <div className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
    <div
      className={cn(
        "max-w-[70%] px-4 py-2.5 rounded-2xl",
        isOwn
          ? "bg-primary text-primary-foreground rounded-br-sm"
          : "bg-muted text-foreground rounded-bl-sm"
      )}
    >
      <p className="text-sm">{message.content}</p>
      <p className={cn(
        "text-xs mt-1",
        isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
      )}>
        {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
      </p>
    </div>
  </div>
);

const DashboardMessages = () => {
  const [userId, setUserId] = useState<string | undefined>();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [newConvoDialogOpen, setNewConvoDialogOpen] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { conversations, isLoading: convosLoading } = useConversations(userId);
  const { messages, isLoading: messagesLoading } = useMessages(selectedConversation, userId);
  const sendMessage = useSendMessage();
  const createConversation = useCreateConversation();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id);
    });
  }, []);

  // Fetch all users for new conversation
  const { data: allUsers } = useQuery({
    queryKey: ["users-for-messaging", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url")
        .neq("user_id", userId);
      if (error) throw error;
      return data;
    },
    enabled: !!userId && newConvoDialogOpen,
  });

  const filteredUsers = allUsers?.filter((user) =>
    user.display_name?.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const handleStartConversation = async (otherUserId: string) => {
    if (!userId) return;

    // Check if conversation already exists
    const existingConvo = conversations?.find(
      (c) => c.other_participant?.user_id === otherUserId
    );

    if (existingConvo) {
      setSelectedConversation(existingConvo.id);
      setNewConvoDialogOpen(false);
      return;
    }

    try {
      const newConvo = await createConversation.mutateAsync({
        currentUserId: userId,
        otherUserId,
      });
      setSelectedConversation(newConvo.id);
      setNewConvoDialogOpen(false);
      toast({
        title: "Conversation started",
        description: "You can now send messages.",
      });
    } catch (error) {
      console.error("Failed to create conversation:", error);
      toast({
        title: "Error",
        description: "Failed to start conversation. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !userId) return;

    try {
      await sendMessage.mutateAsync({
        conversationId: selectedConversation,
        senderId: userId,
        content: newMessage.trim(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversations?.filter((convo) =>
    convo.other_participant?.display_name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const selectedConvo = conversations?.find((c) => c.id === selectedConversation);

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 h-[calc(100vh-3.5rem)]">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
            Messages
          </h1>
          <p className="text-muted-foreground">Your conversations with recruiters and employers</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100%-6rem)]">
          {/* Conversation List */}
          <GlassPanel className="p-4 lg:col-span-1 overflow-hidden flex flex-col">
            <Dialog open={newConvoDialogOpen} onOpenChange={setNewConvoDialogOpen}>
              <DialogTrigger asChild>
                <button className="w-full mb-4 p-3 rounded-xl bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30 transition-colors flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">New Conversation</span>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Start a conversation</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      className="pl-10"
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {!filteredUsers?.length ? (
                      <div className="text-center py-8">
                        <Users className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
                        <p className="text-muted-foreground text-sm">No users found</p>
                      </div>
                    ) : (
                      filteredUsers.map((user) => (
                        <button
                          key={user.user_id}
                          onClick={() => handleStartConversation(user.user_id)}
                          disabled={createConversation.isPending}
                          className="w-full p-3 rounded-xl hover:bg-muted/50 transition-colors flex items-center gap-3 text-left"
                        >
                          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-medium text-accent">
                              {user.display_name?.charAt(0) || "?"}
                            </span>
                          </div>
                          <span className="font-medium text-foreground">
                            {user.display_name || "Unknown User"}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                className="pl-10 bg-muted/30 border-border/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {convosLoading ? (
                <>
                  <ConversationSkeleton />
                  <ConversationSkeleton />
                  <ConversationSkeleton />
                </>
              ) : !filteredConversations?.length ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-muted-foreground text-sm">No conversations yet</p>
                </div>
              ) : (
                filteredConversations.map((convo) => (
                  <div
                    key={convo.id}
                    onClick={() => setSelectedConversation(convo.id)}
                    className={cn(
                      "p-3 rounded-xl cursor-pointer transition-all",
                      selectedConversation === convo.id
                        ? "bg-primary/20 border border-primary/30"
                        : convo.unread_count > 0
                        ? "bg-primary/10 border border-primary/20"
                        : "hover:bg-muted/40"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-accent">
                          {convo.other_participant?.display_name?.charAt(0) || "?"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p
                            className={cn(
                              "font-medium truncate",
                              convo.unread_count > 0 && "text-primary"
                            )}
                          >
                            {convo.other_participant?.display_name || "Unknown"}
                          </p>
                          {convo.last_message && (
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(convo.last_message.created_at), {
                                addSuffix: false,
                              })}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {convo.last_message?.content || "No messages yet"}
                        </p>
                      </div>
                      {convo.unread_count > 0 && (
                        <div className="min-w-[1.25rem] h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-medium text-primary-foreground px-1">
                            {convo.unread_count > 9 ? "9+" : convo.unread_count}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassPanel>

          {/* Message Area */}
          <GlassPanel className="p-6 lg:col-span-2 flex flex-col">
            {!selectedConversation ? (
              <div className="flex-1 flex items-center justify-center text-center">
                <div>
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-muted-foreground">
                    Choose a conversation from the list to view messages
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Conversation Header */}
                <div className="border-b border-border/30 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <span className="text-sm font-medium text-accent">
                        {selectedConvo?.other_participant?.display_name?.charAt(0) || "?"}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {selectedConvo?.other_participant?.display_name || "Unknown"}
                      </h3>
                      <p className="text-xs text-muted-foreground">Active now</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                  {messagesLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  ) : !messages?.length ? (
                    <div className="flex items-center justify-center h-full text-center">
                      <div>
                        <MessageSquare className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                        <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                      </div>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        isOwn={message.sender_id === userId}
                      />
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </>
            )}

            {/* Message Input */}
            <div className="border-t border-border/30 pt-4 mt-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  className="bg-muted/30 border-border/30"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={!selectedConversation || sendMessage.isPending}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!selectedConversation || !newMessage.trim() || sendMessage.isPending}
                  className="p-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {sendMessage.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardMessages;
