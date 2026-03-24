import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProjectNavigation } from "./ProjectNavigation";

const mockProjects = [
  {
    slug: "project-1",
    title: "First Project",
    publishedAt: "2024-03-01",
  },
  {
    slug: "project-2",
    title: "Second Project",
    publishedAt: "2024-02-01",
  },
  {
    slug: "project-3",
    title: "Third Project",
    publishedAt: "2024-01-01",
  },
];

describe("ProjectNavigation Component", () => {
  describe("Navigation rendering", () => {
    it("should render navigation for middle project", () => {
      render(
        <ProjectNavigation currentSlug="project-2" projects={mockProjects} />,
      );

      expect(screen.getByText("PREV")).toBeInTheDocument();
      expect(screen.getByText("NEXT")).toBeInTheDocument();
      expect(screen.getByText("First Project")).toBeInTheDocument();
      expect(screen.getByText("Third Project")).toBeInTheDocument();
    });

    it("should render navigation for first project (newest)", () => {
      render(
        <ProjectNavigation currentSlug="project-1" projects={mockProjects} />,
      );

      expect(screen.getByText("PREV")).toBeInTheDocument();
      expect(screen.getByText("NEXT")).toBeInTheDocument();
      expect(screen.getByText("---")).toBeInTheDocument();
      expect(screen.getByText("Second Project")).toBeInTheDocument();
    });

    it("should render navigation for last project (oldest)", () => {
      render(
        <ProjectNavigation currentSlug="project-3" projects={mockProjects} />,
      );

      expect(screen.getByText("PREV")).toBeInTheDocument();
      expect(screen.getByText("NEXT")).toBeInTheDocument();
      expect(screen.getByText("Second Project")).toBeInTheDocument();
      expect(screen.getAllByText("---")).toHaveLength(1);
    });

    it("should show correct project counter", () => {
      render(
        <ProjectNavigation currentSlug="project-2" projects={mockProjects} />,
      );

      const counterContainer = screen.getByText("2").closest(".font-pixel");
      expect(counterContainer).toHaveTextContent("2 of 3");
    });
  });

  describe("Link functionality", () => {
    it("should create correct links for available projects", () => {
      render(
        <ProjectNavigation currentSlug="project-2" projects={mockProjects} />,
      );

      const prevLink = screen.getByRole("link", { name: /prev/i });
      const nextLink = screen.getByRole("link", { name: /next/i });

      expect(prevLink).toHaveAttribute("href", "/projects/project-1");
      expect(nextLink).toHaveAttribute("href", "/projects/project-3");
    });

    it("should not create links for unavailable navigation", () => {
      render(
        <ProjectNavigation currentSlug="project-1" projects={mockProjects} />,
      );

      const prevElements = screen.getAllByText("PREV");
      const prevElement = prevElements[0].closest("div");
      expect(prevElement?.tagName).toBe("DIV");

      const nextLink = screen.getByRole("link", { name: /next/i });
      expect(nextLink).toHaveAttribute("href", "/projects/project-2");
    });
  });

  describe("Visual states", () => {
    it("should apply different styles for available vs unavailable navigation", () => {
      render(
        <ProjectNavigation currentSlug="project-1" projects={mockProjects} />,
      );

      const prevContainer = screen
        .getByText("PREV")
        .closest("div")?.parentElement;
      const nextContainer = screen
        .getByText("NEXT")
        .closest("div")?.parentElement;

      expect(prevContainer).toHaveClass(
        "border-terminal-600",
        "text-terminal-600",
      );
      expect(nextContainer).toHaveClass(
        "border-terminal-400",
        "text-terminal-300",
      );
    });

    it("should truncate long project titles", () => {
      render(
        <ProjectNavigation currentSlug="project-2" projects={mockProjects} />,
      );

      const titleElements = screen.getAllByText(/Project/);
      titleElements.forEach((element) => {
        expect(element).toHaveClass("truncate");
      });
    });
  });

  describe("Project ordering", () => {
    it("should order projects by date (newest first)", () => {
      render(
        <ProjectNavigation currentSlug="project-2" projects={mockProjects} />,
      );

      expect(screen.getByText("First Project")).toBeInTheDocument();
      expect(screen.getByText("Third Project")).toBeInTheDocument();
    });

    it("should show correct counter based on date order", () => {
      const { rerender } = render(
        <ProjectNavigation currentSlug="project-1" projects={mockProjects} />,
      );
      let counterContainer = screen.getByText("1").closest(".font-pixel");
      expect(counterContainer).toHaveTextContent("1 of 3");

      rerender(
        <ProjectNavigation currentSlug="project-3" projects={mockProjects} />,
      );
      counterContainer = screen.getByText("3").closest(".font-pixel");
      expect(counterContainer).toHaveTextContent("3 of 3");
    });
  });

  describe("Edge cases", () => {
    it("should return null for invalid project slug", () => {
      const { container } = render(
        <ProjectNavigation
          currentSlug="invalid-project"
          projects={mockProjects}
        />,
      );
      expect(container.firstChild).toBeNull();
    });

    it("should handle empty project list gracefully", () => {
      const { container } = render(
        <ProjectNavigation currentSlug="any-project" projects={[]} />,
      );
      expect(container.firstChild).toBeNull();
    });

    it("should handle single project case", () => {
      render(
        <ProjectNavigation currentSlug="project-3" projects={mockProjects} />,
      );

      expect(screen.getByText("---")).toBeInTheDocument();
      const counterContainer = screen.getByText("3").closest(".font-pixel");
      expect(counterContainer).toHaveTextContent("3 of 3");
    });
  });

  describe("Accessibility", () => {
    it("should have proper link text for screen readers", () => {
      render(
        <ProjectNavigation currentSlug="project-2" projects={mockProjects} />,
      );

      const prevLink = screen.getByRole("link", { name: /prev/i });
      const nextLink = screen.getByRole("link", { name: /next/i });

      expect(prevLink).toBeInTheDocument();
      expect(nextLink).toBeInTheDocument();
    });

    it("should apply hover states correctly", () => {
      render(
        <ProjectNavigation currentSlug="project-2" projects={mockProjects} />,
      );

      const prevLink = screen.getByRole("link", { name: /prev/i });
      const nextLink = screen.getByRole("link", { name: /next/i });

      expect(prevLink).toHaveClass("hover:border-white", "hover:text-white");
      expect(nextLink).toHaveClass("hover:border-white", "hover:text-white");
    });
  });

  describe("Content structure", () => {
    it("should display project titles correctly", () => {
      render(
        <ProjectNavigation currentSlug="project-2" projects={mockProjects} />,
      );

      expect(screen.getByText("First Project")).toBeInTheDocument();
      expect(screen.getByText("Third Project")).toBeInTheDocument();
    });

    it("should show PREV/NEXT labels", () => {
      render(
        <ProjectNavigation currentSlug="project-2" projects={mockProjects} />,
      );

      expect(screen.getAllByText("PREV")).toHaveLength(1);
      expect(screen.getAllByText("NEXT")).toHaveLength(1);
    });

    it("should show project counter in correct format", () => {
      render(
        <ProjectNavigation currentSlug="project-1" projects={mockProjects} />,
      );

      const counterContainer = screen.getByText("1").closest(".font-pixel");
      expect(counterContainer).toBeInTheDocument();
      expect(counterContainer).toHaveTextContent("1 of 3");
    });
  });
});
