import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Services from "./page";

// Mock the components
vi.mock("@/components/shared/Footer", () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));

vi.mock("@/components/shared/Header", () => ({
  default: () => <header data-testid="header">Header</header>,
}));

vi.mock("@/components/landing", () => ({
  LandingProductFeaturesGrid: ({
    children,
    title,
    description,
    className,
  }: {
    children: React.ReactNode;
    title: string;
    description: string;
    className?: string;
  }) => (
    <div data-testid="features-grid" className={className}>
      <h2>{title}</h2>
      <p>{description}</p>
      <div data-testid="features-container">{children}</div>
    </div>
  ),
  LandingProductFeature: ({
    title,
    description,
    leadingComponent,
  }: {
    title: string;
    description: string;
    leadingComponent?: React.ReactNode;
  }) => (
    <div data-testid="feature">
      {leadingComponent}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  ),
}));

// Mock Lucide icons
vi.mock("lucide-react", () => ({
  Zap: ({ className }: { className?: string }) => (
    <div data-testid="zap-icon" className={className} />
  ),
  Shield: ({ className }: { className?: string }) => (
    <div data-testid="shield-icon" className={className} />
  ),
  Users: ({ className }: { className?: string }) => (
    <div data-testid="users-icon" className={className} />
  ),
  BarChart4: ({ className }: { className?: string }) => (
    <div data-testid="chart-icon" className={className} />
  ),
  Globe: ({ className }: { className?: string }) => (
    <div data-testid="globe-icon" className={className} />
  ),
  Rocket: ({ className }: { className?: string }) => (
    <div data-testid="rocket-icon" className={className} />
  ),
  Settings: ({ className }: { className?: string }) => (
    <div data-testid="settings-icon" className={className} />
  ),
  Headphones: ({ className }: { className?: string }) => (
    <div data-testid="headphones-icon" className={className} />
  ),
}));

describe("Services Page", () => {
  describe("Page Structure", () => {
    it("should render the main page layout components", () => {
      render(<Services />);

      expect(screen.getByTestId("header")).toBeInTheDocument();
      expect(screen.getByTestId("footer")).toBeInTheDocument();
      expect(screen.getByTestId("features-grid")).toBeInTheDocument();
    });

    it("should render the page title and description", () => {
      render(<Services />);

      expect(screen.getByText("Our Services")).toBeInTheDocument();
      expect(
        screen.getByText(/We offer comprehensive solutions/),
      ).toBeInTheDocument();
    });

    it("should have the correct page structure classes", () => {
      const { container } = render(<Services />);

      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass(
        "flex",
        "flex-col",
        "w-full",
        "min-h-screen",
      );
    });
  });

  describe("Services Grid", () => {
    it("should render the features grid with correct props", () => {
      render(<Services />);

      expect(
        screen.getByText("Complete Solutions for Your Business"),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "From strategy to implementation, we provide end-to-end services that drive results.",
        ),
      ).toBeInTheDocument();
    });

    it("should render all 8 service features", () => {
      render(<Services />);

      const features = screen.getAllByTestId("feature");
      expect(features).toHaveLength(8);
    });

    it("should render service feature titles", () => {
      render(<Services />);

      expect(screen.getByText("Strategy & Consulting")).toBeInTheDocument();
      expect(screen.getByText("Technology Solutions")).toBeInTheDocument();
      expect(screen.getByText("Security & Compliance")).toBeInTheDocument();
      expect(screen.getByText("Team Training")).toBeInTheDocument();
      expect(screen.getByText("Global Support")).toBeInTheDocument();
      expect(screen.getByText("Scale & Growth")).toBeInTheDocument();
      expect(screen.getByText("Custom Integration")).toBeInTheDocument();
      expect(screen.getByText("Premium Support")).toBeInTheDocument();
    });

    it("should render all service icons", () => {
      render(<Services />);

      expect(screen.getByTestId("chart-icon")).toBeInTheDocument();
      expect(screen.getByTestId("zap-icon")).toBeInTheDocument();
      expect(screen.getByTestId("shield-icon")).toBeInTheDocument();
      expect(screen.getByTestId("users-icon")).toBeInTheDocument();
      expect(screen.getByTestId("globe-icon")).toBeInTheDocument();
      expect(screen.getByTestId("rocket-icon")).toBeInTheDocument();
      expect(screen.getByTestId("settings-icon")).toBeInTheDocument();
      expect(screen.getByTestId("headphones-icon")).toBeInTheDocument();
    });
  });

  describe("Why Choose Our Services Section", () => {
    it("should render the why choose section", () => {
      render(<Services />);

      expect(screen.getByText("Why Choose Our Services?")).toBeInTheDocument();
    });

    it("should render all four value propositions", () => {
      render(<Services />);

      expect(screen.getByText("Proven Track Record")).toBeInTheDocument();
      expect(screen.getByText("Tailored Solutions")).toBeInTheDocument();
      expect(screen.getByText("Expert Team")).toBeInTheDocument();
      expect(screen.getByText("Ongoing Support")).toBeInTheDocument();
    });

    it("should render value proposition descriptions", () => {
      render(<Services />);

      expect(
        screen.getByText(/With hundreds of successful projects/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/We understand that every business is unique/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Our team consists of industry experts/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/We don't just deliver and leave/),
      ).toBeInTheDocument();
    });
  });

  describe("Content Accuracy", () => {
    it("should have correct service descriptions", () => {
      render(<Services />);

      expect(
        screen.getByText(/Expert guidance to develop winning strategies/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /Custom software development and technology implementation/,
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /Comprehensive security solutions and compliance management/,
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Professional training programs to upskill your team/),
      ).toBeInTheDocument();
    });
  });

  describe("Responsive Design", () => {
    it("should have responsive classes on grid sections", () => {
      render(<Services />);

      const whyChooseGrid = screen
        .getByText("Proven Track Record")
        .closest(".grid");
      expect(whyChooseGrid).toHaveClass("md:grid-cols-2");
    });

    it("should have responsive typography classes", () => {
      render(<Services />);

      const mainTitle = screen.getByRole("heading", { level: 1 });
      expect(mainTitle).toHaveClass("text-4xl", "md:text-6xl");
    });
  });

  describe("Edge Cases", () => {
    it("should render without crashing when no props provided", () => {
      expect(() => render(<Services />)).not.toThrow();
    });

    it("should maintain semantic HTML structure", () => {
      render(<Services />);

      const mainContent = screen.getByText("Our Services").closest("section");
      expect(mainContent).toBeInTheDocument();
      expect(mainContent).toHaveClass("w-full", "p-6");
    });
  });
});
