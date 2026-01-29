import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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
            <div className="text-center lg:text-left">
              <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
                <span className="font-display text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Signal
                </span>
              </Link>
            </div>

            {/* Header text */}
            <div className="space-y-2 lg:text-left text-center">
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
            <form onSubmit={isLogin ? handleLogin : handleSignUp} className="space-y-5">
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
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </SignalButton>
            </form>

            {/* Toggle login/signup */}
            <div className="text-center">
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
            <div className="pt-8 border-t border-border/20">
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
