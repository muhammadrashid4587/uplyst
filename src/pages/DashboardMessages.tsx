import { DashboardLayout } from "@/components/DashboardLayout";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { MessageSquare, Search, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const conversations = [
  { id: 1, name: "Sarah from TechCorp", message: "Thanks for applying! We'd love to schedule...", time: "2h ago", unread: true, avatar: null },
  { id: 2, name: "Mike Johnson", message: "Great portfolio! I noticed your work on...", time: "1d ago", unread: false, avatar: null },
  { id: 3, name: "DesignCo Recruiting", message: "Your application has been received.", time: "3d ago", unread: false, avatar: null },
];

const DashboardMessages = () => {
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
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search messages..." 
                className="pl-10 bg-muted/30 border-border/30"
              />
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {conversations.map((convo) => (
                <div 
                  key={convo.id}
                  className={cn(
                    "p-3 rounded-xl cursor-pointer transition-all",
                    convo.unread 
                      ? "bg-primary/10 border border-primary/20" 
                      : "hover:bg-muted/40"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-accent">{convo.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={cn("font-medium truncate", convo.unread && "text-primary")}>
                          {convo.name}
                        </p>
                        <span className="text-xs text-muted-foreground">{convo.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{convo.message}</p>
                    </div>
                    {convo.unread && (
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>

          {/* Message Area */}
          <GlassPanel className="p-6 lg:col-span-2 flex flex-col">
            <div className="flex-1 flex items-center justify-center text-center">
              <div>
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Select a conversation</h3>
                <p className="text-muted-foreground">Choose a conversation from the list to view messages</p>
              </div>
            </div>
            <div className="border-t border-border/30 pt-4 mt-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="Type your message..." 
                  className="bg-muted/30 border-border/30"
                  disabled
                />
                <button className="p-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50" disabled>
                  <Send className="w-5 h-5" />
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
