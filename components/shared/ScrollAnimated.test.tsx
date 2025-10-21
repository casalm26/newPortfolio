import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScrollAnimated } from "./ScrollAnimated";
import { useAnimation } from "./AnimationProvider";

// Mock the animation provider
vi.mock("./AnimationProvider", () => ({
  useAnimation: vi.fn(),
}));

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
const mockObserve = vi.fn();
const mockUnobserve = vi.fn();
const mockDisconnect = vi.fn();

describe("ScrollAnimated", () => {
  const mockUseAnimation = vi.mocked(useAnimation);

  beforeEach(() => {
    mockUseAnimation.mockReturnValue({
      isTransitioning: false,
      setIsTransitioning: vi.fn(),
      enableAnimations: true,
      setEnableAnimations: vi.fn(),
    });

    mockIntersectionObserver.mockImplementation((callback) => ({
      observe: mockObserve,
      unobserve: mockUnobserve,
      disconnect: mockDisconnect,
      callback,
    }));

    global.IntersectionObserver = mockIntersectionObserver;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("normal usage", () => {
    it("should render children with correct animation class", () => {
      render(
        <ScrollAnimated animation="fade-in">
          <div data-testid="content">Test Content</div>
        </ScrollAnimated>,
      );

      expect(screen.getByTestId("content")).toBeInTheDocument();
      expect(mockObserve).toHaveBeenCalled();
    });

    it("should apply different animation classes", () => {
      const animations = [
        "fade-in",
        "slide-in-left",
        "slide-in-right",
        "scale-in",
        "pixel-bounce",
      ] as const;

      animations.forEach((animation) => {
        const { unmount } = render(
          <ScrollAnimated animation={animation}>
            <div data-testid={`content-${animation}`}>Test</div>
          </ScrollAnimated>,
        );

        expect(screen.getByTestId(`content-${animation}`)).toBeInTheDocument();
        unmount();
      });
    });

    it("should show content immediately when animations are disabled", () => {
      mockUseAnimation.mockReturnValue({
        isTransitioning: false,
        setIsTransitioning: vi.fn(),
        enableAnimations: false,
        setEnableAnimations: vi.fn(),
      });

      render(
        <ScrollAnimated>
          <div data-testid="content">Test Content</div>
        </ScrollAnimated>,
      );

      const container = screen.getByTestId("content").parentElement;
      expect(container).not.toHaveClass("opacity-0");
    });

    it("should apply custom className", () => {
      render(
        <ScrollAnimated className="custom-class">
          <div data-testid="content">Test Content</div>
        </ScrollAnimated>,
      );

      const container = screen.getByTestId("content").parentElement;
      expect(container).toHaveClass("custom-class");
    });

    it("should set up IntersectionObserver with correct threshold", () => {
      render(
        <ScrollAnimated threshold={0.5}>
          <div>Test</div>
        </ScrollAnimated>,
      );

      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        { threshold: 0.5 },
      );
    });
  });

  describe("edge cases", () => {
    it("should handle empty children", () => {
      render(<ScrollAnimated>{null}</ScrollAnimated>);

      expect(mockObserve).toHaveBeenCalled();
    });

    it("should handle multiple children", () => {
      render(
        <ScrollAnimated>
          <div data-testid="child1">Child 1</div>
          <div data-testid="child2">Child 2</div>
        </ScrollAnimated>,
      );

      expect(screen.getByTestId("child1")).toBeInTheDocument();
      expect(screen.getByTestId("child2")).toBeInTheDocument();
    });

    it("should handle zero delay", () => {
      render(
        <ScrollAnimated delay={0}>
          <div data-testid="content">Test</div>
        </ScrollAnimated>,
      );

      expect(screen.getByTestId("content")).toBeInTheDocument();
    });

    it("should handle triggerOnce set to false", () => {
      render(
        <ScrollAnimated triggerOnce={false}>
          <div data-testid="content">Test</div>
        </ScrollAnimated>,
      );

      expect(mockObserve).toHaveBeenCalled();
    });
  });

  describe("error conditions", () => {
    it("should handle IntersectionObserver not being available", () => {
      const originalIO = global.IntersectionObserver;
      delete (global as unknown as { IntersectionObserver?: unknown })
        .IntersectionObserver;

      expect(() => {
        render(
          <ScrollAnimated>
            <div>Test</div>
          </ScrollAnimated>,
        );
      }).toThrow();

      global.IntersectionObserver = originalIO;
    });

    it("should handle invalid animation type gracefully", () => {
      // @ts-expect-error - Testing invalid animation
      render(
        <ScrollAnimated animation="invalid">
          <div data-testid="content">Test</div>
        </ScrollAnimated>,
      );

      expect(screen.getByTestId("content")).toBeInTheDocument();
    });

    it("should cleanup observer on unmount", () => {
      const { unmount } = render(
        <ScrollAnimated>
          <div>Test</div>
        </ScrollAnimated>,
      );

      unmount();

      expect(mockUnobserve).toHaveBeenCalled();
    });
  });
});
