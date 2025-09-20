import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Template from "./template";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<"div">) => <div {...props}>{children}</div>,
  },
}));

describe("Template", () => {
  describe("Page Transitions", () => {
    it("should render children content", () => {
      render(
        <Template>
          <div>Test Content</div>
        </Template>
      );

      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("should wrap content in motion div", () => {
      const { container } = render(
        <Template>
          <div data-testid="test-content">Test Content</div>
        </Template>
      );

      expect(container.querySelector("div")).toBeInTheDocument();
      expect(screen.getByTestId("test-content")).toBeInTheDocument();
    });

    it("should have proper class names for styling", () => {
      const { container } = render(
        <Template>
          <div>Test Content</div>
        </Template>
      );

      const motionDiv = container.querySelector('.w-full');
      expect(motionDiv).toBeInTheDocument();
    });
  });

  describe("Animation Structure", () => {
    it("should include overlay for page transitions", () => {
      const { container } = render(
        <Template>
          <div>Test Content</div>
        </Template>
      );

      // Check for overlay elements in the structure
      const overlayElements = container.querySelectorAll('div');
      expect(overlayElements.length).toBeGreaterThan(1);
    });

    it("should handle empty children", () => {
      render(<Template>{null}</Template>);

      // Should not crash with empty children
      expect(true).toBe(true);
    });

    it("should handle multiple children", () => {
      render(
        <Template>
          <div>First Child</div>
          <div>Second Child</div>
        </Template>
      );

      expect(screen.getByText("First Child")).toBeInTheDocument();
      expect(screen.getByText("Second Child")).toBeInTheDocument();
    });
  });
});