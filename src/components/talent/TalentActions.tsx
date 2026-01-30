import { useState } from "react";
import { Heart, MessageSquare, Users, MoreHorizontal, Bookmark, Send } from "lucide-react";
import { SignalButton } from "@/components/ui/SignalButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface TalentActionsProps {
  talentId: string;
  talentName: string;
  onSave?: (id: string) => void;
  onShortlist?: (id: string) => void;
  onMessage?: (id: string, message: string) => void;
  onCompare?: (id: string) => void;
  isSaved?: boolean;
  isShortlisted?: boolean;
  variant?: "card" | "profile";
  className?: string;
}

export function TalentActions({
  talentId,
  talentName,
  onSave,
  onShortlist,
  onMessage,
  onCompare,
  isSaved = false,
  isShortlisted = false,
  variant = "card",
  className,
}: TalentActionsProps) {
  const [saved, setSaved] = useState(isSaved);
  const [shortlisted, setShortlisted] = useState(isShortlisted);
  const [messageOpen, setMessageOpen] = useState(false);
  const [messageText, setMessageText] = useState("");

  const handleSave = () => {
    setSaved(!saved);
    onSave?.(talentId);
    toast({
      title: saved ? "Removed from saved" : "Saved candidate",
      description: saved 
        ? `${talentName} has been removed from your saved list`
        : `${talentName} has been added to your saved list`,
    });
  };

  const handleShortlist = () => {
    setShortlisted(!shortlisted);
    onShortlist?.(talentId);
    toast({
      title: shortlisted ? "Removed from shortlist" : "Added to shortlist",
      description: shortlisted 
        ? `${talentName} has been removed from your shortlist`
        : `${talentName} has been added to your shortlist`,
    });
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      onMessage?.(talentId, messageText);
      toast({
        title: "Message sent",
        description: `Your intro message has been sent to ${talentName}`,
      });
      setMessageOpen(false);
      setMessageText("");
    }
  };

  const handleCompare = () => {
    onCompare?.(talentId);
    toast({
      title: "Added to comparison",
      description: `${talentName} has been added to your comparison list`,
    });
  };

  if (variant === "card") {
    return (
      <>
        <div className={cn("flex items-center gap-2", className)}>
          <button
            onClick={handleSave}
            className={cn(
              "p-2 rounded-lg transition-all",
              saved 
                ? "bg-primary/20 text-primary" 
                : "bg-muted/30 text-muted-foreground hover:text-primary hover:bg-primary/10"
            )}
            title={saved ? "Remove from saved" : "Save candidate"}
          >
            <Bookmark className={cn("w-4 h-4", saved && "fill-current")} />
          </button>
          <button
            onClick={handleShortlist}
            className={cn(
              "p-2 rounded-lg transition-all",
              shortlisted 
                ? "bg-primary/20 text-primary" 
                : "bg-muted/30 text-muted-foreground hover:text-primary hover:bg-primary/10"
            )}
            title={shortlisted ? "Remove from shortlist" : "Add to shortlist"}
          >
            <Heart className={cn("w-4 h-4", shortlisted && "fill-current")} />
          </button>
          <button
            onClick={() => setMessageOpen(true)}
            className="p-2 rounded-lg bg-muted/30 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
            title="Send intro message"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-lg bg-muted/30 text-muted-foreground hover:text-foreground transition-all">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleCompare}>
                <Users className="w-4 h-4 mr-2" />
                Add to comparison
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Dialog open={messageOpen} onOpenChange={setMessageOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Send intro to {talentName}</DialogTitle>
              <DialogDescription>
                Write a brief message to introduce yourself and express your interest.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Hi! I came across your profile and would love to discuss..."
                className="min-h-[120px] bg-muted/30 border-border/30"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground text-right">
                {messageText.length}/500
              </p>
              <div className="flex justify-end gap-2">
                <SignalButton variant="outline" onClick={() => setMessageOpen(false)}>
                  Cancel
                </SignalButton>
                <SignalButton 
                  variant="primary" 
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </SignalButton>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Profile variant - larger buttons
  return (
    <>
      <div className={cn("flex items-center gap-3", className)}>
        <SignalButton
          variant={shortlisted ? "primary" : "outline"}
          onClick={handleShortlist}
          className="gap-2"
        >
          <Heart className={cn("w-4 h-4", shortlisted && "fill-current")} />
          {shortlisted ? "Shortlisted" : "Add to Shortlist"}
        </SignalButton>
        <SignalButton
          variant="primary"
          onClick={() => setMessageOpen(true)}
          className="gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          Send Intro
        </SignalButton>
        <SignalButton
          variant={saved ? "secondary" : "outline"}
          onClick={handleSave}
        >
          <Bookmark className={cn("w-4 h-4", saved && "fill-current")} />
        </SignalButton>
      </div>

      <Dialog open={messageOpen} onOpenChange={setMessageOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send intro to {talentName}</DialogTitle>
            <DialogDescription>
              Write a brief message to introduce yourself and express your interest.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Hi! I came across your profile and would love to discuss..."
              className="min-h-[120px] bg-muted/30 border-border/30"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {messageText.length}/500
            </p>
            <div className="flex justify-end gap-2">
              <SignalButton variant="outline" onClick={() => setMessageOpen(false)}>
                Cancel
              </SignalButton>
              <SignalButton 
                variant="primary" 
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
              >
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </SignalButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default TalentActions;
