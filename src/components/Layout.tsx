import { ReactNode, useEffect } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { AnimatedBackground } from "./AnimatedBackground";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  useEffect(() => {
    // Apply dark mode by default
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="min-h-screen flex flex-col noise-overlay relative">
      <AnimatedBackground />
      <Navbar />
      <main className="flex-1 pt-16 md:pt-20 relative z-10">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
