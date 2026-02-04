import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/SignalBadge";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is Uplyst?",
    answer: "Uplyst is an AI-powered career acceleration platform built specifically for senior professionals. We help you optimize your resume, craft compelling outreach, and land interviews faster — all while staying authentic to your real experience.",
  },
  {
    question: "How is this different from other resume tools?",
    answer: "Most tools focus on entry-level optimization or use generic templates. Uplyst is built for experienced professionals with complex career histories. We understand executive-level achievements, leadership metrics, and the nuances of senior-level job searches.",
  },
  {
    question: "What does 'truth-first optimization' mean?",
    answer: "We never fabricate or exaggerate your experience. Instead, we help you articulate your real achievements in ways that resonate with both ATS systems and human recruiters. Authenticity builds trust and leads to better job fit.",
  },
  {
    question: "When will I get access?",
    answer: "We're opening private beta access in Q2 2026. Waitlist members will get priority access, and the earlier you join, the sooner you'll get in. You'll also receive exclusive perks not available after public launch.",
  },
  {
    question: "Is it free?",
    answer: "We'll offer a free tier with basic features. Premium tools and advanced AI capabilities will require a subscription. Waitlist members will receive special founding member pricing.",
  },
  {
    question: "How does the referral program work?",
    answer: "After joining the waitlist, you'll receive a unique referral link. Each person who signs up using your link moves you up in the queue and earns you additional perks when we launch.",
  },
];

export const WaitlistFAQ = () => {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <section className="py-24 relative" id="faq" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
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
              "text-4xl md:text-5xl font-display font-bold mb-4 transition-all duration-700 delay-100",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            Common <span className="text-primary text-glow">Questions</span>
          </h2>
        </div>

        <div 
          className={cn(
            "max-w-2xl mx-auto transition-all duration-700 delay-200",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          )}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass-panel border border-border/50 rounded-xl px-6 data-[state=open]:border-primary/30"
              >
                <AccordionTrigger className="text-left font-display font-semibold hover:text-primary transition-colors py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default WaitlistFAQ;
