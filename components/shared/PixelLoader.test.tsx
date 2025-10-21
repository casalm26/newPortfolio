import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PixelLoader } from "./PixelLoader";

describe("PixelLoader", () => {
  describe("normal usage", () => {
    it("should render dots loader by default", () => {
      render(<PixelLoader />);

      // Should render 3 dots
      const dots = document.querySelectorAll(".animate-pixel-loading");
      expect(dots).toHaveLength(3);

      // Should show default text
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("should render bars loader", () => {
      render(<PixelLoader type="bars" />);

      // Should render 5 bars
      const bars = document.querySelectorAll(".animate-pixel-loading");
      expect(bars).toHaveLength(5);
    });

    it("should render spinner loader", () => {
      render(<PixelLoader type="spinner" />);

      // Should render spinner
      const spinner = document.querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
    });

    it("should render typewriter loader with custom text", () => {
      render(<PixelLoader type="typewriter" text="Processing..." />);

      expect(screen.getByText("Processing...")).toBeInTheDocument();

      // Should have cursor
      const cursor = document.querySelector(".animate-pixel-loading");
      expect(cursor).toBeInTheDocument();
    });

    it("should apply size classes correctly", () => {
      const { rerender } = render(<PixelLoader size="sm" />);
      let dots = document.querySelectorAll(".w-4.h-4");
      expect(dots).toHaveLength(3);

      rerender(<PixelLoader size="md" />);
      dots = document.querySelectorAll(".w-6.h-6");
      expect(dots).toHaveLength(3);

      rerender(<PixelLoader size="lg" />);
      dots = document.querySelectorAll(".w-8.h-8");
      expect(dots).toHaveLength(3);
    });

    it("should apply custom className", () => {
      render(<PixelLoader className="custom-class" />);

      const container = document.querySelector(".custom-class");
      expect(container).toBeInTheDocument();
    });

    it("should show custom text for non-typewriter types", () => {
      render(<PixelLoader text="Custom loading text" />);

      expect(screen.getByText("Custom loading text")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle empty text", () => {
      render(<PixelLoader text="" />);

      // Should still render the dots
      const dots = document.querySelectorAll(".animate-pixel-loading");
      expect(dots).toHaveLength(3);
    });

    it("should handle very long text", () => {
      const longText =
        "This is a very long loading text that should still be handled properly";
      render(<PixelLoader text={longText} />);

      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it("should render correctly with all combinations", () => {
      const types = ["dots", "bars", "spinner", "typewriter"] as const;
      const sizes = ["sm", "md", "lg"] as const;

      types.forEach((type) => {
        sizes.forEach((size) => {
          const { unmount } = render(
            <PixelLoader type={type} size={size} text="Test" />,
          );

          // Should not crash
          expect(document.body).toBeInTheDocument();
          unmount();
        });
      });
    });
  });

  describe("error conditions", () => {
    it("should handle invalid type gracefully", () => {
      // @ts-expect-error - Testing invalid type
      render(<PixelLoader type="invalid" />);

      // Should default to dots
      const dots = document.querySelectorAll(".animate-pixel-loading");
      expect(dots).toHaveLength(3);
    });

    it("should handle invalid size gracefully", () => {
      // @ts-expect-error - Testing invalid size
      render(<PixelLoader size="invalid" />);

      // Should render without crashing
      expect(document.body).toBeInTheDocument();
    });
  });
});
