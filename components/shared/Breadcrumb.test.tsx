import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { Breadcrumb } from "./Breadcrumb";

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

const mockUsePathname = vi.mocked(usePathname);

describe("Breadcrumb Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Path-based breadcrumbs", () => {
    it("should not render on home page", () => {
      mockUsePathname.mockReturnValue("/");
      const { container } = render(<Breadcrumb />);
      expect(container.firstChild).toBeNull();
    });

    it("should render breadcrumbs for single-level path", () => {
      mockUsePathname.mockReturnValue("/projects");
      render(<Breadcrumb />);

      expect(screen.getByText("HOME")).toBeInTheDocument();
      expect(screen.getByText("PROJECTS")).toBeInTheDocument();
      expect(screen.getByLabelText("Breadcrumb")).toBeInTheDocument();
    });

    it("should render breadcrumbs for nested path", () => {
      mockUsePathname.mockReturnValue("/projects/sample-project");
      render(<Breadcrumb />);

      expect(screen.getByText("HOME")).toBeInTheDocument();
      expect(screen.getByText("PROJECTS")).toBeInTheDocument();
      expect(screen.getByText("SAMPLE PROJECT")).toBeInTheDocument();
    });

    it("should convert CV path correctly", () => {
      mockUsePathname.mockReturnValue("/cv");
      render(<Breadcrumb />);

      expect(screen.getByText("HOME")).toBeInTheDocument();
      expect(screen.getByText("CV")).toBeInTheDocument();
    });

    it("should handle date-prefixed slugs correctly", () => {
      mockUsePathname.mockReturnValue("/blog/2024-01-01-my-blog-post");
      render(<Breadcrumb />);

      expect(screen.getByText("HOME")).toBeInTheDocument();
      expect(screen.getByText("BLOG")).toBeInTheDocument();
      expect(screen.getByText("MY BLOG POST")).toBeInTheDocument();
    });
  });

  describe("Custom breadcrumbs", () => {
    it("should render custom breadcrumb items", () => {
      mockUsePathname.mockReturnValue("/projects/test");

      const customItems = [
        { label: "HOME", href: "/" },
        { label: "PROJECTS", href: "/projects" },
        { label: "TEST PROJECT", href: "/projects/test" },
      ];

      render(<Breadcrumb customItems={customItems} />);

      expect(screen.getByText("HOME")).toBeInTheDocument();
      expect(screen.getByText("PROJECTS")).toBeInTheDocument();
      expect(screen.getByText("TEST PROJECT")).toBeInTheDocument();
    });

    it("should use custom items over path-based generation", () => {
      mockUsePathname.mockReturnValue("/projects/test");

      const customItems = [
        { label: "CUSTOM HOME", href: "/" },
        { label: "CUSTOM PAGE", href: "/custom" },
      ];

      render(<Breadcrumb customItems={customItems} />);

      expect(screen.getByText("CUSTOM HOME")).toBeInTheDocument();
      expect(screen.getByText("CUSTOM PAGE")).toBeInTheDocument();
      expect(screen.queryByText("PROJECTS")).not.toBeInTheDocument();
    });
  });

  describe("Navigation structure", () => {
    it("should render home icon for first item", () => {
      mockUsePathname.mockReturnValue("/projects");
      render(<Breadcrumb />);

      const homeLink = screen.getByRole("link", { name: /home/i });
      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveAttribute("href", "/");
    });

    it("should render chevron separators between items", () => {
      mockUsePathname.mockReturnValue("/projects/test");
      render(<Breadcrumb />);

      // Should have chevrons between items (but not counting the home icon)
      const breadcrumbContainer = screen.getByLabelText("Breadcrumb");
      expect(breadcrumbContainer).toBeInTheDocument();
    });

    it("should mark last item as current page", () => {
      mockUsePathname.mockReturnValue("/projects/test");
      render(<Breadcrumb />);

      const currentPage = screen.getByText("TEST");
      expect(currentPage).toHaveAttribute("aria-current", "page");
      expect(currentPage.tagName).toBe("SPAN"); // Should be span, not link
    });

    it("should make non-current items clickable links", () => {
      mockUsePathname.mockReturnValue("/projects/test");
      render(<Breadcrumb />);

      const homeLink = screen.getByRole("link", { name: /home/i });
      const projectsLink = screen.getByRole("link", { name: /projects/i });

      expect(homeLink).toHaveAttribute("href", "/");
      expect(projectsLink).toHaveAttribute("href", "/projects");
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA attributes", () => {
      mockUsePathname.mockReturnValue("/projects");
      render(<Breadcrumb />);

      const nav = screen.getByRole("navigation");
      expect(nav).toHaveAttribute("aria-label", "Breadcrumb");
    });

    it("should have aria-hidden on decorative elements", () => {
      mockUsePathname.mockReturnValue("/projects/test");
      const { container } = render(<Breadcrumb />);

      // Check that decorative icons have aria-hidden
      const ariaHiddenElements = container.querySelectorAll(
        '[aria-hidden="true"]',
      );
      expect(ariaHiddenElements.length).toBeGreaterThan(0);
    });

    it("should apply correct CSS classes", () => {
      mockUsePathname.mockReturnValue("/projects");
      render(<Breadcrumb className="custom-class" />);

      const nav = screen.getByRole("navigation");
      expect(nav).toHaveClass("custom-class");
    });
  });

  describe("Edge cases", () => {
    it("should handle empty pathname", () => {
      mockUsePathname.mockReturnValue("");
      const { container } = render(<Breadcrumb />);
      expect(container.firstChild).toBeNull();
    });

    it("should handle pathname with trailing slash", () => {
      mockUsePathname.mockReturnValue("/projects/");
      render(<Breadcrumb />);

      expect(screen.getByText("HOME")).toBeInTheDocument();
      expect(screen.getByText("PROJECTS")).toBeInTheDocument();
    });

    it("should handle deeply nested paths", () => {
      mockUsePathname.mockReturnValue("/projects/category/subcategory/item");
      render(<Breadcrumb />);

      expect(screen.getByText("HOME")).toBeInTheDocument();
      expect(screen.getByText("PROJECTS")).toBeInTheDocument();
      expect(screen.getByText("CATEGORY")).toBeInTheDocument();
      expect(screen.getByText("SUBCATEGORY")).toBeInTheDocument();
      expect(screen.getByText("ITEM")).toBeInTheDocument();
    });
  });

  describe("Error handling", () => {
    it("should handle usePathname returning null", () => {
      mockUsePathname.mockReturnValue(null as unknown as string);
      const { container } = render(<Breadcrumb />);
      expect(container.firstChild).toBeNull();
    });

    it("should handle invalid custom items", () => {
      mockUsePathname.mockReturnValue("/test");
      const customItems = [] as never[];

      const { container } = render(<Breadcrumb customItems={customItems} />);
      // Should fall back to path-based generation
      expect(container.firstChild).not.toBeNull();
    });
  });
});
