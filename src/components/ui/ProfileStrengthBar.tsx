import { cn } from "@/lib/utils";
import { Progress } from "./progress";
import { CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { Profile } from "@/types";

interface ProfileStrengthBarProps {
  profile: Partial<Profile> | null;
  className?: string;
  showDetails?: boolean;
}

interface StrengthItem {
  label: string;
  completed: boolean;
  weight: number;
}

export function ProfileStrengthBar({ profile, className, showDetails = false }: ProfileStrengthBarProps) {
  if (!profile) return null;

  const items: StrengthItem[] = [
    { label: "Profile photo", completed: !!profile.avatar_url, weight: 15 },
    { label: "Display name", completed: !!profile.display_name, weight: 10 },
    { label: "Professional title", completed: !!profile.title, weight: 10 },
    { label: "Location", completed: !!profile.location, weight: 5 },
    { label: "Bio", completed: !!profile.bio && profile.bio.length > 50, weight: 10 },
    { label: "Skills (3+)", completed: (profile.skills?.length ?? 0) >= 3, weight: 15 },
    { label: "Work experience", completed: (profile.experience?.length ?? 0) > 0, weight: 15 },
    { label: "Impact highlights", completed: (profile.impact_highlights?.length ?? 0) > 0, weight: 10 },
    { label: "Work style preference", completed: !!profile.work_style, weight: 5 },
    { label: "LinkedIn profile", completed: !!profile.linkedin_url, weight: 5 },
  ];

  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  const completedWeight = items.filter(i => i.completed).reduce((sum, item) => sum + item.weight, 0);
  const percentage = Math.round((completedWeight / totalWeight) * 100);

  const getStrengthLabel = () => {
    if (percentage >= 90) return { label: "Excellent", color: "text-green-400" };
    if (percentage >= 70) return { label: "Good", color: "text-primary" };
    if (percentage >= 50) return { label: "Fair", color: "text-yellow-400" };
    return { label: "Needs work", color: "text-orange-400" };
  };

  const strength = getStrengthLabel();

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Profile Strength</span>
        <span className={cn("text-sm font-semibold", strength.color)}>
          {percentage}% - {strength.label}
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
      
      {showDetails && (
        <div className="grid grid-cols-2 gap-2 pt-2">
          {items.map((item) => (
            <div 
              key={item.label} 
              className={cn(
                "flex items-center gap-2 text-xs",
                item.completed ? "text-muted-foreground" : "text-foreground"
              )}
            >
              {item.completed ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
              ) : (
                <Circle className="w-3.5 h-3.5 text-muted-foreground" />
              )}
              {item.label}
            </div>
          ))}
        </div>
      )}

      {!showDetails && percentage < 70 && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Complete your profile to improve visibility</span>
        </div>
      )}
    </div>
  );
}

export default ProfileStrengthBar;
