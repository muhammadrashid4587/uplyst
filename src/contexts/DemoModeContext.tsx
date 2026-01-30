import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { DemoSettings } from '@/types';

interface DemoModeContextType {
  demoMode: DemoSettings;
  setDemoMode: (settings: DemoSettings) => void;
  toggleDemoMode: () => void;
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined);

const DEMO_MODE_KEY = 'signal-demo-mode';

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const [demoMode, setDemoModeState] = useState<DemoSettings>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(DEMO_MODE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return { enabled: false, showDemoBanner: true };
        }
      }
    }
    return { enabled: false, showDemoBanner: true };
  });

  useEffect(() => {
    localStorage.setItem(DEMO_MODE_KEY, JSON.stringify(demoMode));
  }, [demoMode]);

  const setDemoMode = (settings: DemoSettings) => {
    setDemoModeState(settings);
  };

  const toggleDemoMode = () => {
    setDemoModeState(prev => ({ ...prev, enabled: !prev.enabled }));
  };

  return (
    <DemoModeContext.Provider value={{ demoMode, setDemoMode, toggleDemoMode }}>
      {children}
    </DemoModeContext.Provider>
  );
}

export function useDemoMode() {
  const context = useContext(DemoModeContext);
  if (!context) {
    throw new Error('useDemoMode must be used within a DemoModeProvider');
  }
  return context;
}
