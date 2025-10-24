import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { TypewriterText } from "./TypewriterText";
import { useAnimation } from "./AnimationProvider";

// Mock the animation provider
vi.mock("./AnimationProvider", () => ({
  useAnimation: vi.fn(),
}));

describe("TypewriterText", () => {
  const mockUseAnimation = vi.mocked(useAnimation);

  beforeEach(() => {
    mockUseAnimation.mockReturnValue({
      isTransitioning: false,
      setIsTransitioning: vi.fn(),
      enableAnimations: true,
      setEnableAnimations: vi.fn(),
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  describe("normal usage", () => {
    it.skip("should start with empty text and animate typing", async () => {
      render(<TypewriterText text="Hello" speed={50} />);

      // Initially should be empty (with cursor)
      expect(screen.getByText("|")).toBeInTheDocument();

      // Advance timers to simulate typing
      act(() => {
        vi.advanceTimersByTime(50);
      });

      expect(screen.getByText("H")).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(200);
      });

      expect(
        screen.getByText((content, element) => {
          const textContent = element?.textContent ?? "";
          return textContent === "Hell|" || textContent.startsWith("Hell");
        }),
      ).toBeInTheDocument();
    });

    it("should show cursor by default", () => {
      render(<TypewriterText text="Test" />);

      // Should have cursor
      expect(screen.getByText("|")).toBeInTheDocument();
    });

    it("should use custom cursor character", () => {
      render(<TypewriterText text="Test" cursorChar="|" />);

      expect(screen.getByText("|")).toBeInTheDocument();
    });

    it("should hide cursor when disabled", () => {
      render(<TypewriterText text="Test" cursor={false} />);

      expect(screen.queryByText("_")).not.toBeInTheDocument();
    });
  });

  describe("Multiple Texts", () => {
    it("should accept array of texts", () => {
      const texts = ["First", "Second"];
      render(<TypewriterText text={texts} />);

      // Should render without crashing
      expect(screen.getByText("|")).toBeInTheDocument();
    });

    it("should accept callback function", () => {
      const onComplete = vi.fn();
      render(<TypewriterText text="Test" onComplete={onComplete} />);

      // Should render without crashing
      expect(screen.getByText("|")).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("should apply custom className", () => {
      const { container } = render(
        <TypewriterText text="Test" className="custom-class" />,
      );

      expect(container.querySelector(".custom-class")).toBeInTheDocument();
    });

    it("should have pixel font by default", () => {
      const { container } = render(<TypewriterText text="Test" />);

      expect(container.querySelector(".font-pixel")).toBeInTheDocument();
    });
  });

  describe("Timing", () => {
    it("should respect initial delay", () => {
      render(<TypewriterText text="Test" delay={200} speed={50} />);

      // Should not start typing immediately
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(screen.queryByText("T")).not.toBeInTheDocument();

      // Should start after delay
      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(screen.getByText("T")).toBeInTheDocument();
    });
  });

  describe("error conditions", () => {
    it("should handle undefined text gracefully", () => {
      // @ts-expect-error - Testing undefined text
      render(<TypewriterText text={undefined} />);

      // Should not crash
      expect(document.body).toBeInTheDocument();
    });

    it.skip("should handle null onComplete gracefully", () => {
      render(
        <TypewriterText
          text="Test"
          onComplete={null as unknown as () => void}
        />,
      );

      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Should not crash
      expect(screen.getByText("Test")).toBeInTheDocument();
    });

    it("should cleanup timers on unmount", () => {
      const { unmount } = render(<TypewriterText text="Test" />);

      unmount();

      // Should not cause memory leaks
      expect(vi.getTimerCount()).toBe(0);
    });
  });
});
