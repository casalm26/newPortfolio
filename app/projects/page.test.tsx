import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Projects from "./page";

// Mock the Header component
vi.mock("@/components/shared/Header", () => ({
  default: () => <div data-testid="header">Header</div>,
}));

// Mock contentlayer generated content
vi.mock("contentlayer/generated", () => ({
  allProjects: [
    {
      slug: "test-project-1",
      title: "Test Project 1",
      summary: "A test project for unit testing",
      projectType: "web",
      category: "Frontend",
      duration: "3 months",
      skills: ["React", "TypeScript"],
      tools: ["VS Code", "Git"],
    },
    {
      slug: "test-project-2",
      title: "Test Project 2",
      summary: "Another test project",
      projectType: "mobile",
      category: "Mobile App",
      duration: "6 months",
      skills: ["React Native"],
      tools: ["Expo"],
    },
  ],
}));

describe("Projects Page", () => {
  describe("Page Rendering", () => {
    it("should render page title and terminal prompt", () => {
      render(<Projects />);

      expect(screen.getByText("PROJECTS.EXE")).toBeInTheDocument();
      expect(
        screen.getByText("caspian@localhost:~$ ls projects/"),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Digital artifacts and code experiments from the development journey.",
        ),
      ).toBeInTheDocument();
    });

    it("should render projects stats", () => {
      render(<Projects />);

      expect(screen.getByText("total: 2 items")).toBeInTheDocument();
    });
  });

  describe("Project Listing", () => {
    it("should render all projects", () => {
      render(<Projects />);

      expect(screen.getByText("Test Project 1")).toBeInTheDocument();
      expect(screen.getByText("Test Project 2")).toBeInTheDocument();
    });

    it("should display project metadata correctly", () => {
      render(<Projects />);

      expect(screen.getByText("WEB")).toBeInTheDocument();
      expect(screen.getByText("MOBILE")).toBeInTheDocument();
      expect(screen.getByText("3 months")).toBeInTheDocument();
      expect(screen.getByText("6 months")).toBeInTheDocument();
    });

    it("should display project summaries", () => {
      render(<Projects />);

      expect(
        screen.getByText("A test project for unit testing"),
      ).toBeInTheDocument();
      expect(screen.getByText("Another test project")).toBeInTheDocument();
    });

    it("should display project categories", () => {
      render(<Projects />);

      expect(screen.getByText("Frontend")).toBeInTheDocument();
      expect(screen.getByText("Mobile App")).toBeInTheDocument();
    });
  });

  describe("Project Cards", () => {
    it("should render project cards with proper styling", () => {
      render(<Projects />);

      const projectCards = screen.getAllByRole("link");
      expect(projectCards).toHaveLength(2);

      projectCards.forEach((card) => {
        expect(card).toHaveClass("block");
      });
    });

    it("should have correct links to project detail pages", () => {
      render(<Projects />);

      const project1Link = screen.getByRole("link", {
        name: /Test Project 1/i,
      });
      const project2Link = screen.getByRole("link", {
        name: /Test Project 2/i,
      });

      expect(project1Link).toHaveAttribute("href", "/projects/test-project-1");
      expect(project2Link).toHaveAttribute("href", "/projects/test-project-2");
    });

    it("should display skills and tools", () => {
      render(<Projects />);

      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("React Native")).toBeInTheDocument();
      expect(screen.getByText("VS Code")).toBeInTheDocument();
      expect(screen.getByText("Git")).toBeInTheDocument();
      expect(screen.getByText("Expo")).toBeInTheDocument();
    });
  });

  describe("Terminal Styling", () => {
    it("should have matrix theme background", () => {
      const { container } = render(<Projects />);

      expect(container.firstChild).toHaveClass("min-h-screen", "bg-black");
    });

    it("should have terminal command styling", () => {
      render(<Projects />);

      const commandPrompt = screen.getByText(
        "caspian@localhost:~$ ls projects/",
      );
      expect(commandPrompt).toHaveClass("font-pixel", "text-terminal-400");
    });

    it("should have pixel font for title", () => {
      render(<Projects />);

      const title = screen.getByText("PROJECTS.EXE");
      expect(title).toHaveClass("font-pixel", "text-white");
    });

    it("should have bordered project cards", () => {
      render(<Projects />);

      const projectCards = screen.getAllByRole("link");
      projectCards.forEach((card) => {
        expect(card).toHaveClass("border", "border-terminal-400");
      });
    });
  });

  describe("Responsive Design", () => {
    it("should have responsive typography", () => {
      render(<Projects />);

      const title = screen.getByText("PROJECTS.EXE");
      expect(title).toHaveClass("text-4xl", "md:text-6xl");
    });

    it("should have responsive grid layout", () => {
      render(<Projects />);

      const projectsContainer = screen
        .getByText("Test Project 1")
        .closest("div")?.parentElement?.parentElement;
      expect(projectsContainer).toHaveClass("md:grid-cols-2");
    });

    it("should have responsive container padding", () => {
      const { container } = render(<Projects />);

      const main = container.querySelector("main");
      expect(main).toHaveClass("px-4", "container", "mx-auto");
    });
  });

  describe("Project Type Display", () => {
    it("should uppercase project types correctly", () => {
      render(<Projects />);

      expect(screen.getByText("WEB")).toBeInTheDocument();
      expect(screen.getByText("MOBILE")).toBeInTheDocument();
    });

    it("should display project type with proper styling", () => {
      render(<Projects />);

      const webType = screen.getByText("WEB");
      expect(webType).toHaveClass("font-pixel", "text-xs", "px-2", "py-1");
    });
  });

  describe("Skills and Tools Display", () => {
    it("should render skills section with proper header", () => {
      render(<Projects />);

      const skillsHeaders = screen.getAllByText("SKILLS");
      expect(skillsHeaders.length).toBeGreaterThan(0);
    });

    it("should render tools section with proper header", () => {
      render(<Projects />);

      const toolsHeaders = screen.getAllByText("TOOLS");
      expect(toolsHeaders.length).toBeGreaterThan(0);
    });

    it("should style skill and tool tags consistently", () => {
      render(<Projects />);

      const reactTag = screen.getByText("React");
      expect(reactTag).toHaveClass("font-pixel", "text-xs", "px-2", "py-1");
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading hierarchy", () => {
      render(<Projects />);

      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1).toHaveTextContent("PROJECTS.EXE");

      const h2Elements = screen.getAllByRole("heading", { level: 2 });
      expect(h2Elements).toHaveLength(2); // One for each project
    });

    it("should have semantic main content", () => {
      render(<Projects />);

      const main = screen.getByRole("main");
      expect(main).toBeInTheDocument();
    });

    it("should have accessible project links", () => {
      render(<Projects />);

      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        expect(link).toHaveAttribute("href");
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty projects array", () => {
      vi.doMock("contentlayer/generated", () => ({
        allProjects: [],
      }));

      expect(() => render(<Projects />)).not.toThrow();
    });

    it("should handle projects with missing optional fields", () => {
      vi.doMock("contentlayer/generated", () => ({
        allProjects: [
          {
            slug: "minimal-project",
            title: "Minimal Project",
            summary: "Project with minimal fields",
            projectType: "web",
          },
        ],
      }));

      expect(() => render(<Projects />)).not.toThrow();
    });

    it("should render without crashing", () => {
      expect(() => render(<Projects />)).not.toThrow();
    });
  });
});
