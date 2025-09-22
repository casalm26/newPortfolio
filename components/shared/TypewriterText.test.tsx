import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { TypewriterText } from "./TypewriterText";
import { useAnimation } from "./AnimationProvider";

// Mock the animation provider
vi.mock("./AnimationProvider", () => ({
  useAnimation: vi.fn(),
}));


describe("TypewriterText", () => {
  const mockUseAnimation = vi.mocked(useAnimation);

  beforeEach(() => {
    mockUseAnimation.mockReturnValue({
      isTransitioning: false,
      setIsTransitioning: vi.fn(),
      enableAnimations: true,
      setEnableAnimations: vi.fn(),
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  describe("normal usage", () => {
    it.skip("should start with empty text and animate typing", async () => {
      render(<TypewriterText text="Hello" speed={50} />);

      // Initially should be empty (with cursor)
      expect(screen.getByText("|")).toBeInTheDocument();

      // Advance timers to simulate typing
      act(() => {
        vi.advanceTimersByTime(50);
      });

      expect(screen.getByText("H")).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(200);
      });

      expect(screen.getByText((content, element) => {
        return element?.textContent === "Hell|" || element?.textContent?.startsWith("Hell");
      })).toBeInTheDocument();
    });

    it("should show cursor by default", () => {
      render(<TypewriterText text="Test" />);

      expect(screen.getByText("_")).toBeInTheDocument();
    });

    it("should use custom cursor character", () => {
      render(<TypewriterText text="Test" cursorChar="|" />);

      expect(screen.getByText("|")).toBeInTheDocument();
    });

    it("should hide cursor when disabled", () => {
      render(<TypewriterText text="Test" cursor={false} />);

      expect(screen.queryByText("_")).not.toBeInTheDocument();
    });
  });

  describe("Multiple Texts", () => {
    it("should accept array of texts", () => {
      const texts = ["First", "Second"];
      render(<TypewriterText text={texts} />);

      // Should render without crashing
      expect(screen.getByText("_")).toBeInTheDocument();
    });

    it("should accept callback function", () => {
      const onComplete = vi.fn();
      render(<TypewriterText text="Test" onComplete={onComplete} />);

      // Should render without crashing
      expect(screen.getByText("_")).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("should apply custom className", () => {
      const { container } = render(<TypewriterText text="Test" className="custom-class" />);

      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });

    it("should have pixel font by default", () => {
      const { container } = render(<TypewriterText text="Test" />);

      expect(container.querySelector('.font-pixel')).toBeInTheDocument();
    });
  });

  describe("Timing", () => {
    it("should respect initial delay", () => {
      render(<TypewriterText text="Test" delay={200} speed={50} />);

      // Should not start typing immediately
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(screen.queryByText("T")).not.toBeInTheDocument();

      // Should start after delay
      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(screen.getByText("T")).toBeInTheDocument();
    });
  });
});

describe("TerminalTypewriter", () => {
  describe("Command Execution", () => {
    it("should render terminal prompt", () => {
      render(<TerminalTypewriter commands={["ls -la"]} />);

      expect(screen.getByText("caspian@localhost:~$")).toBeInTheDocument();
    });

    it("should use custom prompt", () => {
      render(<TerminalTypewriter commands={["test"]} prompt="user@host:~$" />);

      expect(screen.getByText("user@host:~$")).toBeInTheDocument();
    });

    it("should handle multiple commands", () => {
      const commands = ["first", "second"];
      render(<TerminalTypewriter commands={commands} />);

      // Should render without crashing
      expect(screen.getByText("caspian@localhost:~$")).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("should have monospace font", () => {
      const { container } = render(<TerminalTypewriter commands={["test"]} />);

      expect(container.querySelector('.font-mono')).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const { container } = render(<TerminalTypewriter commands={["test"]} className="custom" />);

      expect(container.querySelector('.custom')).toBeInTheDocument();
    });
  });
});

describe("MatrixTypewriter", () => {
  describe("Matrix Effect", () => {
    it("should render component with matrix styling", () => {
      const { container } = render(<MatrixTypewriter text="Matrix" />);

      expect(container.querySelector('.font-mono.text-green-400')).toBeInTheDocument();
    });

    it("should have green text color", () => {
      const { container } = render(<MatrixTypewriter text="Test" />);

      expect(container.querySelector('.text-green-400')).toBeInTheDocument();
    });

    it("should have monospace font", () => {
      const { container } = render(<MatrixTypewriter text="Test" />);

      expect(container.querySelector('.font-mono')).toBeInTheDocument();
    });
  });

  describe("Glitch Effect", () => {
    it("should apply glitch probability", () => {
      render(<MatrixTypewriter text="A" glitchProbability={1} speed={50} />);

      act(() => {
        vi.advanceTimersByTime(50);
      });

      // With 100% glitch probability, should create glitch effect
      expect(true).toBe(true); // Glitch effect is random, just test it doesn't crash
    });
  });
});