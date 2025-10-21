"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAnimation } from "./AnimationProvider";

interface ScrollAnimatedProps {
  children: React.ReactNode;
  animation?:
    | "fade-in"
    | "slide-in-left"
    | "slide-in-right"
    | "scale-in"
    | "pixel-bounce";
  delay?: number;
  threshold?: number;
  triggerOnce?: boolean;
  className?: string;
}

export function ScrollAnimated({
  children,
  animation = "fade-in",
  delay = 0,
  threshold = 0.1,
  triggerOnce = true,
  className = "",
}: ScrollAnimatedProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { enableAnimations } = useAnimation();

  useEffect(() => {
    if (!enableAnimations) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (triggerOnce && hasAnimated) return;

          setTimeout(() => {
            setIsVisible(true);
            setHasAnimated(true);
          }, delay);
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold },
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [enableAnimations, delay, threshold, triggerOnce, hasAnimated]);

  const getAnimationClass = () => {
    if (!enableAnimations) return "";

    if (!isVisible) {
      return "opacity-0";
    }

    switch (animation) {
      case "slide-in-left":
        return "animate-slide-in-left";
      case "slide-in-right":
        return "animate-slide-in-right";
      case "scale-in":
        return "animate-scale-in";
      case "pixel-bounce":
        return "animate-pixel-bounce";
      default:
        return "animate-fade-in";
    }
  };

  return (
    <div ref={ref} className={`${className} ${getAnimationClass()}`}>
      {children}
    </div>
  );
}
