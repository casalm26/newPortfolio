import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PageTitle from "./PageTitle";

describe("PageTitle", () => {
  describe("normal use cases", () => {
    it("should render text content correctly", () => {
      render(<PageTitle>Test Page Title</PageTitle>);

      expect(screen.getByText("Test Page Title")).toBeInTheDocument();
    });

    it("should render as an h1 element", () => {
      render(<PageTitle>Test Title</PageTitle>);

      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });

    it("should apply correct CSS classes", () => {
      render(<PageTitle>Test Title</PageTitle>);

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveClass(
        "text-3xl",
        "font-semibold",
        "leading-9",
        "tracking-tight",
        "text-gray-900",
        "dark:text-gray-100",
        "sm:text-4xl",
        "sm:leading-10",
        "md:text-5xl",
        "md:leading-14",
      );
    });

    it("should render JSX children correctly", () => {
      render(
        <PageTitle>
          <span data-testid="child">Complex Title</span>
        </PageTitle>,
      );

      expect(screen.getByTestId("child")).toBeInTheDocument();
      expect(screen.getByText("Complex Title")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle empty string content", () => {
      render(<PageTitle>{""}</PageTitle>);

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toBeEmptyDOMElement();
    });

    it("should handle multiple children", () => {
      render(
        <PageTitle>
          <span>First part</span>
          <span> Second part</span>
        </PageTitle>,
      );

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent("First part Second part");
    });

    it("should handle null children gracefully", () => {
      render(
        <PageTitle>
          {null}
          Valid Title
        </PageTitle>,
      );

      expect(screen.getByText("Valid Title")).toBeInTheDocument();
    });

    it("should handle conditional children", () => {
      const showTitle = true;
      render(<PageTitle>{showTitle && "Conditional Title"}</PageTitle>);

      expect(screen.getByText("Conditional Title")).toBeInTheDocument();
    });

    it("should handle long text content", () => {
      const longTitle =
        "This is a very long title that might wrap to multiple lines in different viewport sizes and should still be rendered correctly";

      render(<PageTitle>{longTitle}</PageTitle>);

      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it("should handle special characters", () => {
      const specialTitle = 'Title with "quotes" & symbols <>';

      render(<PageTitle>{specialTitle}</PageTitle>);

      expect(screen.getByText(specialTitle)).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should be accessible as a main heading", () => {
      render(<PageTitle>Page Title</PageTitle>);

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it("should have proper heading hierarchy", () => {
      render(
        <div>
          <PageTitle>Main Title</PageTitle>
          <h2>Sub Title</h2>
        </div>,
      );

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Main Title",
      );
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        "Sub Title",
      );
    });
  });
});
