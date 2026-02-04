import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { UplystLogo } from "@/components/UplystLogo";
import { SignalButton } from "@/components/ui/SignalButton";
import { Menu, X, Sparkles } from "lucide-react";

const navLinks = [
  { href: "#products", label: "Products" },
  { href: "#trust", label: "Why Uplyst" },
  { href: "#faq", label: "FAQ" },
];

export const WaitlistNav = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const scrollToWaitlist = () => {
    const el = document.getElementById("waitlist");
    el?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled 
          ? "glass-panel-strong border-b border-border/30 shadow-lg" 
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 hover:opacity-80 transition-opacity">
            <UplystLogo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="text-sm font-semibold uppercase tracking-wider transition-all duration-300 hover:text-primary text-muted-foreground"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <SignalButton 
              variant="primary" 
              size="sm" 
              className="font-display uppercase tracking-wider"
              onClick={scrollToWaitlist}
            >
              <Sparkles className="w-3 h-3 mr-2" />
              Join Waitlist
            </SignalButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-500",
            mobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="py-6 border-t border-border/30 glass-panel-strong mt-2 rounded-lg mb-4">
            <div className="flex flex-col gap-1 px-4">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="text-sm font-semibold uppercase tracking-wider py-3 px-4 rounded-lg transition-all duration-300 hover:bg-primary/10 hover:text-primary text-muted-foreground text-left"
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-4 mt-2 border-t border-border/30">
                <SignalButton 
                  variant="primary" 
                  size="md" 
                  className="w-full justify-center font-display uppercase tracking-wider"
                  onClick={scrollToWaitlist}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Join Waitlist
                </SignalButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default WaitlistNav;
