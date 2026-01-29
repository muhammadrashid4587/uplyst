import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { GlassPanel } from "./ui/GlassPanel";
import { Badge } from "./ui/SignalBadge";
import { SignalButton } from "./ui/SignalButton";
import { TalentProfile } from "@/data/mockTalent";
import { MapPin, Briefcase, Shield, ArrowRight } from "lucide-react";

// Placeholder avatar images - in production these would be real profile photos
const avatarImages = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&crop=face",
];

interface ProfileCardProps {
  profile: TalentProfile;
  className?: string;
  index?: number;
}

export const ProfileCard = ({ profile, className, index = 0 }: ProfileCardProps) => {
  return (
    <GlassPanel
      hover
      className={cn(
        "h-full group cursor-pointer relative overflow-hidden",
        className
      )}
    >
      {/* Signal Score Indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-1">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
        <span className="text-xs font-medium text-primary">{profile.signalScore}</span>
      </div>

      {/* Profile Image & Name */}
      <div className="flex flex-col items-center text-center mb-4">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/30 group-hover:border-primary/60 transition-colors duration-300 mb-3">
          <img 
            src={avatarImages[index % avatarImages.length]} 
            alt={profile.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors truncate max-w-full">
          {profile.name}
        </h3>
        <p className="text-muted-foreground text-sm truncate max-w-full">{profile.title}</p>
      </div>

      {/* Quick Info */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-4">
        <span className="flex items-center gap-1">
          <Briefcase className="w-3 h-3" />
          {profile.domain}
        </span>
        <span className="w-1 h-1 rounded-full bg-border" />
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {profile.location.split(",")[0]}
        </span>
      </div>

      {/* Verification Badge */}
      {profile.verified && (
        <div className="flex justify-center mb-4">
          <Badge variant="success" size="sm">
            <Shield className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        </div>
      )}

      {/* View Profile Button */}
      <Link to={`/talent/${profile.id}`} className="block">
        <SignalButton 
          variant="outline" 
          size="sm" 
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
        >
          View Profile
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </SignalButton>
      </Link>
    </GlassPanel>
  );
};

export default ProfileCard;
