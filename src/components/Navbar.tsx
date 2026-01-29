import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SignalLogo } from "./SignalLogo";
import { SignalButton } from "./ui/SignalButton";
import { Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

const navLinks = [
  { href: "/#how-it-works", label: "How it Works" },
  { href: "/talent", label: "Talent" },
  { href: "/employers", label: "Employers" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#trust", label: "Trust" },
  { href: "/#faq", label: "FAQ" },
];

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
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
            <SignalLogo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "text-sm font-semibold uppercase tracking-wider transition-all duration-300 hover:text-primary relative",
                  location.pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-foreground font-medium">
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </span>
                <SignalButton 
                  variant="ghost" 
                  size="sm" 
                  className="font-display uppercase tracking-wider"
                  onClick={handleSignOut}
                >
                  Sign Out
                </SignalButton>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <SignalButton variant="ghost" size="sm" className="font-display uppercase tracking-wider">
                    Sign In
                  </SignalButton>
                </Link>
                <Link to="/auth">
                  <SignalButton variant="primary" size="sm" className="font-display uppercase tracking-wider">
                    Get Started
                  </SignalButton>
                </Link>
              </>
            )}
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
            mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="py-6 border-t border-border/30 glass-panel-strong mt-2 rounded-lg mb-4">
            <div className="flex flex-col gap-1 px-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "text-sm font-semibold uppercase tracking-wider py-3 px-4 rounded-lg transition-all duration-300 hover:bg-primary/10 hover:text-primary",
                    location.pathname === link.href
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-3 pt-6 mt-4 border-t border-border/30">
                {user ? (
                  <>
                    <span className="text-sm text-foreground font-medium text-center px-4">
                      {user.user_metadata?.full_name || user.email?.split('@')[0]}
                    </span>
                    <SignalButton 
                      variant="ghost" 
                      size="md" 
                      className="justify-center font-display uppercase tracking-wider"
                      onClick={() => {
                        handleSignOut();
                        setMobileMenuOpen(false);
                      }}
                    >
                      Sign Out
                    </SignalButton>
                  </>
                ) : (
                  <>
                    <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                      <SignalButton variant="ghost" size="md" className="w-full justify-center font-display uppercase tracking-wider">
                        Sign In
                      </SignalButton>
                    </Link>
                    <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                      <SignalButton variant="primary" size="md" className="w-full justify-center font-display uppercase tracking-wider">
                        Get Started
                      </SignalButton>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
