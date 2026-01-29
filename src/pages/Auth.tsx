import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Auth3DLogo } from "@/components/Auth3DLogo";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SignalButton } from "@/components/ui/SignalButton";
import { SignalLogo } from "@/components/SignalLogo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Loader2, Mail, Lock, User, ChevronLeft } from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().trim().email({ message: "Invalid email address" });
const passwordSchema = z.string().min(6, { message: "Password must be at least 6 characters" });

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          navigate("/");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const validateInputs = () => {
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      toast({
        title: "Invalid Email",
        description: emailResult.error.errors[0].message,
        variant: "destructive",
      });
      return false;
    }

    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      toast({
        title: "Invalid Password",
        description: passwordResult.error.errors[0].message,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setLoading(true);
    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName.trim(),
        },
      },
    });

    if (error) {
      if (error.message.includes("already registered")) {
        toast({
          title: "Account Exists",
          description: "This email is already registered. Please sign in instead.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Welcome!",
        description: "Your account has been created successfully.",
      });
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google");
      if (result.error) {
        toast({
          title: "Google Sign In Failed",
          description: result.error.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Google Sign In Failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
    setGoogleLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex noise-overlay">
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Left side - 3D Logo */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10">
        <Auth3DLogo />
      </div>

      {/* Right side - Auth Section */}
      <div className="w-full lg:w-1/2 relative z-10 flex flex-col min-h-screen bg-gradient-to-br from-card/90 via-card/70 to-primary/5 backdrop-blur-xl border-l border-border/30 overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }} />
        
        {/* Gradient orbs with animation */}
        <div 
          className="absolute -top-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"
          style={{
            animation: 'float-drift 8s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute -bottom-16 -left-16 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none"
          style={{
            animation: 'float-drift 10s ease-in-out infinite reverse'
          }}
        />
        <div 
          className="absolute top-1/2 right-1/4 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none"
          style={{
            animation: 'pulse-glow 6s ease-in-out infinite'
          }}
        />
        
        <style>{`
          @keyframes float-drift {
            0%, 100% {
              transform: translate(0, 0) scale(1);
            }
            25% {
              transform: translate(-10px, 15px) scale(1.05);
            }
            50% {
              transform: translate(5px, -10px) scale(0.95);
            }
            75% {
              transform: translate(-5px, -5px) scale(1.02);
            }
          }
          @keyframes pulse-glow {
            0%, 100% {
              opacity: 0.5;
              transform: scale(1);
            }
            50% {
              opacity: 0.8;
              transform: scale(1.1);
            }
          }
          @keyframes slide-up-fade {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-slide-up-1 {
            animation: slide-up-fade 0.5s ease-out 0.1s both;
          }
          .animate-slide-up-2 {
            animation: slide-up-fade 0.5s ease-out 0.2s both;
          }
          .animate-slide-up-3 {
            animation: slide-up-fade 0.5s ease-out 0.3s both;
          }
          .animate-slide-up-4 {
            animation: slide-up-fade 0.5s ease-out 0.4s both;
          }
          .animate-slide-up-5 {
            animation: slide-up-fade 0.5s ease-out 0.5s both;
          }
          .animate-slide-up-6 {
            animation: slide-up-fade 0.5s ease-out 0.6s both;
          }
        `}</style>
        {/* Mobile header */}
        <header className="lg:hidden p-6 flex items-center justify-between border-b border-border/20">
          <Link to="/" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>
          <SignalLogo size="sm" />
        </header>

        {/* Form container */}
        <main className="flex-1 flex items-center justify-center px-8 lg:px-16 py-12">
          <div className="w-full max-w-sm space-y-8">
            {/* Signal wordmark */}
            <div className="text-center animate-slide-up-1">
              <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
                <span className="font-display text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Signal
                </span>
              </Link>
            </div>

            {/* Header text */}
            <div className="space-y-2 text-center animate-slide-up-2">
              <h1 className="text-2xl font-display font-bold text-foreground">
                {isLogin ? "Welcome back" : "Create your account"}
              </h1>
              <p className="text-muted-foreground text-sm">
                {isLogin
                  ? "Enter your credentials to access your account"
                  : "Get started with Signal today"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={isLogin ? handleLogin : handleSignUp} className="space-y-5 animate-slide-up-3">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-foreground text-sm">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10 bg-background/50 border-border/50 focus:border-primary h-11"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground text-sm">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50 focus:border-primary h-11"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground text-sm">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50 focus:border-primary h-11"
                    required
                  />
                </div>
              </div>

              <SignalButton
                type="submit"
                variant="primary"
                size="lg"
                className="w-full justify-center h-11 text-sm font-semibold"
                disabled={loading || googleLoading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </SignalButton>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              {/* Google Sign In */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading || googleLoading}
                className="w-full flex items-center justify-center gap-3 h-11 rounded-lg border border-border/50 bg-background/50 text-foreground hover:bg-background/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {googleLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="text-sm font-medium">Continue with Google</span>
                  </>
                )}
              </button>
            </form>

            {/* Toggle login/signup */}
            <div className="text-center animate-slide-up-4">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:text-primary/80 transition-colors text-sm"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>

            {/* Trust badges */}
            <div className="pt-8 border-t border-border/20 animate-slide-up-5">
              <p className="text-xs text-muted-foreground text-center mb-4">Trusted by professionals at</p>
              <div className="flex items-center justify-center gap-8 text-muted-foreground/40">
                <span className="text-xs font-semibold tracking-wider">GOOGLE</span>
                <span className="text-xs font-semibold tracking-wider">META</span>
                <span className="text-xs font-semibold tracking-wider">STRIPE</span>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 text-center border-t border-border/20">
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} Signal. All rights reserved.
          </p>
        </footer>
      </div>

      <Toaster />
    </div>
  );
};

export default Auth;
