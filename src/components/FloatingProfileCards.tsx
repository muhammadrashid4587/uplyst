import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { GlassPanel } from "./ui/GlassPanel";
import { Badge } from "./ui/SignalBadge";
import { SignalButton } from "./ui/SignalButton";
import { mockTalent, TalentProfile } from "@/data/mockTalent";
import { cn } from "@/lib/utils";
import { ArrowRight, MapPin, Briefcase, Shield, Sparkles } from "lucide-react";

// Placeholder avatar images - in production these would be real profile photos
const avatarImages = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
];

const FloatingProfileCard = ({
  profile,
  index,
  isVisible,
}: {
  profile: TalentProfile;
  index: number;
  isVisible: boolean;
}) => {
  return (
    <GlassPanel
      hover
      className={cn(
        "h-full group cursor-pointer relative overflow-hidden card-3d glow-border",
        "transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Signal Score Badge */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <div className="relative">
          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse-glow" />
        </div>
        <span className="text-xs font-bold text-primary font-display">{profile.signalScore}</span>
      </div>

      {/* Profile Image */}
      <div className="flex flex-col items-center text-center mb-5">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/30 group-hover:border-primary/60 transition-colors duration-300 mb-4">
          <img 
            src={avatarImages[index % avatarImages.length]} 
            alt={profile.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors">
          {profile.name}
        </h3>
        <p className="text-muted-foreground text-sm">{profile.title}</p>
      </div>

      {/* Quick Info */}
      <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground mb-5">
        <span className="flex items-center gap-1">
          <Briefcase className="w-3.5 h-3.5 text-primary/60" />
          {profile.domain}
        </span>
        <span className="w-1 h-1 rounded-full bg-border" />
        <span className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-primary/60" />
          {profile.location.split(",")[0]}
        </span>
      </div>

      {/* Verification Badge */}
      {profile.verified && (
        <div className="flex justify-center mb-5">
          <Badge variant="success" size="sm">
            <Shield className="w-3 h-3 mr-1" />
            Verified Professional
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

      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg" />
    </GlassPanel>
  );
};

export const FloatingProfileCards = () => {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-16 gap-6" ref={ref}>
          <div>
            <Badge 
              variant="primary" 
              className={cn(
                "mb-6 transition-all duration-700",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Featured Talent
            </Badge>
            <h2 
              className={cn(
                "text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 text-3d transition-all duration-700 delay-100",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
            >
              Senior professionals,{" "}
              <span className="text-primary text-glow">verified</span>
            </h2>
            <p 
              className={cn(
                "text-lg text-muted-foreground max-w-xl transition-all duration-700 delay-200",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
            >
              Real leaders with proven track records, ready for their next chapter.
            </p>
          </div>
          <Link 
            to="/talent"
            className={cn(
              "transition-all duration-700 delay-300",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            )}
          >
            <SignalButton variant="outline" className="group">
              View All Talent
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </SignalButton>
          </Link>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTalent.slice(0, 6).map((profile, index) => (
            <FloatingProfileCard
              key={profile.id}
              profile={profile}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FloatingProfileCards;
