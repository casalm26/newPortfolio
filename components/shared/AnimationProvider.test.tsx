import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { AnimationProvider, useAnimation } from "./AnimationProvider";

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

// Test component to access the context
function TestComponent() {
  const { isTransitioning, enableAnimations } = useAnimation();
  return (
    <div>
      <span data-testid="transitioning">{isTransitioning.toString()}</span>
      <span data-testid="animations-enabled">
        {enableAnimations.toString()}
      </span>
    </div>
  );
}

describe("AnimationProvider", () => {
  const mockUsePathname = vi.mocked(usePathname);

  beforeEach(() => {
    mockUsePathname.mockReturnValue("/");

    // Mock matchMedia
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  describe("normal usage", () => {
    it("should provide animation context with default values", () => {
      render(
        <AnimationProvider>
          <TestComponent />
        </AnimationProvider>,
      );

      expect(screen.getByTestId("animations-enabled")).toHaveTextContent(
        "true",
      );
    });

    it("should handle pathway changes with transitions", async () => {
      const { rerender } = render(
        <AnimationProvider>
          <TestComponent />
        </AnimationProvider>,
      );

      // Change pathname to trigger transition
      mockUsePathname.mockReturnValue("/about");
      rerender(
        <AnimationProvider>
          <TestComponent />
        </AnimationProvider>,
      );

      // Should be transitioning immediately after pathname change
      expect(screen.getByTestId("transitioning")).toHaveTextContent("true");

      // Wait for transition to complete
      act(() => {
        vi.advanceTimersByTime(350);
      });

      expect(screen.getByTestId("transitioning")).toHaveTextContent("false");
    });

    it("should respect reduced motion preference", () => {
      // Mock reduced motion preference
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: query === "(prefers-reduced-motion: reduce)",
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      render(
        <AnimationProvider>
          <TestComponent />
        </AnimationProvider>,
      );

      expect(screen.getByTestId("animations-enabled")).toHaveTextContent(
        "false",
      );
    });
  });

  describe("edge cases", () => {
    it("should throw error when used outside provider", () => {
      const consoleError = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow("useAnimation must be used within an AnimationProvider");

      consoleError.mockRestore();
    });

    it("should handle multiple rapid pathname changes", async () => {
      const { rerender } = render(
        <AnimationProvider>
          <TestComponent />
        </AnimationProvider>,
      );

      // Rapid pathname changes
      mockUsePathname.mockReturnValue("/page1");
      rerender(
        <AnimationProvider>
          <TestComponent />
        </AnimationProvider>,
      );

      mockUsePathname.mockReturnValue("/page2");
      rerender(
        <AnimationProvider>
          <TestComponent />
        </AnimationProvider>,
      );

      mockUsePathname.mockReturnValue("/page3");
      rerender(
        <AnimationProvider>
          <TestComponent />
        </AnimationProvider>,
      );

      expect(screen.getByTestId("transitioning")).toHaveTextContent("true");
    });
  });

  describe("error conditions", () => {
    it("should handle matchMedia not being available", () => {
      // Remove matchMedia
      const originalMatchMedia = window.matchMedia;
      delete (window as unknown as { matchMedia?: unknown }).matchMedia;

      // Add a console.error spy to suppress the error in test output
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => {
        render(
          <AnimationProvider>
            <TestComponent />
          </AnimationProvider>,
        );
      }).toThrow();

      // Restore matchMedia and clean up
      window.matchMedia = originalMatchMedia;
      consoleSpy.mockRestore();
    });
  });
});
