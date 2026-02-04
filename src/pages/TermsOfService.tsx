import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { UplystLogo } from "@/components/UplystLogo";
import { SignalButton } from "@/components/ui/SignalButton";
import { ArrowLeft } from "lucide-react";

const TermsOfService = () => {
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
              Terms of Service
            </h1>
            <p className="text-muted-foreground mb-8">
              Last updated: {lastUpdated}
            </p>

            <div className="prose prose-invert max-w-none space-y-8">
              {/* Agreement */}
              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  1. Agreement to Terms
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms of Service ("Terms") constitute a legally binding agreement between you ("User", "you", "your") and Uplyst ("Company", "we", "our", "us") governing your access to and use of the Uplyst website, platform, and services (collectively, the "Services").
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, you must not access or use the Services.
                </p>
              </section>

              {/* Eligibility */}
              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  2. Eligibility
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  You must be at least 18 years of age to use our Services. By using the Services, you represent and warrant that:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3 ml-4">
                  <li>You are at least 18 years of age</li>
                  <li>You have the legal capacity to enter into a binding agreement</li>
                  <li>You are not prohibited from using the Services under applicable laws</li>
                  <li>Your use will not violate any applicable law or regulation</li>
                </ul>
              </section>

              {/* Account Registration */}
              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  3. Account Registration
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  To access certain features of our Services, you may be required to register for an account. When registering, you agree to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3 ml-4">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your information to keep it accurate</li>
                  <li>Keep your account credentials secure and confidential</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>Accept responsibility for all activities under your account</li>
                </ul>
              </section>

              {/* Services Description */}
              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  4. Description of Services
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Uplyst provides AI-powered career acceleration tools designed for senior professionals. Our Services may include:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3 ml-4">
                  <li>Resume optimization and analysis</li>
                  <li>ATS compatibility assessment</li>
                  <li>Outreach content generation</li>
                  <li>Career guidance and recommendations</li>
                  <li>Waitlist and early access programs</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  We reserve the right to modify, suspend, or discontinue any part of the Services at any time without prior notice.
                </p>
              </section>

              {/* User Conduct */}
              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  5. User Conduct
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  You agree not to use the Services to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3 ml-4">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe upon the rights of others</li>
                  <li>Submit false, misleading, or fraudulent information</li>
                  <li>Upload malicious code or attempt to gain unauthorized access</li>
                  <li>Interfere with the proper functioning of the Services</li>
                  <li>Engage in any form of automated data collection without permission</li>
                  <li>Use the Services for any illegal or unauthorized purpose</li>
                  <li>Harass, abuse, or harm other users</li>
                </ul>
              </section>

              {/* User Content */}
              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  6. User Content
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  You retain ownership of any content you submit to the Services ("User Content"). By submitting User Content, you grant us a non-exclusive, worldwide, royalty-free license to use, process, and analyze such content solely for the purpose of providing and improving the Services.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  You represent and warrant that you own or have the necessary rights to submit your User Content and that it does not violate any third-party rights.
                </p>
              </section>

              {/* Intellectual Property */}
              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  7. Intellectual Property
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  The Services, including all content, features, and functionality, are owned by Uplyst and are protected by copyright, trademark, and other intellectual property laws. You may not:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3 ml-4">
                  <li>Copy, modify, or distribute our content without permission</li>
                  <li>Use our trademarks without written authorization</li>
                  <li>Reverse engineer or attempt to extract source code</li>
                  <li>Remove any copyright or proprietary notices</li>
                </ul>
              </section>

              {/* Disclaimers */}
              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  8. Disclaimers
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT GUARANTEE THAT:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3 ml-4">
                  <li>The Services will be uninterrupted or error-free</li>
                  <li>The results obtained will be accurate or reliable</li>
                  <li>The Services will meet your specific requirements</li>
                  <li>Any defects will be corrected</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Uplyst does not guarantee employment outcomes. Our tools are designed to assist your job search, but success depends on many factors beyond our control.
                </p>
              </section>

              {/* Limitation of Liability */}
              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  9. Limitation of Liability
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, UPLYST SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR GOODWILL, ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICES.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Our total liability shall not exceed the amount you paid to us, if any, in the twelve (12) months preceding the claim.
                </p>
              </section>

              {/* Indemnification */}
              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  10. Indemnification
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  You agree to indemnify, defend, and hold harmless Uplyst and its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising out of:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3 ml-4">
                  <li>Your use of the Services</li>
                  <li>Your violation of these Terms</li>
                  <li>Your violation of any third-party rights</li>
                  <li>Your User Content</li>
                </ul>
              </section>

              {/* Termination */}
              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  11. Termination
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may terminate or suspend your access to the Services immediately, without prior notice, for any reason, including if you breach these Terms. Upon termination, your right to use the Services will cease immediately.
                </p>
              </section>

              {/* Governing Law */}
              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  12. Governing Law
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions.
                </p>
              </section>

              {/* Changes */}
              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  13. Changes to Terms
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the updated Terms on our website. Your continued use of the Services after such changes constitutes acceptance of the new Terms.
                </p>
              </section>

              {/* Severability */}
              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  14. Severability
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.
                </p>
              </section>

              {/* Contact */}
              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  15. Contact Us
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have questions about these Terms, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-card/50 rounded-lg border border-border/50">
                  <p className="text-foreground font-semibold">Uplyst</p>
                  <p className="text-muted-foreground">Email: legal@uplyst.co</p>
                </div>
              </section>
            </div>
          </GlassPanel>
        </div>
      </main>
    </div>
  );
};

export default TermsOfService;
