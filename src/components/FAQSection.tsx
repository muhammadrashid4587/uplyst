import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { GlassPanel } from "./ui/GlassPanel";
import { Badge } from "./ui/SignalBadge";
import { cn } from "@/lib/utils";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "Why does Uplyst exist?",
    answer: "Senior professionals affected by layoffs often get lost in the noise of traditional job boards. Their decades of experience, leadership impact, and proven track record get reduced to keywords and algorithms. Uplyst was built to restore dignity to the job search by highlighting what matters: real experience, verified credentials, and genuine impact.",
  },
  {
    question: "Who is Uplyst for?",
    answer: "Uplyst is designed for experienced professionals (typically 10+ years) who hold or have held senior roles — directors, VPs, C-suite executives, principal engineers, and senior managers. If you've led teams, driven results, and made real impact, Uplyst is for you.",
  },
  {
    question: "How does verification work?",
    answer: "We use a multi-layered approach: automated verification of employment history through trusted databases, optional reference checks from former colleagues, and analysis of public professional footprints. The more you verify, the stronger your profile.",
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

export const FAQSection = () => {
  const { ref, isVisible } = useScrollReveal(0.1);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16" ref={ref}>
          <Badge 
            variant="primary" 
            className={cn(
              "mb-6 transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <HelpCircle className="w-3 h-3 mr-1" />
            FAQ
          </Badge>
          <h2 
            className={cn(
              "text-4xl md:text-5xl lg:text-6xl font-display font-bold text-3d transition-all duration-700 delay-100",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            Frequently asked{" "}
            <span className="text-primary text-glow">questions</span>
          </h2>
        </div>

        {/* FAQ items */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <GlassPanel
              key={index}
              className={cn(
                "cursor-pointer transition-all duration-500 overflow-hidden",
                openIndex === index ? "border-primary/30" : "",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-display font-bold pr-4">{faq.question}</h3>
                <div 
                  className={cn(
                    "w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 transition-all duration-300",
                    openIndex === index ? "bg-primary/20 rotate-180" : ""
                  )}
                >
                  <ChevronDown className="w-5 h-5 text-primary" />
                </div>
              </div>
              
              <div 
                className={cn(
                  "overflow-hidden transition-all duration-500",
                  openIndex === index ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
                )}
              >
                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
              </div>
            </GlassPanel>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
