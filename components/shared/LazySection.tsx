"use client";

import {
  useState,
  useEffect,
  useRef,
  ReactNode,
  useCallback,
} from "react";
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
  const [observedElement, setObservedElement] = useState<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (!observedElement) return;

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;

      if (entry.isIntersecting) {
        setIsVisible(true);
        setHasTriggered(true);
        hasTriggeredRef.current = true;

        if (triggerOnce && observerRef.current) {
          observerRef.current.disconnect();
        }
      } else if (!triggerOnce && hasTriggeredRef.current) {
        setIsVisible(false);
      }
    };

    observerRef.current = createIntersectionObserver(handleIntersection, {
      rootMargin,
      threshold,
    });

    if (observerRef.current) {
      observerRef.current.observe(observedElement);
    } else {
      // Fallback for unsupported browsers
      setIsVisible(true);
      setHasTriggered(true);
      hasTriggeredRef.current = true;
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [observedElement, rootMargin, threshold, triggerOnce]);

  const shouldRender = isVisible || (triggerOnce && hasTriggered);

  const setElementRef = useCallback(
    (node: HTMLElement | null) => {
      elementRef.current = node;
      setObservedElement((prev) => {
        if (prev === node) {
          return prev;
        }

        if (node) {
          if (triggerOnce) {
            if (hasTriggeredRef.current) {
              setIsVisible(true);
            }
          } else {
            hasTriggeredRef.current = false;
            setHasTriggered(false);
            setIsVisible(false);
          }
        }

        return node;
      });
    },
    [triggerOnce]
  );

  return (
    <Component ref={setElementRef} className={className}>
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
  const [observedElement, setObservedElement] = useState<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const hasTriggeredRef = useRef(false);

  const { rootMargin = "100px", threshold = 0.1, triggerOnce = true } = options;

  useEffect(() => {
    if (!observedElement) return;

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;

      if (entry.isIntersecting) {
        setIsVisible(true);
        setHasTriggered(true);
        hasTriggeredRef.current = true;

        if (triggerOnce && observerRef.current) {
          observerRef.current.disconnect();
        }
      } else if (!triggerOnce && hasTriggeredRef.current) {
        setIsVisible(false);
      }
    };

    observerRef.current = createIntersectionObserver(handleIntersection, {
      rootMargin,
      threshold,
    });

    if (observerRef.current) {
      observerRef.current.observe(observedElement);
    } else {
      // Fallback for unsupported browsers
      setIsVisible(true);
      setHasTriggered(true);
      hasTriggeredRef.current = true;
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [observedElement, rootMargin, threshold, triggerOnce]);

  const setHookElementRef = useCallback(
    (node: HTMLElement | null) => {
      elementRef.current = node;
      setObservedElement((prev) => {
        if (prev === node) {
          return prev;
        }

        if (node) {
          if (triggerOnce) {
            if (hasTriggeredRef.current) {
              setIsVisible(true);
            }
          } else {
            hasTriggeredRef.current = false;
            setHasTriggered(false);
            setIsVisible(false);
          }
        }

        return node;
      });
    },
    [triggerOnce]
  );

  return {
    ref: setHookElementRef,
    isVisible: isVisible || (triggerOnce && hasTriggered),
    hasTriggered,
  };
}