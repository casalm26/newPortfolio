"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ScrollAnimationProps {
  children: React.ReactNode;
  animation?:
    | "fadeIn"
    | "slideUp"
    | "slideLeft"
    | "slideRight"
    | "scaleIn"
    | "rotateIn"
    | "pixelGlitch"
    | "pixelPop"
    | "matrixFall"
    | "scanlines";
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
  once?: boolean;
}

const animationClasses = {
  fadeIn: {
    initial: "opacity-0",
    animate: "opacity-100",
    transition: "transition-opacity",
  },
  slideUp: {
    initial: "opacity-0 translate-y-8",
    animate: "opacity-100 translate-y-0",
    transition: "transition-all",
  },
  slideLeft: {
    initial: "opacity-0 translate-x-8",
    animate: "opacity-100 translate-x-0",
    transition: "transition-all",
  },
  slideRight: {
    initial: "opacity-0 -translate-x-8",
    animate: "opacity-100 translate-x-0",
    transition: "transition-all",
  },
  scaleIn: {
    initial: "opacity-0 scale-95",
    animate: "opacity-100 scale-100",
    transition: "transition-all",
  },
  rotateIn: {
    initial: "opacity-0 rotate-6 scale-95",
    animate: "opacity-100 rotate-0 scale-100",
    transition: "transition-all",
  },
  pixelGlitch: {
    initial: "opacity-0 translate-x-1 translate-y-1",
    animate: "opacity-100 translate-x-0 translate-y-0",
    transition: "transition-all",
  },
  pixelPop: {
    initial: "opacity-0 scale-0",
    animate: "opacity-100 scale-100",
    transition: "transition-all",
  },
  matrixFall: {
    initial: "opacity-0 -translate-y-8 blur-sm",
    animate: "opacity-100 translate-y-0 blur-0",
    transition: "transition-all",
  },
  scanlines: {
    initial: "opacity-0 scale-y-0",
    animate: "opacity-100 scale-y-100",
    transition: "transition-all",
  },
};

export default function ScrollAnimation({
  children,
  animation = "fadeIn",
  delay = 0,
  duration = 600,
  threshold = 0.1,
  className,
  once = true,
}: ScrollAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!once || !hasAnimated)) {
          setTimeout(() => {
            setIsVisible(true);
            setHasAnimated(true);
          }, delay);
        } else if (!entry.isIntersecting && !once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [delay, threshold, once, hasAnimated]);

  const animationConfig = animationClasses[animation];
  const durationClass = `duration-${Math.min(duration, 1000)}`;

  // Special pixel art effects
  const getPixelEffects = () => {
    const effects: React.CSSProperties = {};

    if (animation === "pixelGlitch" && isVisible) {
      effects.textShadow = "2px 0 #ff0000, -2px 0 #00ffff";
      effects.filter = "contrast(1.2) saturate(1.1)";
    }

    if (animation === "scanlines" && isVisible) {
      effects.background = `
        linear-gradient(90deg, transparent 98%, rgba(255,255,255,0.03) 100%)
      `;
      effects.backgroundSize = "3px 100%";
    }

    if (animation === "matrixFall" && isVisible) {
      effects.filter = "drop-shadow(0 0 2px #00ff00)";
    }

    return effects;
  };

  return (
    <div
      ref={elementRef}
      className={cn(
        animationConfig.initial,
        animationConfig.transition,
        durationClass,
        isVisible && animationConfig.animate,
        // Add pixel-perfect rendering for pixel art animations
        (animation === "pixelGlitch" ||
          animation === "pixelPop" ||
          animation === "scanlines") &&
          "pixel-perfect",
        className,
      )}
      style={{
        transitionDuration: `${duration}ms`,
        imageRendering: animation.includes("pixel") ? "pixelated" : undefined,
        ...getPixelEffects(),
      }}
    >
      {children}
    </div>
  );
}

// Hook for programmatic scroll animations
export function useScrollAnimation(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold]);

  return { isVisible, elementRef };
}

// Parallax scroll effect component
interface ParallaxProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
}

export function ParallaxScroll({
  children,
  speed = 0.5,
  className,
  direction = "up",
}: ParallaxProps) {
  const [offsetY, setOffsetY] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return;

      const rect = elementRef.current.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

      if (isInViewport) {
        const scrollY = window.pageYOffset;
        const elementTop = rect.top + scrollY;
        const relativeY = scrollY - elementTop;
        setOffsetY(relativeY * speed);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [speed]);

  const getTransform = () => {
    switch (direction) {
      case "up":
        return `translateY(${-offsetY}px)`;
      case "down":
        return `translateY(${offsetY}px)`;
      case "left":
        return `translateX(${-offsetY}px)`;
      case "right":
        return `translateX(${offsetY}px)`;
      default:
        return `translateY(${-offsetY}px)`;
    }
  };

  return (
    <div ref={elementRef} className={cn("overflow-hidden", className)}>
      <div
        style={{
          transform: getTransform(),
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// Stagger animation for lists
interface StaggerAnimationProps {
  children: React.ReactNode[];
  animation?:
    | "fadeIn"
    | "slideUp"
    | "slideLeft"
    | "slideRight"
    | "pixelGlitch"
    | "pixelPop"
    | "matrixFall"
    | "scanlines";
  staggerDelay?: number;
  initialDelay?: number;
  className?: string;
}

export function StaggerAnimation({
  children,
  animation = "slideUp",
  staggerDelay = 100,
  initialDelay = 0,
  className,
}: StaggerAnimationProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <ScrollAnimation
          key={index}
          animation={animation}
          delay={initialDelay + index * staggerDelay}
          once={true}
        >
          {child}
        </ScrollAnimation>
      ))}
    </div>
  );
}
