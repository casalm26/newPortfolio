import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProjectsPageClient } from "./ProjectsPageClient";

// Mock the Header component
vi.mock("@/components/shared/Header", () => ({
  default: () => <div data-testid="header">Header</div>,
}));

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => "/projects",
}));

// Mock ScrollAnimated and TypewriterText to avoid AnimationProvider dependency
vi.mock("@/components/shared/ScrollAnimated", () => ({
  ScrollAnimated: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("@/components/shared/TypewriterText", () => ({
  TypewriterText: ({ text }: { text: string }) => <span>{text}</span>,
}));

const mockProjects = [
  {
    _id: "1",
    slug: "test-project-1",
    title: "Test Project 1",
    content: "",
    summary: "A test project for unit testing",
    projectType: "Technical",
    category: "Frontend",
    duration: "3 months",
    skills: ["React", "TypeScript"],
    tools: ["VS Code", "Git"],
    links: {},
    draft: false,
    publishedAt: "2024-03-01T00:00:00.000Z",
    updatedAt: "2024-03-01T00:00:00.000Z",
    seoTitle: "",
    seoDescription: "",
    role: "Developer",
  },
  {
    _id: "2",
    slug: "test-project-2",
    title: "Test Project 2",
    content: "",
    summary: "Another test project",
    projectType: "Creative",
    category: "Mobile App",
    duration: "6 months",
    skills: ["React Native"],
    tools: ["Expo"],
    links: {},
    draft: false,
    publishedAt: "2024-02-01T00:00:00.000Z",
    updatedAt: "2024-02-01T00:00:00.000Z",
    seoTitle: "",
    seoDescription: "",
    role: "Lead",
  },
];

describe("Projects Page", () => {
  describe("Page Rendering", () => {
    it("should render page title and terminal prompt", () => {
      render(<ProjectsPageClient projects={mockProjects} />);

      expect(screen.getByText("PROJECTS/")).toBeInTheDocument();
    });

    it("should render project count", () => {
      render(<ProjectsPageClient projects={mockProjects} />);

      expect(screen.getByText("showing 2 of 2 projects")).toBeInTheDocument();
    });
  });

  describe("Project Listing", () => {
    it("should render all projects", () => {
      render(<ProjectsPageClient projects={mockProjects} />);

      expect(screen.getByText("Test Project 1")).toBeInTheDocument();
      expect(screen.getByText("Test Project 2")).toBeInTheDocument();
    });

    it("should display project metadata correctly", () => {
      render(<ProjectsPageClient projects={mockProjects} />);

      expect(screen.getByText("TECHNICAL")).toBeInTheDocument();
      expect(screen.getByText("CREATIVE")).toBeInTheDocument();
      expect(screen.getByText("3 months")).toBeInTheDocument();
      expect(screen.getByText("6 months")).toBeInTheDocument();
    });

    it("should display project summaries", () => {
      render(<ProjectsPageClient projects={mockProjects} />);

      expect(
        screen.getByText("A test project for unit testing"),
      ).toBeInTheDocument();
      expect(screen.getByText("Another test project")).toBeInTheDocument();
    });
  });

  describe("Project Cards", () => {
    it("should render project cards with proper links", () => {
      render(<ProjectsPageClient projects={mockProjects} />);

      const project1Link = screen.getByRole("link", {
        name: /Test Project 1/i,
      });
      const project2Link = screen.getByRole("link", {
        name: /Test Project 2/i,
      });

      expect(project1Link).toHaveAttribute("href", "/projects/test-project-1");
      expect(project2Link).toHaveAttribute("href", "/projects/test-project-2");
    });

    it("should display skills", () => {
      render(<ProjectsPageClient projects={mockProjects} />);

      // Skills may appear in both cards and filter bar, so use getAllByText
      expect(screen.getAllByText("React").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("TypeScript").length).toBeGreaterThanOrEqual(
        1,
      );
      expect(screen.getAllByText("React Native").length).toBeGreaterThanOrEqual(
        1,
      );
    });
  });

  describe("Terminal Styling", () => {
    it("should have proper styling", () => {
      const { container } = render(
        <ProjectsPageClient projects={mockProjects} />,
      );

      expect(container.querySelector(".min-h-screen")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty projects array", () => {
      expect(() => render(<ProjectsPageClient projects={[]} />)).not.toThrow();
    });

    it("should render without crashing", () => {
      expect(() =>
        render(<ProjectsPageClient projects={mockProjects} />),
      ).not.toThrow();
    });
  });
});
