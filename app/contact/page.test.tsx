import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Contact from "./page";

// Mock the Header component
vi.mock("@/components/shared/Header", () => ({
  default: () => <div data-testid="header">Header</div>,
}));

vi.mock("@/components/shared/ScrollAnimated", () => ({
  ScrollAnimated: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("@/components/shared/Breadcrumb", () => ({
  default: () => <nav data-testid="breadcrumb">Breadcrumb</nav>,
}));

describe("Contact Page", () => {
  describe("Page Rendering", () => {
    it("should render page title and description", () => {
      render(<Contact />);

      expect(screen.getByText("CONTACT.EXE")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Initialize communication protocol. Ready to receive your transmission.",
        ),
      ).toBeInTheDocument();
    });

    it("should render terminal-style command prompts", () => {
      render(<Contact />);

      expect(
        screen.getByText("caspian@localhost:~$ ./contact.sh"),
      ).toBeInTheDocument();
      expect(
        screen.getByText('> echo "message" > /dev/contact'),
      ).toBeInTheDocument();
      expect(screen.getByText("> cat contact_info.txt")).toBeInTheDocument();
    });

    it("should render mailto CTA button", () => {
      render(<Contact />);

      const mailtoLinks = screen.getAllByRole("link", {
        name: /SEND EMAIL|hello@caspian\.dev/i,
      });
      const ctaLink = mailtoLinks.find((link) =>
        link.textContent?.includes("SEND EMAIL"),
      );
      expect(ctaLink).toBeDefined();
      expect(ctaLink).toHaveAttribute(
        "href",
        "mailto:caspian@houseofcaspian.com",
      );
    });

    it("should render contact information sections", () => {
      render(<Contact />);

      expect(screen.getByText("< 24 hours")).toBeInTheDocument();
      expect(screen.getByText("Mon-Fri, 9AM-6PM UTC")).toBeInTheDocument();
    });
  });

  describe("Social Links", () => {
    it("should render social links", () => {
      render(<Contact />);

      expect(screen.getByRole("link", { name: /github/i })).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /linkedin/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /twitter/i }),
      ).toBeInTheDocument();
    });

    it("should have proper external link attributes", () => {
      render(<Contact />);

      const githubLink = screen.getByRole("link", {
        name: /github/i,
      });
      const linkedinLink = screen.getByRole("link", {
        name: /linkedin/i,
      });

      expect(githubLink).toHaveAttribute("target", "_blank");
      expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
      expect(linkedinLink).toHaveAttribute("target", "_blank");
      expect(linkedinLink).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("Terminal Styling", () => {
    it("should have matrix theme styling", () => {
      const { container } = render(<Contact />);

      expect(container.firstChild).toHaveClass("min-h-screen", "bg-black");
    });

    it("should have pixel font styling for headers", () => {
      render(<Contact />);

      const title = screen.getByText("CONTACT.EXE");
      expect(title).toHaveClass("font-pixel");
    });

    it("should have terminal color scheme", () => {
      render(<Contact />);

      const commandPrompt = screen.getByText(
        "caspian@localhost:~$ ./contact.sh",
      );
      expect(commandPrompt).toHaveClass("text-terminal-400");
    });
  });
});
