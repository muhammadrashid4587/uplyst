import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SignalButton } from "@/components/ui/SignalButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWaitlist } from "@/hooks/useWaitlist";
import { toast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Users, Share2, Copy, Check } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface WaitlistFormProps {
  className?: string;
}

export const WaitlistForm = ({ className }: WaitlistFormProps) => {
  const [searchParams] = useSearchParams();
  const { signup, isLoading } = useWaitlist();
  const { ref, isVisible } = useScrollReveal(0.1);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    role: "",
    seniority: "",
    target_roles: "",
  });

  const [success, setSuccess] = useState(false);
  const [refCode, setRefCode] = useState<string | null>(null);
  const [position, setPosition] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const referredBy = searchParams.get("ref");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.full_name.trim() || !formData.email.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter your name and email.",
        variant: "destructive",
      });
      return;
    }

    const result = await signup({
      ...formData,
      referred_by: referredBy || undefined,
    });

    if (result.success) {
      setSuccess(true);
      setRefCode(result.ref_code || null);
      setPosition(result.position || null);
      toast({
        title: "You're on the list! 🎉",
        description: `You're #${result.position} on the waitlist.`,
      });
    } else {
      toast({
        title: "Oops!",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const shareUrl = refCode
    ? `${window.location.origin}?ref=${refCode}`
    : window.location.origin;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Share link copied to clipboard.",
    });
  };

  if (success) {
    return (
      <section id="waitlist" className={cn("py-24 relative", className)} ref={ref}>
        <div className="container mx-auto px-4">
          <GlassPanel
            className={cn(
              "max-w-xl mx-auto text-center p-8 md:p-12 transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            )}
          >
            <div className="w-20 h-20 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              You're In! 🚀
            </h2>
            <p className="text-muted-foreground mb-2">
              You're <span className="text-primary font-bold">#{position}</span> on the waitlist.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              We'll notify you when it's your turn to access Uplyst.
            </p>

            <div className="bg-card/50 rounded-xl p-6 border border-border/50 mb-6">
              <div className="flex items-center gap-2 mb-4 justify-center">
                <Share2 className="w-5 h-5 text-primary" />
                <span className="font-semibold">Move up the list</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Share your link. Each signup moves you up!
              </p>
              <div className="flex gap-2">
                <Input
                  value={shareUrl}
                  readOnly
                  className="bg-background/50 text-sm"
                />
                <SignalButton
                  variant="primary"
                  size="sm"
                  onClick={handleCopy}
                  className="shrink-0"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </SignalButton>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>Your referral code: <code className="text-primary font-mono">{refCode}</code></span>
            </div>
          </GlassPanel>
        </div>
      </section>
    );
  }

  return (
    <section id="waitlist" className={cn("py-24 relative", className)} ref={ref}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            className={cn(
              "text-4xl md:text-5xl font-display font-bold mb-4 transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            Join the <span className="text-primary text-glow">Waitlist</span>
          </h2>
          <p
            className={cn(
              "text-lg text-muted-foreground max-w-xl mx-auto transition-all duration-700 delay-100",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            Be first in line when we launch. Early access members get exclusive perks.
          </p>
          {referredBy && (
            <p className="text-sm text-primary mt-2 animate-pulse">
              ✨ You were referred by a friend!
            </p>
          )}
        </div>

        <GlassPanel
          className={cn(
            "max-w-xl mx-auto p-8 transition-all duration-700 delay-200",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          )}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  placeholder="Jane Doe"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="bg-background/50"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jane@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-background/50"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">I am a...</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="candidate">Candidate</SelectItem>
                    <SelectItem value="employer">Employer</SelectItem>
                    <SelectItem value="recruiter">Recruiter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="seniority">Seniority Level</Label>
                <Select
                  value={formData.seniority}
                  onValueChange={(value) => setFormData({ ...formData, seniority: value })}
                >
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="target_roles">What roles are you targeting?</Label>
              <Input
                id="target_roles"
                placeholder="e.g., VP of Engineering, Head of Product"
                value={formData.target_roles}
                onChange={(e) => setFormData({ ...formData, target_roles: e.target.value })}
                className="bg-background/50"
              />
            </div>

            <SignalButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full font-display uppercase tracking-wider"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Join the Waitlist
                </>
              )}
            </SignalButton>

            <p className="text-xs text-center text-muted-foreground">
              By joining, you agree to receive updates about Uplyst. No spam, ever.
            </p>
          </form>
        </GlassPanel>
      </div>
    </section>
  );
};

export default WaitlistForm;
