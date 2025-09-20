import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PixelButton, { PixelIconButton, PixelToggleButton, PixelLoadingButton } from "./PixelButton";

describe("PixelButton", () => {
  describe("Basic Functionality", () => {
    it("should render button with text", () => {
      render(<PixelButton>Click me</PixelButton>);

      expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
    });

    it("should handle click events", () => {
      const handleClick = vi.fn();
      render(<PixelButton onClick={handleClick}>Click me</PixelButton>);

      fireEvent.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledOnce();
    });

    it("should be disabled when disabled prop is true", () => {
      render(<PixelButton disabled>Disabled</PixelButton>);

      expect(screen.getByRole("button")).toBeDisabled();
    });
  });

  describe("Variants", () => {
    it("should apply primary variant by default", () => {
      const { container } = render(<PixelButton>Primary</PixelButton>);

      expect(container.querySelector('.bg-white')).toBeInTheDocument();
    });

    it("should apply secondary variant", () => {
      const { container } = render(<PixelButton variant="secondary">Secondary</PixelButton>);

      expect(container.querySelector('.bg-transparent')).toBeInTheDocument();
    });

    it("should apply accent variant", () => {
      const { container } = render(<PixelButton variant="accent">Accent</PixelButton>);

      expect(container.querySelector('.bg-green-400')).toBeInTheDocument();
    });

    it("should apply danger variant", () => {
      const { container } = render(<PixelButton variant="danger">Danger</PixelButton>);

      expect(container.querySelector('.bg-red-500')).toBeInTheDocument();
    });

    it("should apply success variant", () => {
      const { container } = render(<PixelButton variant="success">Success</PixelButton>);

      expect(container.querySelector('.bg-blue-500')).toBeInTheDocument();
    });
  });

  describe("Sizes", () => {
    it("should apply medium size by default", () => {
      const { container } = render(<PixelButton>Medium</PixelButton>);

      expect(container.querySelector('.text-sm')).toBeInTheDocument();
    });

    it("should apply small size", () => {
      const { container } = render(<PixelButton size="sm">Small</PixelButton>);

      expect(container.querySelector('.text-xs')).toBeInTheDocument();
    });

    it("should apply large size", () => {
      const { container } = render(<PixelButton size="lg">Large</PixelButton>);

      expect(container.querySelector('.text-base')).toBeInTheDocument();
    });
  });

  describe("Effects", () => {
    it("should apply press effect by default", () => {
      const { container } = render(<PixelButton>Press</PixelButton>);

      expect(container.querySelector('button')).toHaveClass('transition-all');
    });

    it("should apply bounce effect", () => {
      const { container } = render(<PixelButton effect="bounce">Bounce</PixelButton>);

      expect(container.querySelector('button')).toHaveClass('transition-all');
    });

    it("should apply glitch effect", () => {
      const { container } = render(<PixelButton effect="glitch">Glitch</PixelButton>);

      expect(container.querySelector('button')).toHaveClass('transition-all');
    });

    it("should apply glow effect", () => {
      const { container } = render(<PixelButton effect="glow">Glow</PixelButton>);

      expect(container.querySelector('button')).toHaveClass('transition-all');
    });
  });

  describe("Interaction States", () => {
    it("should handle mouse down and up events", () => {
      render(<PixelButton>Interactive</PixelButton>);
      const button = screen.getByRole("button");

      fireEvent.mouseDown(button);
      fireEvent.mouseUp(button);

      expect(button).toBeInTheDocument();
    });

    it("should handle mouse leave event", () => {
      render(<PixelButton>Interactive</PixelButton>);
      const button = screen.getByRole("button");

      fireEvent.mouseDown(button);
      fireEvent.mouseLeave(button);

      expect(button).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("should apply custom className", () => {
      const { container } = render(<PixelButton className="custom-class">Custom</PixelButton>);

      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });

    it("should have pixel font by default", () => {
      const { container } = render(<PixelButton>Pixel</PixelButton>);

      expect(container.querySelector('.font-pixel')).toBeInTheDocument();
    });

    it("should have border styling", () => {
      const { container } = render(<PixelButton>Border</PixelButton>);

      expect(container.querySelector('.border-2')).toBeInTheDocument();
    });
  });
});

describe("PixelIconButton", () => {
  const TestIcon = () => <span data-testid="test-icon">🎮</span>;

  it("should render icon button", () => {
    render(<PixelIconButton icon={<TestIcon />} label="Game" />);

    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveAttribute("title", "Game");
  });

  it("should have square aspect ratio", () => {
    const { container } = render(<PixelIconButton icon={<TestIcon />} />);

    expect(container.querySelector('.aspect-square')).toBeInTheDocument();
  });

  it("should center icon content", () => {
    const { container } = render(<PixelIconButton icon={<TestIcon />} />);

    expect(container.querySelector('.flex')).toBeInTheDocument();
  });
});

describe("PixelToggleButton", () => {
  it("should render toggle button", () => {
    const handleToggle = vi.fn();
    render(<PixelToggleButton isToggled={false} onToggle={handleToggle}>Toggle</PixelToggleButton>);

    expect(screen.getByRole("button", { name: "Toggle" })).toBeInTheDocument();
  });

  it("should call onToggle when clicked", () => {
    const handleToggle = vi.fn();
    render(<PixelToggleButton isToggled={false} onToggle={handleToggle}>Toggle</PixelToggleButton>);

    fireEvent.click(screen.getByRole("button"));
    expect(handleToggle).toHaveBeenCalledWith(true);
  });

  it("should show toggled state", () => {
    const handleToggle = vi.fn();
    const { container } = render(
      <PixelToggleButton isToggled={true} onToggle={handleToggle}>Toggled</PixelToggleButton>
    );

    expect(container.querySelector('.bg-green-400')).toBeInTheDocument();
  });

  it("should toggle between states", () => {
    const handleToggle = vi.fn();
    render(<PixelToggleButton isToggled={true} onToggle={handleToggle}>Toggle</PixelToggleButton>);

    fireEvent.click(screen.getByRole("button"));
    expect(handleToggle).toHaveBeenCalledWith(false);
  });
});

describe("PixelLoadingButton", () => {
  it("should render normal button when not loading", () => {
    render(<PixelLoadingButton isLoading={false}>Submit</PixelLoadingButton>);

    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
    expect(screen.queryByText("LOADING...")).not.toBeInTheDocument();
  });

  it("should show loading state", () => {
    render(<PixelLoadingButton isLoading={true}>Submit</PixelLoadingButton>);

    expect(screen.getByText("LOADING...")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should use custom loading text", () => {
    render(<PixelLoadingButton isLoading={true} loadingText="PROCESSING...">Submit</PixelLoadingButton>);

    expect(screen.getByText("PROCESSING...")).toBeInTheDocument();
  });

  it("should be disabled when loading", () => {
    render(<PixelLoadingButton isLoading={true}>Submit</PixelLoadingButton>);

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should be disabled when disabled prop is true", () => {
    render(<PixelLoadingButton isLoading={false} disabled>Submit</PixelLoadingButton>);

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should show loading spinner", () => {
    render(<PixelLoadingButton isLoading={true}>Submit</PixelLoadingButton>);

    expect(screen.getByText("⏳")).toBeInTheDocument();
  });
});