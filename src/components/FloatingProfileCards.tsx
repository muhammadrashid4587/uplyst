import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { GlassPanel } from "./ui/GlassPanel";
import { Badge } from "./ui/SignalBadge";
import { SignalButton } from "./ui/SignalButton";
import { mockTalent, TalentProfile } from "@/data/mockTalent";
import { cn } from "@/lib/utils";
import { ArrowRight, MapPin, Briefcase, Shield, Clock, Sparkles } from "lucide-react";

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
    <Link to={`/talent/${profile.id}`}>
      <GlassPanel
        hover
        className={cn(
          "h-full group cursor-pointer relative overflow-hidden card-3d glow-border",
          "transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        )}
        style={{ transitionDelay: `${index * 100}ms` }}
      >
        {/* Signal Score with pulse */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <div className="relative">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse-glow" />
            <div className="absolute inset-0 w-3 h-3 rounded-full bg-primary animate-ping opacity-50" />
          </div>
          <span className="text-sm font-bold text-primary font-display">{profile.signalScore}</span>
        </div>

        {/* Header */}
        <div className="flex items-start gap-4 mb-5">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/30 to-signal-maroon/20 flex items-center justify-center border border-primary/20 group-hover:scale-105 transition-transform duration-300">
            <span className="text-xl font-display font-bold text-primary">
              {profile.name.split(" ").map(n => n[0]).join("")}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-xl text-foreground group-hover:text-primary transition-colors truncate">
              {profile.name}
            </h3>
            <p className="text-muted-foreground text-sm truncate">{profile.title}</p>
          </div>
        </div>

        {/* Domain & Location */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-5">
          <span className="flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-primary/60" />
            {profile.domain}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-primary/60" />
            {profile.location.split(",")[0]}
          </span>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-5">
          <Badge variant="primary" size="md" className="font-display">
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
        <div className="flex flex-wrap gap-1.5 mb-5">
          {profile.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="px-2.5 py-1 text-xs bg-secondary/60 text-secondary-foreground rounded-md border border-border/30"
            >
              {skill}
            </span>
          ))}
          {profile.skills.length > 4 && (
            <span className="px-2.5 py-1 text-xs text-muted-foreground">
              +{profile.skills.length - 4} more
            </span>
          )}
        </div>

        {/* CTA - reveals on hover */}
        <div className="flex items-center text-sm text-primary font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          View Profile
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </div>

        {/* Hover gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg" />
      </GlassPanel>
    </Link>
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
