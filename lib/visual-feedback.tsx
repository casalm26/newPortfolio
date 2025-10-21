// Visual feedback system for user interactions
// Provides consistent visual responses across the application

import { useCallback, useRef } from "react";
import { soundManager } from "./sounds";

export interface FeedbackOptions {
  sound?: boolean;
  vibration?: boolean;
  visual?: boolean;
  intensity?: "subtle" | "medium" | "strong";
}

export type FeedbackType =
  | "click"
  | "hover"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "loading"
  | "complete";

class VisualFeedbackManager {
  private feedbackElement: HTMLElement | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.createFeedbackElement();
    }
  }

  private createFeedbackElement() {
    this.feedbackElement = document.createElement("div");
    this.feedbackElement.id = "visual-feedback-overlay";
    this.feedbackElement.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.1s ease-out;
    `;
    document.body.appendChild(this.feedbackElement);
  }

  private getIntensityValues(intensity: "subtle" | "medium" | "strong") {
    switch (intensity) {
      case "subtle":
        return { opacity: 0.1, duration: 100, vibration: 10 };
      case "medium":
        return { opacity: 0.2, duration: 150, vibration: 20 };
      case "strong":
        return { opacity: 0.3, duration: 200, vibration: 50 };
      default:
        return { opacity: 0.2, duration: 150, vibration: 20 };
    }
  }

  private getTypeColors(type: FeedbackType): { color: string; shadow: string } {
    switch (type) {
      case "success":
        return {
          color: "rgba(34, 197, 94, 0.3)",
          shadow: "0 0 20px rgba(34, 197, 94, 0.5)",
        };
      case "error":
        return {
          color: "rgba(239, 68, 68, 0.3)",
          shadow: "0 0 20px rgba(239, 68, 68, 0.5)",
        };
      case "warning":
        return {
          color: "rgba(245, 158, 11, 0.3)",
          shadow: "0 0 20px rgba(245, 158, 11, 0.5)",
        };
      case "info":
        return {
          color: "rgba(59, 130, 246, 0.3)",
          shadow: "0 0 20px rgba(59, 130, 246, 0.5)",
        };
      case "loading":
        return {
          color: "rgba(168, 85, 247, 0.3)",
          shadow: "0 0 20px rgba(168, 85, 247, 0.5)",
        };
      case "complete":
        return {
          color: "rgba(34, 197, 94, 0.3)",
          shadow: "0 0 20px rgba(34, 197, 94, 0.5)",
        };
      case "hover":
        return {
          color: "rgba(255, 255, 255, 0.1)",
          shadow: "0 0 10px rgba(255, 255, 255, 0.3)",
        };
      default: // click
        return {
          color: "rgba(255, 255, 255, 0.2)",
          shadow: "0 0 15px rgba(255, 255, 255, 0.4)",
        };
    }
  }

  trigger(type: FeedbackType, options: FeedbackOptions = {}) {
    const {
      sound = true,
      vibration = true,
      visual = true,
      intensity = "medium",
    } = options;

    // Sound feedback
    if (sound) {
      switch (type) {
        case "click":
          soundManager.buttonClick();
          break;
        case "hover":
          soundManager.buttonHover();
          break;
        case "success":
        case "complete":
          soundManager.success();
          break;
        case "error":
          soundManager.error();
          break;
        case "loading":
          soundManager.loading();
          break;
        case "info":
        case "warning":
          soundManager.notification();
          break;
      }
    }

    // Haptic feedback (vibration)
    if (vibration && "vibrate" in navigator) {
      const { vibration: vibrationDuration } =
        this.getIntensityValues(intensity);
      navigator.vibrate(vibrationDuration);
    }

    // Visual feedback
    if (visual && this.feedbackElement) {
      this.showVisualFeedback(type, intensity);
    }
  }

  private showVisualFeedback(
    type: FeedbackType,
    intensity: "subtle" | "medium" | "strong",
  ) {
    if (!this.feedbackElement) return;

    const { opacity, duration } = this.getIntensityValues(intensity);
    const { color, shadow } = this.getTypeColors(type);

    // Set feedback style
    this.feedbackElement.style.backgroundColor = color;
    this.feedbackElement.style.boxShadow = shadow;
    this.feedbackElement.style.opacity = opacity.toString();

    // Clear any existing timeout
    const existingTimeout = this.feedbackElement.dataset.timeout;
    if (existingTimeout) {
      clearTimeout(parseInt(existingTimeout));
    }

    // Fade out after duration
    const timeoutId = setTimeout(() => {
      if (this.feedbackElement) {
        this.feedbackElement.style.opacity = "0";
      }
    }, duration);

    this.feedbackElement.dataset.timeout = timeoutId.toString();
  }

  // Screen shake effect for strong feedback
  shake(intensity: "subtle" | "medium" | "strong" = "medium") {
    if (typeof window === "undefined") return;

    const { duration } = this.getIntensityValues(intensity);
    const shakeAmount =
      intensity === "subtle" ? 2 : intensity === "medium" ? 4 : 6;

    const originalTransform = document.body.style.transform;

    const shakeFrames = [
      `translateX(${shakeAmount}px)`,
      `translateX(-${shakeAmount}px)`,
      `translateX(${shakeAmount}px)`,
      `translateX(-${shakeAmount}px)`,
      "translateX(0)",
    ];

    let frameIndex = 0;
    const interval = setInterval(() => {
      if (frameIndex >= shakeFrames.length) {
        clearInterval(interval);
        document.body.style.transform = originalTransform;
        return;
      }

      document.body.style.transform = shakeFrames[frameIndex];
      frameIndex++;
    }, duration / shakeFrames.length);
  }

  // Flash effect for important notifications
  flash(
    color: string = "#ffffff",
    intensity: "subtle" | "medium" | "strong" = "medium",
  ) {
    if (!this.feedbackElement) return;

    const { opacity, duration } = this.getIntensityValues(intensity);

    this.feedbackElement.style.backgroundColor = color;
    this.feedbackElement.style.opacity = opacity.toString();

    setTimeout(() => {
      if (this.feedbackElement) {
        this.feedbackElement.style.opacity = "0";
      }
    }, duration);
  }

  // Cleanup
  destroy() {
    if (this.feedbackElement && this.feedbackElement.parentNode) {
      this.feedbackElement.parentNode.removeChild(this.feedbackElement);
      this.feedbackElement = null;
    }
  }
}

// Create singleton instance
export const visualFeedbackManager = new VisualFeedbackManager();

// React hook for using visual feedback
export function useVisualFeedback() {
  const triggerRef = useRef<{ [key: string]: () => void }>({});

  const trigger = useCallback(
    (type: FeedbackType, options?: FeedbackOptions) => {
      visualFeedbackManager.trigger(type, options);
    },
    [],
  );

  const shake = useCallback((intensity?: "subtle" | "medium" | "strong") => {
    visualFeedbackManager.shake(intensity);
  }, []);

  const flash = useCallback(
    (color?: string, intensity?: "subtle" | "medium" | "strong") => {
      visualFeedbackManager.flash(color, intensity);
    },
    [],
  );

  // Memoized feedback functions
  const click = useCallback(
    (options?: FeedbackOptions) => trigger("click", options),
    [trigger],
  );
  const hover = useCallback(
    (options?: FeedbackOptions) => trigger("hover", options),
    [trigger],
  );
  const success = useCallback(
    (options?: FeedbackOptions) => trigger("success", options),
    [trigger],
  );
  const error = useCallback(
    (options?: FeedbackOptions) => trigger("error", options),
    [trigger],
  );
  const warning = useCallback(
    (options?: FeedbackOptions) => trigger("warning", options),
    [trigger],
  );
  const info = useCallback(
    (options?: FeedbackOptions) => trigger("info", options),
    [trigger],
  );
  const loading = useCallback(
    (options?: FeedbackOptions) => trigger("loading", options),
    [trigger],
  );
  const complete = useCallback(
    (options?: FeedbackOptions) => trigger("complete", options),
    [trigger],
  );

  return {
    trigger,
    click,
    hover,
    success,
    error,
    warning,
    info,
    loading,
    complete,
    shake,
    flash,
  };
}

// Higher-order component for automatic feedback
export function withVisualFeedback<P extends Record<string, unknown>>(
  Component: React.ComponentType<P>,
  feedbackType: FeedbackType = "click",
  options?: FeedbackOptions,
) {
  return function WrappedComponent(props: P) {
    const feedback = useVisualFeedback();

    const handleInteraction = useCallback(() => {
      feedback.trigger(feedbackType, options);
    }, [feedback]);

    return (
      <Component
        {...props}
        onClick={handleInteraction}
        onMouseEnter={
          feedbackType === "hover" ? handleInteraction : props.onMouseEnter
        }
      />
    );
  };
}
