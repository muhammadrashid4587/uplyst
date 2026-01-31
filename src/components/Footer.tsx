import { Link } from "react-router-dom";
import { UplystLogo } from "./SignalLogo";
import { Github, Twitter, Linkedin, ArrowUpRight } from "lucide-react";

const footerLinks = {
  product: [
    { label: "How it Works", href: "/#how-it-works" },
    { label: "For Talent", href: "/talent" },
    { label: "For Employers", href: "/employers" },
    { label: "Pricing", href: "/#pricing" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
  ],
  resources: [
    { label: "Help Center", href: "/help" },
    { label: "Trust & Security", href: "/#trust" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export const Footer = () => {
  return (
    <footer className="relative border-t border-border/30 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-background" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px]" style={{
        background: "radial-gradient(ellipse, hsl(var(--primary) / 0.1) 0%, transparent 70%)",
      }} />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <UplystLogo size="lg" className="mb-6" />
            <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
              The high-signal career platform for senior professionals. 
              Uplyst highlights credibility, leadership, and real-world impact — not buzzwords.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Twitter, href: "https://twitter.com" },
                { icon: Linkedin, href: "https://linkedin.com" },
                { icon: Github, href: "https://github.com" },
              ].map(({ icon: Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl bg-secondary/60 border border-border/30 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 hover:border-primary/30 transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-bold text-foreground mb-6 uppercase tracking-wider text-sm">Product</h4>
            <ul className="space-y-4">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-foreground mb-6 uppercase tracking-wider text-sm">Company</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-foreground mb-6 uppercase tracking-wider text-sm">Resources</h4>
            <ul className="space-y-4">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Uplyst. All rights reserved.
            © {new Date().getFullYear()} Signal. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground font-display">
            Built for senior professionals who deserve to be <span className="text-primary">seen</span>.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
