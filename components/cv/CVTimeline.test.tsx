import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CVTimeline } from "./CVTimeline";
import type { TimelineItem, TimelineCategory } from "./CVTimeline";

const mockItems: TimelineItem[] = [
  {
    id: "1",
    type: "work",
    title: "Senior Developer",
    company: "Test Company",
    location: "Remote",
    startDate: "2022",
    endDate: "2024",
    description: "Led development team",
    responsibilities: ["Code review", "Mentoring"],
    skills: ["React", "Node.js"],
  },
  {
    id: "2",
    type: "education",
    title: "Computer Science",
    institution: "University",
    startDate: "2018",
    endDate: "2022",
    description: "Bachelor degree",
  },
];

const mockCategories: Record<string, TimelineCategory> = {
  work: { label: "Work Experience", color: "#00ff00" },
  education: { label: "Education", color: "#8000ff" },
};

// Mock visual feedback
vi.mock("@/lib/visual-feedback", () => ({
  useVisualFeedback: () => ({
    hover: vi.fn(),
    click: vi.fn(),
  }),
}));

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...props}>{children}</div>
    ),
    button: ({
      children,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) => (
      <button {...props}>{children}</button>
    ),
    li: ({
      children,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) => (
      <li {...props}>{children}</li>
    ),
    a: ({
      children,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) => (
      <a {...props}>{children}</a>
    ),
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

// Mock ScrollAnimation
vi.mock("@/components/shared/ScrollAnimation", () => ({
  default: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

describe("CVTimeline", () => {
  describe("Component Rendering", () => {
    it("should render timeline with filter buttons", () => {
      render(<CVTimeline items={mockItems} categories={mockCategories} />);

      expect(screen.getByText("ALL (2)")).toBeInTheDocument();
      expect(screen.getByText("WORK EXPERIENCE (1)")).toBeInTheDocument();
      expect(screen.getByText("EDUCATION (1)")).toBeInTheDocument();
    });

    it("should render timeline items correctly", () => {
      render(<CVTimeline items={mockItems} categories={mockCategories} />);

      expect(screen.getByText("Senior Developer")).toBeInTheDocument();
      expect(screen.getByText(/Test Company/)).toBeInTheDocument();
      expect(screen.getByText("Computer Science")).toBeInTheDocument();
      expect(screen.getByText("University")).toBeInTheDocument();
    });

    it("should show stats footer with correct counts", () => {
      render(<CVTimeline items={mockItems} categories={mockCategories} />);

      expect(screen.getByText("WORK EXPERIENCE")).toBeInTheDocument();
    });
  });

  describe("Filter Functionality", () => {
    it("should filter items when work filter is selected", () => {
      render(<CVTimeline items={mockItems} categories={mockCategories} />);

      fireEvent.click(screen.getByText("WORK EXPERIENCE (1)"));

      expect(screen.getByText("Senior Developer")).toBeInTheDocument();
      expect(screen.queryByText("Computer Science")).not.toBeInTheDocument();
    });

    it("should show all items when ALL filter is selected", () => {
      render(<CVTimeline items={mockItems} categories={mockCategories} />);

      fireEvent.click(screen.getByText("WORK EXPERIENCE (1)"));
      fireEvent.click(screen.getByText("ALL (2)"));

      expect(screen.getByText("Senior Developer")).toBeInTheDocument();
      expect(screen.getByText("Computer Science")).toBeInTheDocument();
    });
  });

  describe("Expandable Items", () => {
    it("should expand item when clicked", () => {
      render(<CVTimeline items={mockItems} categories={mockCategories} />);

      const workItem = screen.getByText("Senior Developer").closest("div");
      fireEvent.click(workItem!);

      expect(screen.getByText("Code review")).toBeInTheDocument();
      expect(screen.getByText("Mentoring")).toBeInTheDocument();
      expect(screen.getByText("React")).toBeInTheDocument();
    });

    it("should collapse item when clicked again", () => {
      render(<CVTimeline items={mockItems} categories={mockCategories} />);

      const workItem = screen.getByText("Senior Developer").closest("div");

      fireEvent.click(workItem!);
      expect(screen.getByText("Code review")).toBeInTheDocument();

      fireEvent.click(workItem!);
      expect(screen.queryByText("Code review")).not.toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty items array", () => {
      render(<CVTimeline items={[]} categories={mockCategories} />);
      expect(screen.getByText("ALL (0)")).toBeInTheDocument();
    });

    it("should handle missing optional fields gracefully", () => {
      render(<CVTimeline items={mockItems} categories={mockCategories} />);

      expect(screen.getByText("Senior Developer")).toBeInTheDocument();
      expect(screen.getByText("Computer Science")).toBeInTheDocument();
    });
  });
});
