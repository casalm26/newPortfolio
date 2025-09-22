import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageTransition } from "./PageTransition";
import { useAnimation } from "./AnimationProvider";

// Mock the animation provider
vi.mock("./AnimationProvider", () => ({
  useAnimation: vi.fn(),
}));

describe("PageTransition", () => {
  const mockUseAnimation = vi.mocked(useAnimation);

  describe("normal usage", () => {
    it("should render children with transition classes when animations are enabled", () => {
      mockUseAnimation.mockReturnValue({
        isTransitioning: false,
        setIsTransitioning: vi.fn(),
        enableAnimations: true,
        setEnableAnimations: vi.fn(),
      });

      render(
        <PageTransition>
          <div data-testid="content">Test Content</div>
        </PageTransition>
      );

      const container = screen.getByTestId("content").parentElement;
      expect(container).toHaveClass("transition-all", "duration-300", "ease-out");
      expect(container).toHaveClass("opacity-100", "translate-y-0");
    });

    it("should apply transition styles when transitioning", () => {
      mockUseAnimation.mockReturnValue({
        isTransitioning: true,
        setIsTransitioning: vi.fn(),
        enableAnimations: true,
        setEnableAnimations: vi.fn(),
      });

      render(
        <PageTransition>
          <div data-testid="content">Test Content</div>
        </PageTransition>
      );

      const container = screen.getByTestId("content").parentElement;
      expect(container).toHaveClass("opacity-0", "translate-y-2");
    });

    it("should render without transitions when animations are disabled", () => {
      mockUseAnimation.mockReturnValue({
        isTransitioning: false,
        setIsTransitioning: vi.fn(),
        enableAnimations: false,
        setEnableAnimations: vi.fn(),
      });

      render(
        <PageTransition>
          <div data-testid="content">Test Content</div>
        </PageTransition>
      );

      const container = screen.getByTestId("content").parentElement;
      expect(container).not.toHaveClass("transition-all");
      expect(container).not.toHaveClass("opacity-0");
    });

    it("should apply custom className", () => {
      mockUseAnimation.mockReturnValue({
        isTransitioning: false,
        setIsTransitioning: vi.fn(),
        enableAnimations: true,
        setEnableAnimations: vi.fn(),
      });

      render(
        <PageTransition className="custom-class">
          <div data-testid="content">Test Content</div>
        </PageTransition>
      );

      const container = screen.getByTestId("content").parentElement;
      expect(container).toHaveClass("custom-class");
    });
  });

  describe("edge cases", () => {
    it("should handle empty children", () => {
      mockUseAnimation.mockReturnValue({
        isTransitioning: false,
        setIsTransitioning: vi.fn(),
        enableAnimations: true,
        setEnableAnimations: vi.fn(),
      });

      render(<PageTransition>{null}</PageTransition>);

      // Should not crash and should render container
      expect(document.querySelector("div")).toBeTruthy();
    });

    it("should handle multiple children", () => {
      mockUseAnimation.mockReturnValue({
        isTransitioning: false,
        setIsTransitioning: vi.fn(),
        enableAnimations: true,
        setEnableAnimations: vi.fn(),
      });

      render(
        <PageTransition>
          <div data-testid="child1">Child 1</div>
          <div data-testid="child2">Child 2</div>
        </PageTransition>
      );

      expect(screen.getByTestId("child1")).toBeInTheDocument();
      expect(screen.getByTestId("child2")).toBeInTheDocument();
    });
  });

  describe("error conditions", () => {
    it("should handle animation provider errors gracefully", () => {
      mockUseAnimation.mockImplementation(() => {
        throw new Error("Animation provider error");
      });

      expect(() => {
        render(
          <PageTransition>
            <div>Content</div>
          </PageTransition>
        );
      }).toThrow("Animation provider error");
    });
  });
});