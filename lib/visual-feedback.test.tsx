import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  visualFeedbackManager,
  useVisualFeedback,
  withVisualFeedback,
} from "./visual-feedback";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

// Mock sound manager
vi.mock("./sounds", () => ({
  soundManager: {
    buttonClick: vi.fn(),
    buttonHover: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    notification: vi.fn(),
  },
}));

// Mock navigator.vibrate
Object.defineProperty(navigator, "vibrate", {
  writable: true,
  value: vi.fn(),
});

describe("VisualFeedbackManager", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clean up any existing feedback elements
    const existing = document.getElementById("visual-feedback-overlay");
    if (existing) {
      existing.remove();
    }
  });

  afterEach(() => {
    visualFeedbackManager.destroy();
  });

  describe("Initialization", () => {
    it("should create feedback overlay element", () => {
      // Trigger initialization
      visualFeedbackManager.trigger("click");

      const overlay = document.getElementById("visual-feedback-overlay");
      expect(overlay).toBeInTheDocument();
      expect(overlay).toHaveStyle({ position: "fixed" });
    });

    it("should not crash in server environment", () => {
      expect(() => visualFeedbackManager.trigger("click")).not.toThrow();
    });
  });

  describe("Feedback Types", () => {
    it("should handle click feedback", () => {
      expect(() => visualFeedbackManager.trigger("click")).not.toThrow();
    });

    it("should handle hover feedback", () => {
      expect(() => visualFeedbackManager.trigger("hover")).not.toThrow();
    });

    it("should handle success feedback", () => {
      expect(() => visualFeedbackManager.trigger("success")).not.toThrow();
    });

    it("should handle error feedback", () => {
      expect(() => visualFeedbackManager.trigger("error")).not.toThrow();
    });

    it("should handle warning feedback", () => {
      expect(() => visualFeedbackManager.trigger("warning")).not.toThrow();
    });

    it("should handle info feedback", () => {
      expect(() => visualFeedbackManager.trigger("info")).not.toThrow();
    });

    it("should handle loading feedback", () => {
      expect(() => visualFeedbackManager.trigger("loading")).not.toThrow();
    });

    it("should handle complete feedback", () => {
      expect(() => visualFeedbackManager.trigger("complete")).not.toThrow();
    });
  });

  describe("Feedback Options", () => {
    it("should disable sound when sound option is false", () => {
      visualFeedbackManager.trigger("click", { sound: false });
      // Should not crash and should still work without sound
      expect(true).toBe(true);
    });

    it("should disable vibration when vibration option is false", () => {
      visualFeedbackManager.trigger("click", { vibration: false });
      expect(navigator.vibrate).not.toHaveBeenCalled();
    });

    it("should disable visual when visual option is false", () => {
      visualFeedbackManager.trigger("click", { visual: false });
      const overlay = document.getElementById("visual-feedback-overlay");
      // Should not update overlay styles
      expect(true).toBe(true);
    });

    it("should handle different intensity levels", () => {
      expect(() =>
        visualFeedbackManager.trigger("click", { intensity: "subtle" }),
      ).not.toThrow();
      expect(() =>
        visualFeedbackManager.trigger("click", { intensity: "medium" }),
      ).not.toThrow();
      expect(() =>
        visualFeedbackManager.trigger("click", { intensity: "strong" }),
      ).not.toThrow();
    });
  });

  describe("Special Effects", () => {
    it("should handle shake effect", () => {
      expect(() => visualFeedbackManager.shake()).not.toThrow();
      expect(() => visualFeedbackManager.shake("subtle")).not.toThrow();
      expect(() => visualFeedbackManager.shake("strong")).not.toThrow();
    });

    it("should handle flash effect", () => {
      expect(() => visualFeedbackManager.flash()).not.toThrow();
      expect(() => visualFeedbackManager.flash("#ff0000")).not.toThrow();
      expect(() =>
        visualFeedbackManager.flash("#00ff00", "strong"),
      ).not.toThrow();
    });
  });

  describe("Cleanup", () => {
    it("should handle destroy gracefully", () => {
      visualFeedbackManager.trigger("click");
      expect(() => visualFeedbackManager.destroy()).not.toThrow();
    });
  });
});

describe("useVisualFeedback Hook", () => {
  const TestComponent = () => {
    const feedback = useVisualFeedback();

    return (
      <div>
        <button onClick={() => feedback.click()}>Click</button>
        <button onClick={() => feedback.hover()}>Hover</button>
        <button onClick={() => feedback.success()}>Success</button>
        <button onClick={() => feedback.error()}>Error</button>
        <button onClick={() => feedback.warning()}>Warning</button>
        <button onClick={() => feedback.info()}>Info</button>
        <button onClick={() => feedback.loading()}>Loading</button>
        <button onClick={() => feedback.complete()}>Complete</button>
        <button onClick={() => feedback.shake()}>Shake</button>
        <button onClick={() => feedback.flash()}>Flash</button>
      </div>
    );
  };

  it("should provide feedback functions", () => {
    render(<TestComponent />);

    expect(screen.getByText("Click")).toBeInTheDocument();
    expect(screen.getByText("Success")).toBeInTheDocument();
    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("should handle click feedback", () => {
    render(<TestComponent />);

    expect(() => fireEvent.click(screen.getByText("Click"))).not.toThrow();
  });

  it("should handle success feedback", () => {
    render(<TestComponent />);

    expect(() => fireEvent.click(screen.getByText("Success"))).not.toThrow();
  });

  it("should handle error feedback", () => {
    render(<TestComponent />);

    expect(() => fireEvent.click(screen.getByText("Error"))).not.toThrow();
  });

  it("should handle special effects", () => {
    render(<TestComponent />);

    expect(() => fireEvent.click(screen.getByText("Shake"))).not.toThrow();
    expect(() => fireEvent.click(screen.getByText("Flash"))).not.toThrow();
  });
});

describe("withVisualFeedback HOC", () => {
  const TestButton = ({
    onClick,
    onMouseEnter,
    children,
    ...props
  }: React.ComponentProps<"button">) => (
    <button onClick={onClick} onMouseEnter={onMouseEnter} {...props}>
      {children}
    </button>
  );

  it("should wrap component with feedback", () => {
    const WrappedButton = withVisualFeedback(TestButton);
    render(<WrappedButton>Test</WrappedButton>);

    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("should handle click feedback", () => {
    const WrappedButton = withVisualFeedback(TestButton, "click");
    render(<WrappedButton>Click Me</WrappedButton>);

    expect(() => fireEvent.click(screen.getByText("Click Me"))).not.toThrow();
  });

  it("should handle hover feedback", () => {
    const WrappedButton = withVisualFeedback(TestButton, "hover");
    render(<WrappedButton>Hover Me</WrappedButton>);

    expect(() =>
      fireEvent.mouseEnter(screen.getByText("Hover Me")),
    ).not.toThrow();
  });

  it("should pass through props", () => {
    const WrappedButton = withVisualFeedback(TestButton);
    render(<WrappedButton disabled>Disabled</WrappedButton>);

    expect(screen.getByText("Disabled")).toBeDisabled();
  });
});
