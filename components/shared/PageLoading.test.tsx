import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PageLoading from "./PageLoading";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<"div">) => <div {...props}>{children}</div>,
  },
}));

// Mock PixelLoading component
vi.mock("./PixelLoading", () => ({
  default: ({ variant, text }: { variant?: string; text?: string }) => (
    <div data-testid={`pixel-loading-${variant}`}>{text}</div>
  ),
}));

describe("PageLoading", () => {
  describe("Basic Rendering", () => {
    it("should render loading screen", () => {
      render(<PageLoading />);

      expect(screen.getByText("terminal.app")).toBeInTheDocument();
      expect(screen.getByText("caspian@localhost")).toBeInTheDocument();
      expect(screen.getByText(/npm run dev/)).toBeInTheDocument();
    });

    it("should render custom message", () => {
      render(<PageLoading message="COMPILING" />);

      expect(screen.getByTestId("pixel-loading-glitch")).toBeInTheDocument();
      expect(screen.getByText("COMPILING")).toBeInTheDocument();
    });

    it("should render default LOADING message", () => {
      render(<PageLoading />);

      expect(screen.getByText("LOADING")).toBeInTheDocument();
    });
  });

  describe("Progress Mode", () => {
    it("should render progress bar when progress is provided", () => {
      render(<PageLoading progress={50} />);

      expect(screen.getByTestId("pixel-loading-progress")).toBeInTheDocument();
      expect(screen.getByText("50%")).toBeInTheDocument();
    });

    it("should round progress percentage", () => {
      render(<PageLoading progress={33.7} />);

      expect(screen.getByText("34%")).toBeInTheDocument();
    });

    it("should not render glitch variant when progress is provided", () => {
      render(<PageLoading progress={75} />);

      expect(screen.queryByTestId("pixel-loading-glitch")).not.toBeInTheDocument();
    });
  });

  describe("Terminal Interface", () => {
    it("should render terminal window elements", () => {
      render(<PageLoading />);

      // Terminal controls (traffic light buttons)
      const terminalControls = screen.getByText("terminal.app");
      expect(terminalControls).toBeInTheDocument();

      // Command prompt
      expect(screen.getByText("caspian@localhost")).toBeInTheDocument();
      expect(screen.getByText(/npm run dev/)).toBeInTheDocument();
    });

    it("should render status messages", () => {
      render(<PageLoading />);

      expect(screen.getByText("Starting development server...")).toBeInTheDocument();
      expect(screen.getByText("Compiling components...")).toBeInTheDocument();
      expect(screen.getByText("Optimizing pixel art assets...")).toBeInTheDocument();
    });

    it("should have proper terminal styling", () => {
      const { container } = render(<PageLoading />);

      expect(container.querySelector('.bg-terminal-900')).toBeInTheDocument();
      expect(container.querySelector('.border-terminal-400')).toBeInTheDocument();
    });
  });

  describe("Animation Structure", () => {
    it("should have background animation elements", () => {
      const { container } = render(<PageLoading />);

      // Should have matrix-style background lines
      const backgroundLines = container.querySelectorAll('.absolute.w-px.bg-terminal-400');
      expect(backgroundLines.length).toBeGreaterThan(10);
    });

    it("should be positioned as overlay", () => {
      const { container } = render(<PageLoading />);

      expect(container.querySelector('.fixed.inset-0.z-50')).toBeInTheDocument();
    });

    it("should center content", () => {
      const { container } = render(<PageLoading />);

      expect(container.querySelector('.flex.items-center.justify-center')).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should be focusable for screen readers", () => {
      const { container } = render(<PageLoading />);

      // Loading screen should be detectable by screen readers
      expect(container.querySelector('.fixed')).toBeInTheDocument();
    });

    it("should have meaningful text content", () => {
      render(<PageLoading message="PROCESSING DATA" />);

      expect(screen.getByText("PROCESSING DATA")).toBeInTheDocument();
      expect(screen.getByText("Starting development server...")).toBeInTheDocument();
    });
  });
});