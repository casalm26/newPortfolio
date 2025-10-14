import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

import Page from "./page";

vi.mock("@/components/shared/Header", () => ({
  default: () => <header data-testid="header">Mock Header</header>,
}));

vi.mock("@/components/shared/Footer", () => ({
  default: () => <footer data-testid="footer">Mock Footer</footer>,
}));

vi.mock("@/components/shared/ScrollAnimation", () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => (
    <div data-testid="scroll-animation">{children}</div>
  ),
  ParallaxScroll: ({ children }: { children: ReactNode }) => (
    <div data-testid="parallax-scroll">{children}</div>
  ),
  StaggerAnimation: ({
    children,
  }: {
    children: ReactNode;
    staggerDelay?: number;
    animation?: string;
    className?: string;
  }) => <div data-testid="stagger-animation">{children}</div>,
}));

vi.mock("@/components/PixelArtName", () => ({
  PixelArtName: ({ className }: { className?: string }) => (
    <div data-testid="pixel-art-name" className={className}>
      Pixel Art Name
    </div>
  ),
}));

vi.mock("@/components/games/PixelSnakeGame", () => ({
  default: () => <div data-testid="pixel-snake-game">Snake Game Mock</div>,
}));

describe("Home page", () => {
  const renderPage = () => render(<Page />);

  it("renders the hero section with the pixel art name", () => {
    const { container } = renderPage();

    const sections = Array.from(container.querySelectorAll("section"));
    expect(sections[0]).toContainElement(screen.getByTestId("pixel-art-name"));
    expect(screen.getByText(/Caspian Almerud/i)).toBeInTheDocument();
  });

  it("places the snake game right after the hero with the annotation", () => {
    const { container } = renderPage();

    const sections = Array.from(container.querySelectorAll("section"));
    const snakeSection = sections[1];

    expect(snakeSection).toHaveTextContent(/PIXEL SNAKE/i);
    expect(snakeSection).toHaveTextContent("You can't snake your way out of this one!");
    expect(snakeSection).toContainElement(screen.getByTestId("pixel-snake-game"));
  });

  it("shows quick access navigation tiles", () => {
    renderPage();

    const quickAccessHeading = screen.getByText(/QUICK ACCESS\//i);
    const quickAccessSection = quickAccessHeading.closest("section");
    expect(quickAccessSection).not.toBeNull();

    const headings = within(quickAccessSection as HTMLElement).getAllByRole("heading", {
      level: 3,
    });

    const labels = headings.map((heading) => heading.textContent?.trim());
    expect(labels).toEqual([
      "PROJECTS",
      "ARTICLES",
      "CV",
    ]);
  });

  it("retains the footer at the bottom of the page", () => {
    const { container } = renderPage();

    expect(container.lastChild).toContainElement(screen.getByTestId("footer"));
  });
});
