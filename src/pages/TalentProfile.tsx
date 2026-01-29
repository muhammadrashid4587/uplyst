import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SignalButton } from "@/components/ui/SignalButton";
import { Badge } from "@/components/ui/SignalBadge";
import { mockTalent } from "@/data/mockTalent";
import {
  MapPin,
  Briefcase,
  Shield,
  Clock,
  ArrowLeft,
  Mail,
  Calendar,
  Award,
  Building,
  Lock,
  CheckCircle,
  FileText,
  Star,
  TrendingUp,
  Users,
  Globe,
} from "lucide-react";

const TalentProfile = () => {
  const { id } = useParams<{ id: string }>();
  const profile = mockTalent.find((p) => p.id === id);

  if (!profile) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-display font-bold mb-4">Profile not found</h1>
          <Link to="/talent">
            <SignalButton variant="secondary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Directory
            </SignalButton>
          </Link>
        </div>
      </Layout>
    );
  }

  const verificationDetails = {
    Basic: { color: "muted", description: "Identity verified" },
    Enhanced: { color: "warning", description: "Employment history verified" },
    Premium: { color: "success", description: "Full verification with references" },
  };

  const verification = verificationDetails[profile.verificationLevel];

  return (
    <Layout>
      {/* Header */}
      <section className="py-8 border-b border-border/30">
        <div className="container mx-auto px-4">
          <Link
            to="/talent"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Directory
          </Link>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Info */}
            <div className="flex-1">
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border-2 border-primary/30 flex-shrink-0">
                  <span className="text-3xl font-display font-bold text-primary">
                    {profile.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl md:text-4xl font-display font-bold">
                      {profile.name}
                    </h1>
                    {profile.verified && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>

                  <p className="text-xl text-muted-foreground mb-4">{profile.title}</p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {profile.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4" />
                      {profile.domain}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {profile.yearsExperience}+ years experience
                    </span>
                  </div>
                </div>
              </div>

              {/* Badges Row */}
              <div className="flex flex-wrap gap-2 mt-6">
                <Badge variant="primary" size="md">
                  <Star className="w-3.5 h-3.5 mr-1" />
                  Signal Score: {profile.signalScore}
                </Badge>
                <Badge variant={verification.color as any} size="md">
                  <Shield className="w-3.5 h-3.5 mr-1" />
                  {profile.verificationLevel} Verified
                </Badge>
                <Badge variant="muted" size="md">
                  {profile.seniorityLevel}
                </Badge>
                {profile.openToWork && (
                  <Badge variant="success" size="md">
                    <TrendingUp className="w-3.5 h-3.5 mr-1" />
                    Open to Work
                  </Badge>
                )}
                {profile.recentlyLaidOff && (
                  <Badge variant="warning" size="md">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    Recently Laid Off
                  </Badge>
                )}
                {profile.openToRelocation && (
                  <Badge variant="muted" size="md">
                    <Globe className="w-3.5 h-3.5 mr-1" />
                    Open to Relocation
                  </Badge>
                )}
                {profile.securityClearance && (
                  <Badge variant="primary" size="md">
                    <Lock className="w-3.5 h-3.5 mr-1" />
                    Security Clearance
                  </Badge>
                )}
              </div>
            </div>

            {/* CTA Card */}
            <GlassPanel className="lg:w-80 flex-shrink-0">
              <h3 className="font-display font-semibold mb-4">Contact {profile.name.split(" ")[0]}</h3>
              <div className="space-y-3">
                <SignalButton variant="primary" className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  Request Intro
                </SignalButton>
                <SignalButton variant="secondary" className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Message Candidate
                </SignalButton>
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Requires verified employer account
              </p>
            </GlassPanel>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Summary */}
              <GlassPanel>
                <h2 className="text-xl font-display font-semibold mb-4">Summary</h2>
                <p className="text-muted-foreground leading-relaxed">{profile.summary}</p>
              </GlassPanel>

              {/* High Signal Section */}
              <GlassPanel>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
                  <h2 className="text-xl font-display font-semibold">High Signal</h2>
                </div>

                <div className="space-y-6">
                  {/* Leadership Impact */}
                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">
                      Leadership Impact
                    </h3>
                    <ul className="space-y-3">
                      {profile.leadershipImpact.map((impact, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <TrendingUp className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>{impact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Key Achievements */}
                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">
                      Key Achievements
                    </h3>
                    <ul className="space-y-3">
                      {profile.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Award className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Companies */}
                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">
                      Notable Companies
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {profile.companies.map((company) => (
                        <div
                          key={company}
                          className="flex items-center gap-2 px-4 py-2 rounded-md bg-secondary border border-border/50"
                        >
                          <Building className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{company}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassPanel>

              {/* Resume Preview */}
              <GlassPanel>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-display font-semibold">Resume</h2>
                  <Badge variant="muted">
                    <Lock className="w-3 h-3 mr-1" />
                    Employer access only
                  </Badge>
                </div>
                <div className="bg-secondary/50 rounded-lg p-8 text-center border border-border/30">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    Resume preview available for verified employers
                  </p>
                </div>
              </GlassPanel>

              {/* References */}
              <GlassPanel>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-display font-semibold">References</h2>
                  <Badge variant="muted">
                    <Lock className="w-3 h-3 mr-1" />
                    Locked
                  </Badge>
                </div>
                <div className="bg-secondary/50 rounded-lg p-8 text-center border border-border/30">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    References available after employer verification and candidate approval
                  </p>
                </div>
              </GlassPanel>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Skills */}
              <GlassPanel>
                <h3 className="text-lg font-display font-semibold mb-4">Skills & Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 text-sm bg-secondary rounded-md border border-border/30"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </GlassPanel>

              {/* Verification Details */}
              <GlassPanel>
                <h3 className="text-lg font-display font-semibold mb-4">Verification Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{profile.verificationLevel} Verified</p>
                      <p className="text-sm text-muted-foreground">{verification.description}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/30">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Signal Score</span>
                      <span className="font-bold text-primary">{profile.signalScore}/100</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${profile.signalScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              </GlassPanel>

              {/* Quick Stats */}
              <GlassPanel>
                <h3 className="text-lg font-display font-semibold mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Years of Experience</span>
                    <span className="font-medium">{profile.yearsExperience}+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Seniority Level</span>
                    <span className="font-medium">{profile.seniorityLevel}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Domain</span>
                    <span className="font-medium">{profile.domain}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Companies</span>
                    <span className="font-medium">{profile.companies.length}</span>
                  </div>
                </div>
              </GlassPanel>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TalentProfile;
