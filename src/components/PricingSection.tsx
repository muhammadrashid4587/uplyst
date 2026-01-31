import { useScrollReveal } from "@/hooks/useScrollReveal";
import { GlassPanel } from "./ui/GlassPanel";
import { Badge } from "./ui/SignalBadge";
import { SignalButton } from "./ui/SignalButton";
import { cn } from "@/lib/utils";
import { CheckCircle, Sparkles, Crown } from "lucide-react";

const pricingPlans = [
  {
    name: "Talent Free",
    price: "$0",
    period: "forever",
    description: "Get discovered by top employers",
    features: [
      "Basic Uplyst profile",
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

export const PricingSection = () => {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-20" ref={ref}>
          <Badge 
            variant="primary" 
            className={cn(
              "mb-6 transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <Crown className="w-3 h-3 mr-1" />
            Pricing
          </Badge>
          <h2 
            className={cn(
              "text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-3d transition-all duration-700 delay-100",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            Simple, transparent{" "}
            <span className="text-primary text-glow">pricing</span>
          </h2>
          <p 
            className={cn(
              "text-lg text-muted-foreground max-w-2xl mx-auto transition-all duration-700 delay-200",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            Start free as a talent. Employers pay for access to our verified senior talent pool.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingPlans.map((plan, index) => (
            <GlassPanel
              key={plan.name}
              className={cn(
                "relative card-3d transition-all duration-700",
                plan.popular ? "border-primary/50 shadow-glow lg:-translate-y-4" : "",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              )}
              style={{ transitionDelay: `${300 + index * 100}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <Badge variant="primary" className="shadow-glow">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <div className="text-center mb-8 pt-2">
                <h3 className="text-lg font-display font-bold mb-3">{plan.name}</h3>
                <div className="mb-3">
                  <span className="text-5xl font-display font-black">{plan.price}</span>
                  <span className="text-muted-foreground text-sm ml-1">/{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
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
  );
};

export default PricingSection;
