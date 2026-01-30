import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SignalButton } from "@/components/ui/SignalButton";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  User, Briefcase, MapPin, ArrowRight, ArrowLeft, Check, 
  Upload, Linkedin, X, Plus, Building2, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserRole, WorkStyle, SeniorityLevel } from "@/types";

interface OnboardingWizardProps {
  open: boolean;
  onComplete: (data: OnboardingData) => void;
  onSkip: () => void;
}

export interface OnboardingData {
  userRole: UserRole;
  displayName: string;
  title: string;
  location: string;
  workStyle: WorkStyle;
  seniorityLevel: SeniorityLevel | null;
  skills: string[];
  impactHighlights: string[];
  linkedinUrl?: string;
}

const STEPS = [
  { id: "role", title: "Welcome to Signal", description: "Let's personalize your experience" },
  { id: "basics", title: "Basic Information", description: "Tell us about yourself" },
  { id: "preferences", title: "Work Preferences", description: "What are you looking for?" },
  { id: "skills", title: "Skills & Impact", description: "Showcase your expertise" },
  { id: "complete", title: "You're All Set!", description: "Your Signal profile is ready" },
];

const seniorityOptions: { value: SeniorityLevel; label: string; description: string }[] = [
  { value: "Principal", label: "Principal / Staff", description: "Individual contributor leadership" },
  { value: "Senior Manager", label: "Senior Manager", description: "Team leadership (5-15 reports)" },
  { value: "Director", label: "Director", description: "Multi-team leadership (15-50 reports)" },
  { value: "VP", label: "VP", description: "Function or division leadership" },
  { value: "C-Suite", label: "C-Suite / Executive", description: "Company-wide leadership" },
];

const workStyleOptions: { value: WorkStyle; label: string; icon: string }[] = [
  { value: "remote", label: "Remote", icon: "🏠" },
  { value: "hybrid", label: "Hybrid", icon: "🔄" },
  { value: "onsite", label: "On-site", icon: "🏢" },
];

export function OnboardingWizard({ open, onComplete, onSkip }: OnboardingWizardProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<OnboardingData>>({
    userRole: "candidate",
    skills: [],
    impactHighlights: [],
  });
  const [newSkill, setNewSkill] = useState("");
  const [newHighlight, setNewHighlight] = useState("");

  const currentStep = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  const canProceed = () => {
    switch (step) {
      case 0:
        return !!data.userRole;
      case 1:
        return !!data.displayName && !!data.title;
      case 2:
        return !!data.workStyle;
      case 3:
        return (data.skills?.length ?? 0) > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(data as OnboardingData);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && (data.skills?.length ?? 0) < 10) {
      setData({ ...data, skills: [...(data.skills || []), newSkill.trim()] });
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setData({ ...data, skills: data.skills?.filter(s => s !== skill) || [] });
  };

  const addHighlight = () => {
    if (newHighlight.trim() && (data.impactHighlights?.length ?? 0) < 3) {
      setData({ ...data, impactHighlights: [...(data.impactHighlights || []), newHighlight.trim()] });
      setNewHighlight("");
    }
  };

  const removeHighlight = (highlight: string) => {
    setData({ ...data, impactHighlights: data.impactHighlights?.filter(h => h !== highlight) || [] });
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-2xl bg-background/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <div className="flex items-center justify-between mb-2">
            <DialogTitle className="text-xl font-display">{currentStep.title}</DialogTitle>
            <button 
              onClick={onSkip}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip for now
            </button>
          </div>
          <DialogDescription>{currentStep.description}</DialogDescription>
          <Progress value={progress} className="h-1 mt-4" />
        </DialogHeader>

        <div className="py-6 min-h-[300px]">
          {/* Step 0: Role Selection */}
          {step === 0 && (
            <div className="grid gap-4">
              <GlassPanel
                hover
                onClick={() => setData({ ...data, userRole: "candidate" })}
                className={cn(
                  "cursor-pointer transition-all",
                  data.userRole === "candidate" && "ring-2 ring-primary"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">I'm a Candidate</h3>
                    <p className="text-sm text-muted-foreground">
                      Looking for my next senior role or exploring opportunities
                    </p>
                  </div>
                  {data.userRole === "candidate" && (
                    <Check className="w-5 h-5 text-primary ml-auto" />
                  )}
                </div>
              </GlassPanel>

              <GlassPanel
                hover
                onClick={() => setData({ ...data, userRole: "employer" })}
                className={cn(
                  "cursor-pointer transition-all",
                  data.userRole === "employer" && "ring-2 ring-primary"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">I'm an Employer</h3>
                    <p className="text-sm text-muted-foreground">
                      Hiring senior talent for my team or organization
                    </p>
                  </div>
                  {data.userRole === "employer" && (
                    <Check className="w-5 h-5 text-primary ml-auto" />
                  )}
                </div>
              </GlassPanel>
            </div>
          )}

          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Full Name *</Label>
                  <Input
                    id="displayName"
                    value={data.displayName || ""}
                    onChange={(e) => setData({ ...data, displayName: e.target.value })}
                    placeholder="Your full name"
                    className="bg-muted/30 border-border/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">
                    {data.userRole === "employer" ? "Your Role" : "Professional Title"} *
                  </Label>
                  <Input
                    id="title"
                    value={data.title || ""}
                    onChange={(e) => setData({ ...data, title: e.target.value })}
                    placeholder={data.userRole === "employer" ? "e.g. Head of Talent" : "e.g. VP of Engineering"}
                    className="bg-muted/30 border-border/30"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={data.location || ""}
                  onChange={(e) => setData({ ...data, location: e.target.value })}
                  placeholder="City, Country"
                  className="bg-muted/30 border-border/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn Profile (optional)</Label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="linkedin"
                    value={data.linkedinUrl || ""}
                    onChange={(e) => setData({ ...data, linkedinUrl: e.target.value })}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="pl-10 bg-muted/30 border-border/30"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Work Preferences */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>Preferred Work Style *</Label>
                <div className="grid grid-cols-3 gap-3">
                  {workStyleOptions.map((option) => (
                    <GlassPanel
                      key={option.value}
                      hover
                      onClick={() => setData({ ...data, workStyle: option.value })}
                      className={cn(
                        "cursor-pointer text-center py-6 transition-all",
                        data.workStyle === option.value && "ring-2 ring-primary"
                      )}
                    >
                      <span className="text-3xl mb-2 block">{option.icon}</span>
                      <span className="font-medium">{option.label}</span>
                    </GlassPanel>
                  ))}
                </div>
              </div>

              {data.userRole === "candidate" && (
                <div className="space-y-3">
                  <Label>Seniority Level</Label>
                  <div className="grid gap-2">
                    {seniorityOptions.map((option) => (
                      <GlassPanel
                        key={option.value}
                        hover
                        onClick={() => setData({ ...data, seniorityLevel: option.value })}
                        className={cn(
                          "cursor-pointer py-3 px-4 transition-all",
                          data.seniorityLevel === option.value && "ring-2 ring-primary"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium">{option.label}</span>
                            <span className="text-sm text-muted-foreground ml-2">{option.description}</span>
                          </div>
                          {data.seniorityLevel === option.value && (
                            <Check className="w-4 h-4 text-primary" />
                          )}
                        </div>
                      </GlassPanel>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Skills & Impact */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>Key Skills (add up to 10)</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {data.skills?.map((skill) => (
                    <Badge key={skill} variant="secondary" className="px-3 py-1">
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="ml-2">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                {(data.skills?.length ?? 0) < 10 && (
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                      placeholder="e.g. Python, Team Leadership, M&A"
                      className="bg-muted/30 border-border/30"
                    />
                    <SignalButton variant="outline" onClick={addSkill} disabled={!newSkill.trim()}>
                      <Plus className="w-4 h-4" />
                    </SignalButton>
                  </div>
                )}
              </div>

              {data.userRole === "candidate" && (
                <div className="space-y-3">
                  <Label>Impact Highlights (up to 3 bullets)</Label>
                  <p className="text-sm text-muted-foreground">
                    What makes you stand out? Quantify your achievements.
                  </p>
                  <div className="space-y-2">
                    {data.impactHighlights?.map((highlight, i) => (
                      <div key={i} className="flex items-start gap-2 p-3 bg-muted/20 rounded-lg">
                        <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span className="flex-1 text-sm">{highlight}</span>
                        <button onClick={() => removeHighlight(highlight)}>
                          <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                        </button>
                      </div>
                    ))}
                  </div>
                  {(data.impactHighlights?.length ?? 0) < 3 && (
                    <div className="flex gap-2">
                      <Input
                        value={newHighlight}
                        onChange={(e) => setNewHighlight(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addHighlight())}
                        placeholder="e.g. Grew team from 10 to 80 engineers"
                        className="bg-muted/30 border-border/30"
                      />
                      <SignalButton variant="outline" onClick={addHighlight} disabled={!newHighlight.trim()}>
                        <Plus className="w-4 h-4" />
                      </SignalButton>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Complete */}
          {step === 4 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground mb-2">
                Welcome to Signal!
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                {data.userRole === "candidate" 
                  ? "Your profile is set up. Start exploring opportunities and let employers find you."
                  : "You're ready to discover senior talent. Browse verified candidates or post your first job."
                }
              </p>
              <div className="flex justify-center gap-3">
                <SignalButton variant="primary" onClick={() => onComplete(data as OnboardingData)}>
                  {data.userRole === "candidate" ? "Explore Jobs" : "Browse Talent"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </SignalButton>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        {step < 4 && (
          <div className="flex justify-between pt-4 border-t border-border/30">
            <SignalButton
              variant="outline"
              onClick={handleBack}
              disabled={step === 0}
              className={step === 0 ? "invisible" : ""}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </SignalButton>
            <SignalButton
              variant="primary"
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {step === 3 ? "Complete Setup" : "Continue"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </SignalButton>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default OnboardingWizard;
