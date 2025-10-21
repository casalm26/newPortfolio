"use client";

import React from "react";
import { useAnimation } from "./AnimationProvider";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({
  children,
  className = "",
}: PageTransitionProps) {
  const { isTransitioning, enableAnimations } = useAnimation();

  if (!enableAnimations) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={`${className} transition-all duration-300 ease-out ${
        isTransitioning
          ? "opacity-0 translate-y-2"
          : "opacity-100 translate-y-0"
      }`}
    >
      {children}
    </div>
  );
}
