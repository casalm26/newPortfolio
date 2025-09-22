"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface AnimationContextType {
  isTransitioning: boolean;
  setIsTransitioning: (value: boolean) => void;
  enableAnimations: boolean;
  setEnableAnimations: (value: boolean) => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(
  undefined,
);

export function useAnimation() {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error("useAnimation must be used within an AnimationProvider");
  }
  return context;
}

interface AnimationProviderProps {
  children: React.ReactNode;
}

export function AnimationProvider({ children }: AnimationProviderProps) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [enableAnimations, setEnableAnimations] = useState(true);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setEnableAnimations(!mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setEnableAnimations(!e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Handle page transitions
  useEffect(() => {
    if (!enableAnimations) return;

    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 300); // Keep transition short to avoid black screen issues

    return () => clearTimeout(timer);
  }, [pathname, enableAnimations]);

  return (
    <AnimationContext.Provider
      value={{
        isTransitioning,
        setIsTransitioning,
        enableAnimations,
        setEnableAnimations,
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
}