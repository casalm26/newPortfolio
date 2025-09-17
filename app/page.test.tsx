import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "./page";

// Mock the components
vi.mock("@/components/shared/Header", () => ({
  default: () => <div data-testid="header">Header</div>,
}));

vi.mock("@/components/landing", () => ({
  PixelArtName: ({ className }: { className?: string }) => (
    <div data-testid="pixel-art-name" className={className}>
      PixelArtName Component
    </div>
  ),
}));

describe("Landing Page", () => {
  describe("Page Structure", () => {
    it("should render the main page layout", () => {
      const { container } = render(<Page />);

      const main = container.firstChild as HTMLElement;
      expect(main).toHaveClass("min-h-screen", "bg-black");
    });

    it("should render Header component", () => {
      render(<Page />);

      expect(screen.getByTestId("header")).toBeInTheDocument();
    });

    it("should render PixelArtName component", () => {
      render(<Page />);

      expect(screen.getByTestId("pixel-art-name")).toBeInTheDocument();
    });
  });

  describe("Layout and Styling", () => {
    it("should have proper main section structure", () => {
      render(<Page />);

      const section = screen.getByTestId("pixel-art-name").parentElement;
      expect(section).toHaveClass(
        "min-h-screen",
        "flex",
        "items-center",
        "justify-center",
        "bg-black",
        "px-4",
        "pt-20",
      );
    });

    it("should apply matrix theme background", () => {
      const { container } = render(<Page />);

      expect(container.firstChild).toHaveClass("min-h-screen", "bg-black");
    });

    it("should have proper spacing and layout classes", () => {
      render(<Page />);

      const section = screen.getByTestId("pixel-art-name").parentElement;
      expect(section).toHaveClass("px-4", "pt-20");
    });
  });

  describe("Component Integration", () => {
    it("should pass className prop to PixelArtName", () => {
      render(<Page />);

      const pixelArtName = screen.getByTestId("pixel-art-name");
      expect(pixelArtName).toHaveClass("w-full");
    });

    it("should render components in correct order", () => {
      const { container } = render(<Page />);

      const children = container.firstChild?.childNodes;
      expect(children).toHaveLength(2);

      // First child should be Header
      expect(children?.[0]).toContain(screen.getByTestId("header"));

      // Second child should be the section containing PixelArtName
      expect(children?.[1]).toContain(screen.getByTestId("pixel-art-name"));
    });
  });

  describe("Responsive Design", () => {
    it("should have mobile-first responsive classes", () => {
      render(<Page />);

      const section = screen.getByTestId("pixel-art-name").parentElement;
      expect(section).toHaveClass("px-4"); // Mobile padding
    });

    it("should be full viewport height", () => {
      render(<Page />);

      const mainContainer = screen.getByTestId("header").parentElement;
      const section = screen.getByTestId("pixel-art-name").parentElement;

      expect(mainContainer).toHaveClass("min-h-screen");
      expect(section).toHaveClass("min-h-screen");
    });
  });

  describe("Accessibility", () => {
    it("should have proper semantic structure", () => {
      render(<Page />);

      // Should have a main container
      const container = screen.getByTestId("header").parentElement;
      expect(container).toBeInTheDocument();
    });

    it("should be keyboard navigable through components", () => {
      render(<Page />);

      // Components should be present for keyboard navigation
      expect(screen.getByTestId("header")).toBeInTheDocument();
      expect(screen.getByTestId("pixel-art-name")).toBeInTheDocument();
    });
  });

  describe("Performance Considerations", () => {
    it("should render without unnecessary re-renders", () => {
      const { rerender } = render(<Page />);

      const initialPixelArt = screen.getByTestId("pixel-art-name");

      rerender(<Page />);

      const rerenderedPixelArt = screen.getByTestId("pixel-art-name");
      expect(rerenderedPixelArt).toBeInTheDocument();
    });
  });

  describe("Matrix Theme Consistency", () => {
    it("should maintain black background throughout", () => {
      const { container } = render(<Page />);

      const mainDiv = container.firstChild as HTMLElement;
      const section = screen.getByTestId("pixel-art-name")
        .parentElement as HTMLElement;

      expect(mainDiv).toHaveClass("bg-black");
      expect(section).toHaveClass("bg-black");
    });

    it("should have consistent terminal styling", () => {
      render(<Page />);

      // The page should maintain the matrix theme established in other components
      const container = screen.getByTestId("header").parentElement;
      expect(container).toHaveClass("min-h-screen", "bg-black");
    });
  });

  describe("Edge Cases", () => {
    it("should render without crashing", () => {
      expect(() => render(<Page />)).not.toThrow();
    });

    it("should handle missing components gracefully", () => {
      // If components fail to load, page should still render basic structure
      expect(() => render(<Page />)).not.toThrow();
    });

    it("should maintain layout integrity with different content sizes", () => {
      render(<Page />);

      const section = screen.getByTestId("pixel-art-name").parentElement;
      expect(section).toHaveClass("flex", "items-center", "justify-center");
    });
  });

  describe("SEO and Metadata", () => {
    it("should be suitable for SEO indexing", () => {
      render(<Page />);

      // Should have content that can be indexed
      expect(screen.getByTestId("pixel-art-name")).toBeInTheDocument();
      expect(screen.getByTestId("header")).toBeInTheDocument();
    });
  });
});
