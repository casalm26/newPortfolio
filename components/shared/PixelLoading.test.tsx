import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PixelLoading from "./PixelLoading";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<"div">) => <div {...props}>{children}</div>,
  },
}));

describe("PixelLoading", () => {
  describe("Variants", () => {
    it("should render dots variant by default", () => {
      const { container } = render(<PixelLoading />);

      // Should have dots container
      expect(container.querySelector('.flex.items-center.space-x-1')).toBeInTheDocument();
    });

    it("should render progress variant", () => {
      const { container } = render(<PixelLoading variant="progress" />);

      // Should have progress bar container
      expect(container.querySelector('.border.border-terminal-400')).toBeInTheDocument();
    });

    it("should render spinner variant", () => {
      const { container } = render(<PixelLoading variant="spinner" />);

      // Should have relative positioned container for spinner
      expect(container.querySelector('.relative')).toBeInTheDocument();
    });

    it("should render glitch variant", () => {
      render(<PixelLoading variant="glitch" />);

      // Should render LOADING text by default (appears twice due to glitch overlay)
      expect(screen.getAllByText("LOADING")).toHaveLength(2);
    });
  });

  describe("Sizes", () => {
    it("should apply small size classes", () => {
      const { container } = render(<PixelLoading size="sm" />);

      // Check for small size classes
      expect(container.querySelector('.w-2.h-2')).toBeInTheDocument();
    });

    it("should apply medium size classes by default", () => {
      const { container } = render(<PixelLoading />);

      // Check for medium size classes
      expect(container.querySelector('.w-3.h-3')).toBeInTheDocument();
    });

    it("should apply large size classes", () => {
      const { container } = render(<PixelLoading size="lg" />);

      // Check for large size classes
      expect(container.querySelector('.w-4.h-4')).toBeInTheDocument();
    });
  });

  describe("Text Content", () => {
    it("should render custom text for non-glitch variants", () => {
      render(<PixelLoading text="PROCESSING" />);

      expect(screen.getByText("PROCESSING")).toBeInTheDocument();
    });

    it("should render custom text for glitch variant", () => {
      render(<PixelLoading variant="glitch" text="COMPILING" />);

      // Should render text twice due to glitch overlay
      expect(screen.getAllByText("COMPILING")).toHaveLength(2);
    });

    it("should not render text below glitch variant", () => {
      const { container } = render(<PixelLoading variant="glitch" text="TEST" />);

      // Should only have the glitch text, not the separate text element
      const textElements = container.querySelectorAll('.font-pixel.text-terminal-400');
      expect(textElements).toHaveLength(0);
    });
  });

  describe("Styling", () => {
    it("should apply custom className", () => {
      const { container } = render(<PixelLoading className="custom-class" />);

      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });

    it("should have proper pixel art styling", () => {
      const { container } = render(<PixelLoading text="TEST" />);

      expect(container.querySelector('.font-pixel')).toBeInTheDocument();
    });

    it("should center content by default", () => {
      const { container } = render(<PixelLoading />);

      expect(container.querySelector('.flex.flex-col.items-center.justify-center')).toBeInTheDocument();
    });
  });

  describe("Animation Structure", () => {
    it("should have motion elements for dots variant", () => {
      const { container } = render(<PixelLoading variant="dots" />);

      // Should have multiple animated dots
      const dots = container.querySelectorAll('.bg-white');
      expect(dots.length).toBeGreaterThan(1);
    });

    it("should have progress bar structure", () => {
      const { container } = render(<PixelLoading variant="progress" />);

      // Should have border and background elements
      expect(container.querySelector('.border-terminal-400')).toBeInTheDocument();
      expect(container.querySelector('.bg-black')).toBeInTheDocument();
    });

    it("should have multiple spinner elements", () => {
      const { container } = render(<PixelLoading variant="spinner" />);

      // Should have multiple dots for spinner
      const spinnerDots = container.querySelectorAll('.absolute.bg-white');
      expect(spinnerDots.length).toBeGreaterThan(4);
    });
  });
});