import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SignalButton } from "@/components/ui/SignalButton";
import { SignalMetricCard } from "@/components/ui/SignalMetricCard";
import { Badge } from "@/components/ui/SignalBadge";
import { ProfileCard } from "@/components/ProfileCard";
import { SignalLogo } from "@/components/SignalLogo";
import { mockTalent } from "@/data/mockTalent";
import {
  ArrowRight,
  CheckCircle,
  Shield,
  Search,
  Users,
  Zap,
  Eye,
  Lock,
  ChevronDown,
  Sparkles,
  Target,
  Award,
  Clock,
  MapPin,
  Filter,
} from "lucide-react";
import { useState } from "react";

const Index = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const metrics = [
    { value: "92%", label: "Verified Experience" },
    { value: "18+", label: "Avg Years in Industry" },
    { value: "85%", label: "Leadership Roles" },
    { value: "3x", label: "Faster Time-to-Interview" },
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Create Your Signal Profile",
      description: "Upload your resume and evidence of experience. Add achievements, leadership roles, and notable projects.",
      icon: Sparkles,
    },
    {
      step: "02",
      title: "Get Verified",
      description: "Signal analyzes and verifies seniority indicators — credentials, tenure, impact metrics, and references.",
      icon: Shield,
    },
    {
      step: "03",
      title: "Connect Directly",
      description: "Employers search by signal strength and fast-track outreach to verified senior professionals.",
      icon: Target,
    },
  ];

  const employerFilters = [
    "Years of Experience",
    "Leadership History",
    "Domain Expertise",
    "Open to Relocation",
    "Security Clearance",
    "Recently Laid Off",
    "Verification Level",
    "Signal Score",
  ];

  const trustFeatures = [
    {
      icon: CheckCircle,
      title: "Resume Verification",
      description: "We cross-check employment history and credentials with trusted sources.",
    },
    {
      icon: Lock,
      title: "Identity Protection",
      description: "Your data is encrypted and only shared with verified employers.",
    },
    {
      icon: Users,
      title: "Reference Checks",
      description: "Optional reference verification adds another layer of credibility.",
    },
    {
      icon: Eye,
      title: "Invite-Only Access",
      description: "Employers are vetted before accessing the talent pool.",
    },
  ];

  const pricingPlans = [
    {
      name: "Talent Free",
      price: "$0",
      period: "forever",
      description: "Get discovered by top employers",
      features: [
        "Basic Signal profile",
        "Appear in talent directory",
        "Direct employer messages",
        "Basic analytics",
      ],
      cta: "Create Profile",
      popular: false,
    },
    {
      name: "Talent Pro",
      price: "$29",
      period: "per month",
      description: "Maximum visibility and verification",
      features: [
        "Everything in Free",
        "Premium verification badge",
        "Priority in search results",
        "Advanced signal analytics",
        "Reference verification",
        "Featured profile placement",
      ],
      cta: "Upgrade to Pro",
      popular: true,
    },
    {
      name: "Employer Starter",
      price: "$199",
      period: "per month",
      description: "For small hiring teams",
      features: [
        "1 seat included",
        "50 profile views/month",
        "Direct messaging",
        "Basic filters",
        "Shortlist up to 25 candidates",
      ],
      cta: "Start Hiring",
      popular: false,
    },
    {
      name: "Employer Growth",
      price: "$499",
      period: "per month",
      description: "For growing organizations",
      features: [
        "5 seats included",
        "Unlimited profile views",
        "Advanced filters",
        "API access",
        "ATS integrations",
        "Dedicated success manager",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  const faqs = [
    {
      question: "Why does Signal exist?",
      answer: "Senior professionals affected by layoffs often get lost in the noise of traditional job boards. Their decades of experience, leadership impact, and proven track record get reduced to keywords and algorithms. Signal was built to restore dignity to the job search by highlighting what matters: real experience, verified credentials, and genuine impact.",
    },
    {
      question: "Who is Signal for?",
      answer: "Signal is designed for experienced professionals (typically 10+ years) who hold or have held senior roles — directors, VPs, C-suite executives, principal engineers, and senior managers. If you've led teams, driven results, and made real impact, Signal is for you.",
    },
    {
      question: "How does verification work?",
      answer: "We use a multi-layered approach: automated verification of employment history through trusted databases, optional reference checks from former colleagues, and analysis of public professional footprints. The more you verify, the stronger your signal.",
    },
    {
      question: "Is my information secure?",
      answer: "Absolutely. Your data is encrypted at rest and in transit. Employers must be verified before accessing the platform, and you control what information is visible. We never sell your data.",
    },
    {
      question: "How do employers find me?",
      answer: "Employers search by signal strength, experience level, domain expertise, and other criteria. Your profile is ranked based on the strength and verification level of your credentials. The more complete and verified your profile, the higher your visibility.",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 grid-pattern opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        
        {/* Glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-up">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">For senior professionals who've earned their place</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 animate-fade-up" style={{ animationDelay: "100ms" }}>
              Senior talent shouldn't be{" "}
              <span className="text-primary">invisible.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: "200ms" }}>
              Signal highlights real experience when resumes and algorithms fail. 
              Get verified, get seen, get hired.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: "300ms" }}>
              <SignalButton variant="primary" size="lg" className="w-full sm:w-auto">
                Create Your Signal
                <ArrowRight className="w-5 h-5 ml-2" />
              </SignalButton>
              <Link to="/talent">
                <SignalButton variant="outline" size="lg" className="w-full sm:w-auto">
                  <Search className="w-5 h-5 mr-2" />
                  Browse Senior Talent
                </SignalButton>
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-16 flex items-center justify-center gap-8 animate-fade-up" style={{ animationDelay: "400ms" }}>
              <div className="flex -space-x-3">
                {mockTalent.slice(0, 5).map((profile, i) => (
                  <div
                    key={profile.id}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border-2 border-background flex items-center justify-center text-xs font-bold text-primary"
                  >
                    {profile.name[0]}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="text-foreground font-medium">500+</span> senior professionals already on Signal
              </p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-muted-foreground" />
        </div>
      </section>

      {/* Metrics Strip */}
      <section className="py-16 border-y border-border/30 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <SignalMetricCard
                key={metric.label}
                value={metric.value}
                label={metric.label}
                delay={index * 100}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="primary" className="mb-4">How It Works</Badge>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Three steps to visibility
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We've streamlined the process to get you in front of the right employers as fast as possible.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <GlassPanel key={step.step} hover className="relative animate-fade-up" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-display font-bold text-lg shadow-glow">
                  {step.step}
                </div>
                <div className="pt-4">
                  <step.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-xl font-display font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      {/* Talent Spotlight */}
      <section className="py-24 bg-card/30 border-y border-border/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
            <div>
              <Badge variant="primary" className="mb-4">Featured Talent</Badge>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-2">
                Senior professionals, verified
              </h2>
              <p className="text-muted-foreground">
                Real leaders with proven track records, ready for their next chapter.
              </p>
            </div>
            <Link to="/talent">
              <SignalButton variant="outline">
                View All Talent
                <ArrowRight className="w-4 h-4 ml-2" />
              </SignalButton>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTalent.slice(0, 6).map((profile, index) => (
              <div key={profile.id} className="animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                <ProfileCard profile={profile} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Employer Value */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="primary" className="mb-4">For Employers</Badge>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
                Stop filtering out the people who built the industry.
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Traditional job boards bury senior talent under mountains of keywords and AI screening. 
                Signal gives you direct access to verified professionals with proven leadership experience.
              </p>
              <Link to="/employers">
                <SignalButton variant="primary" size="lg">
                  Start Hiring on Signal
                  <ArrowRight className="w-5 h-5 ml-2" />
                </SignalButton>
              </Link>
            </div>

            <GlassPanel className="p-8">
              <h4 className="text-lg font-display font-semibold mb-6 flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary" />
                Advanced Filters
              </h4>
              <div className="flex flex-wrap gap-3">
                {employerFilters.map((filter) => (
                  <div
                    key={filter}
                    className="px-4 py-2 rounded-md bg-secondary/50 border border-border/50 text-sm font-medium text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
                  >
                    {filter}
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-border/30">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Average response: 24 hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    <span>92% verified profiles</span>
                  </div>
                </div>
              </div>
            </GlassPanel>
          </div>
        </div>
      </section>

      {/* Trust & Verification */}
      <section id="trust" className="py-24 bg-card/30 border-y border-border/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="primary" className="mb-4">Trust & Security</Badge>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Built on credibility
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We take verification seriously. Your credentials are protected, and employers are vetted.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustFeatures.map((feature, index) => (
              <GlassPanel key={feature.title} hover className="text-center animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-display font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="primary" className="mb-4">Pricing</Badge>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Start free as a talent. Employers pay for access to our verified senior talent pool.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingPlans.map((plan, index) => (
              <GlassPanel
                key={plan.name}
                className={`relative animate-fade-up ${plan.popular ? "border-primary/50 shadow-glow" : ""}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="primary">Most Popular</Badge>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-lg font-display font-semibold mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-4xl font-display font-bold">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">/{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <SignalButton
                  variant={plan.popular ? "primary" : "secondary"}
                  className="w-full"
                >
                  {plan.cta}
                </SignalButton>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-card/30 border-t border-border/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="primary" className="mb-4">FAQ</Badge>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Frequently asked questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <GlassPanel
                key={index}
                className="cursor-pointer transition-all"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-display font-semibold pr-4">{faq.question}</h3>
                  <ChevronDown
                    className={`w-5 h-5 text-primary flex-shrink-0 transition-transform ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </div>
                {openFaq === index && (
                  <p className="mt-4 text-muted-foreground animate-fade-in">{faq.answer}</p>
                )}
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <GlassPanel variant="strong" className="text-center py-16 relative overflow-hidden">
            <div className="absolute inset-0 grid-pattern opacity-30" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-primary/20 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <SignalLogo size="xl" showWordmark={false} className="mx-auto mb-6" />
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
                Ready to be seen?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Join hundreds of senior professionals who are already getting noticed on Signal.
              </p>
              <SignalButton variant="primary" size="lg">
                Create Your Signal
                <ArrowRight className="w-5 h-5 ml-2" />
              </SignalButton>
            </div>
          </GlassPanel>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
