import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { UplystLogo } from "@/components/UplystLogo";
import { SignalButton } from "@/components/ui/SignalButton";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  useEffect(() => {
    document.documentElement.classList.add("dark");
    window.scrollTo(0, 0);
  }, []);

  const lastUpdated = "February 4, 2026";

  return (
    <div className="min-h-screen noise-overlay relative">
      <AnimatedBackground />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel-strong border-b border-border/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <UplystLogo size="md" />
            </Link>
            <Link to="/">
              <SignalButton variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </SignalButton>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="pt-24 md:pt-28 pb-16 relative z-10">
        <div className="container mx-auto px-4">
          <GlassPanel className="max-w-4xl mx-auto p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground mb-8">
              Last updated: {lastUpdated}
            </p>

            <div className="prose prose-invert max-w-none space-y-8">
              {/* Introduction */}
              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  1. Introduction
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Welcome to Uplyst ("Company", "we", "our", "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site or use our services.
                </p>
              </section>

              {/* Information We Collect */}
              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  2. Information We Collect
                </h2>
                
                <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
                  2.1 Personal Information You Provide
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  We collect personal information that you voluntarily provide to us when you:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3 ml-4">
                  <li>Register for our waitlist or create an account</li>
                  <li>Express interest in obtaining information about us or our products</li>
                  <li>Participate in activities on our platform</li>
                  <li>Contact us directly</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  The personal information we collect may include:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3 ml-4">
                  <li>Name and email address</li>
                  <li>Professional information (job title, seniority level, target roles)</li>
                  <li>Resume and career-related documents</li>
                  <li>Communication preferences</li>
                </ul>

                <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
                  2.2 Information Automatically Collected
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  We automatically collect certain information when you visit, use, or navigate our platform. This information may include:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3 ml-4">
                  <li>Device and browser information</li>
                  <li>IP address and location data</li>
                  <li>Usage patterns and preferences</li>
                  <li>Referring URLs and access times</li>
                </ul>
              </section>

              {/* How We Use Your Information */}
              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  3. How We Use Your Information
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use the information we collect or receive to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3 ml-4">
                  <li>Provide, operate, and maintain our services</li>
                  <li>Improve and personalize your experience</li>
                  <li>Process your waitlist registration and notify you of updates</li>
                  <li>Send you marketing and promotional communications (with your consent)</li>
                  <li>Respond to your comments, questions, and support requests</li>
                  <li>Analyze usage trends and optimize our platform</li>
                  <li>Protect against fraudulent or unauthorized activity</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              {/* Sharing Your Information */}
              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  4. Sharing Your Information
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may share your information in the following situations:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3 ml-4">
                  <li><strong className="text-foreground">Service Providers:</strong> With third-party vendors who perform services on our behalf</li>
                  <li><strong className="text-foreground">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  <li><strong className="text-foreground">Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong className="text-foreground">With Your Consent:</strong> When you have given us specific permission</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  We do not sell your personal information to third parties.
                </p>
              </section>

              {/* Data Security */}
              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  5. Data Security
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We implement appropriate technical and organizational security measures designed to protect your personal information. However, no electronic transmission or storage system is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              {/* Your Privacy Rights */}
              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  6. Your Privacy Rights
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Depending on your location, you may have certain rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3 ml-4">
                  <li><strong className="text-foreground">Access:</strong> Request access to your personal information</li>
                  <li><strong className="text-foreground">Correction:</strong> Request correction of inaccurate data</li>
                  <li><strong className="text-foreground">Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong className="text-foreground">Portability:</strong> Request a copy of your data in a portable format</li>
                  <li><strong className="text-foreground">Opt-out:</strong> Opt out of marketing communications</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  To exercise any of these rights, please contact us at{" "}
                  <a href="mailto:privacy@uplyst.co" className="text-primary hover:underline">
                    privacy@uplyst.co
                  </a>
                </p>
              </section>

              {/* Cookies */}
              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  7. Cookies and Tracking Technologies
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use cookies and similar tracking technologies to collect and store information about your interactions with our platform. You can control cookies through your browser settings, though disabling them may affect functionality.
                </p>
              </section>

              {/* Children's Privacy */}
              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  8. Children's Privacy
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
                </p>
              </section>

              {/* Changes */}
              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  9. Changes to This Policy
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this privacy policy from time to time. The updated version will be indicated by an updated "Last updated" date. We encourage you to review this policy periodically.
                </p>
              </section>

              {/* Contact */}
              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  10. Contact Us
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have questions or comments about this policy, you may contact us at:
                </p>
                <div className="mt-4 p-4 bg-card/50 rounded-lg border border-border/50">
                  <p className="text-foreground font-semibold">Uplyst</p>
                  <p className="text-muted-foreground">Email: privacy@uplyst.co</p>
                </div>
              </section>
            </div>
          </GlassPanel>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
