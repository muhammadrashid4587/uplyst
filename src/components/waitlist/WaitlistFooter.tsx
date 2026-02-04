import { Link } from "react-router-dom";
import { UplystLogo } from "@/components/UplystLogo";
import { Separator } from "@/components/ui/separator";

const footerLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Contact", href: "mailto:hello@uplyst.co" },
];

export const WaitlistFooter = () => {
  return (
    <footer className="py-12 relative border-t border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <UplystLogo size="sm" />
            <Separator orientation="vertical" className="h-6 hidden md:block" />
            <span className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Uplyst. All rights reserved.
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            {footerLinks.map((link) => (
              link.href.startsWith("mailto:") ? (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              )
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default WaitlistFooter;
