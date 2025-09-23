"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import { createIntersectionObserver } from "@/lib/image-utils";

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  triggerOnce?: boolean;
}

/**
 * A component that lazy loads its children when they come into view
 * Useful for performance optimization of heavy components or images
 */
export function LazySection({
  children,
  fallback = null,
  rootMargin = "100px",
  threshold = 0.1,
  className,
  as: Component = "div",
  triggerOnce = true,
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;

      if (entry.isIntersecting) {
        setIsVisible(true);
        setHasTriggered(true);

        if (triggerOnce && observerRef.current) {
          observerRef.current.disconnect();
        }
      } else if (!triggerOnce && hasTriggered) {
        setIsVisible(false);
      }
    };

    observerRef.current = createIntersectionObserver(handleIntersection, {
      rootMargin,
      threshold,
    });

    if (observerRef.current) {
      observerRef.current.observe(element);
    } else {
      // Fallback for unsupported browsers
      setIsVisible(true);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [rootMargin, threshold, triggerOnce, hasTriggered]);

  const shouldRender = isVisible || (triggerOnce && hasTriggered);

  return (
    <Component
      ref={elementRef as React.RefObject<HTMLElement>["current"]}
      className={className}
    >
      {shouldRender ? children : fallback}
    </Component>
  );
}

/**
 * Hook version for more flexible usage
 */
export function useIntersectionObserver(
  options: {
    rootMargin?: string;
    threshold?: number;
    triggerOnce?: boolean;
  } = {}
) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const { rootMargin = "100px", threshold = 0.1, triggerOnce = true } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;

      if (entry.isIntersecting) {
        setIsVisible(true);
        setHasTriggered(true);

        if (triggerOnce && observerRef.current) {
          observerRef.current.disconnect();
        }
      } else if (!triggerOnce && hasTriggered) {
        setIsVisible(false);
      }
    };

    observerRef.current = createIntersectionObserver(handleIntersection, {
      rootMargin,
      threshold,
    });

    if (observerRef.current) {
      observerRef.current.observe(element);
    } else {
      // Fallback for unsupported browsers
      setIsVisible(true);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [rootMargin, threshold, triggerOnce, hasTriggered]);

  return {
    ref: elementRef,
    isVisible: isVisible || (triggerOnce && hasTriggered),
    hasTriggered,
  };
}