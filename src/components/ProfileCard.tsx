import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { GlassPanel } from "./ui/GlassPanel";
import { Badge } from "./ui/SignalBadge";
import { TalentProfile } from "@/data/mockTalent";
import { MapPin, Briefcase, Shield, Clock, ArrowRight } from "lucide-react";

interface ProfileCardProps {
  profile: TalentProfile;
  className?: string;
}

export const ProfileCard = ({ profile, className }: ProfileCardProps) => {
  return (
    <Link to={`/talent/${profile.id}`}>
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

        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
            <span className="text-lg font-display font-bold text-primary">
              {profile.name.split(" ").map(n => n[0]).join("")}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors truncate">
              {profile.name}
            </h3>
            <p className="text-muted-foreground text-sm truncate">{profile.title}</p>
          </div>
        </div>

        {/* Domain & Location */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" />
            {profile.domain}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            {profile.location.split(",")[0]}
          </span>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="primary" size="md">
            {profile.yearsExperience}+ Years
          </Badge>
          {profile.verified && (
            <Badge variant="success" size="md">
              <Shield className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          )}
          {profile.recentlyLaidOff && (
            <Badge variant="warning" size="md">
              <Clock className="w-3 h-3 mr-1" />
              Recently Laid Off
            </Badge>
          )}
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {profile.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 text-xs bg-secondary text-secondary-foreground rounded"
            >
              {skill}
            </span>
          ))}
          {profile.skills.length > 4 && (
            <span className="px-2 py-0.5 text-xs text-muted-foreground">
              +{profile.skills.length - 4} more
            </span>
          )}
        </div>

        {/* CTA */}
        <div className="flex items-center text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          View Profile
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </GlassPanel>
    </Link>
  );
};

export default ProfileCard;
