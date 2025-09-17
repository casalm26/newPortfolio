import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import GamesPage from './page';

// Mock the components to avoid complex nested testing
vi.mock('@/components/shared/Header', () => ({
  default: () => <div data-testid="header">Header</div>
}));

vi.mock('@/components/shared/Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>
}));

vi.mock('@/components/games/PixelSnakeGame', () => ({
  default: () => <div data-testid="snake-game">Snake Game</div>
}));

describe('GamesPage', () => {
  describe('Page Structure', () => {
    it('should render header and footer', () => {
      render(<GamesPage />);

      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('should render terminal-style header', () => {
      render(<GamesPage />);

      expect(screen.getByText('caspian@localhost:~$ ls games/')).toBeInTheDocument();
      expect(screen.getByText('GAMES/')).toBeInTheDocument();
    });

    it('should render page description', () => {
      render(<GamesPage />);

      expect(screen.getByText(/Interactive pixel art games/)).toBeInTheDocument();
      expect(screen.getByText(/retro game development/)).toBeInTheDocument();
    });
  });

  describe('Featured Game Section', () => {
    it('should render featured game title', () => {
      render(<GamesPage />);

      expect(screen.getByText('FEATURED GAME')).toBeInTheDocument();
      expect(screen.getByText('./pixel_snake.exe - Classic Snake reimagined with modern web tech')).toBeInTheDocument();
    });

    it('should render snake game component', () => {
      render(<GamesPage />);

      expect(screen.getByTestId('snake-game')).toBeInTheDocument();
    });

    it('should render game information', () => {
      render(<GamesPage />);

      expect(screen.getByText('ABOUT PIXEL SNAKE')).toBeInTheDocument();
      expect(screen.getByText(/modern take on the classic Snake game/)).toBeInTheDocument();
    });

    it('should display technical details', () => {
      render(<GamesPage />);

      expect(screen.getByText('TECHNICAL HIGHLIGHTS:')).toBeInTheDocument();
      expect(screen.getByText(/Custom game loop/)).toBeInTheDocument();
      expect(screen.getByText(/collision detection/)).toBeInTheDocument();
    });

    it('should show technology stack', () => {
      render(<GamesPage />);

      expect(screen.getByText(/React • TypeScript • Canvas • Game Loop/)).toBeInTheDocument();
      expect(screen.getByText(/Collision Detection • State Management • Keyboard Controls/)).toBeInTheDocument();
    });
  });

  describe('Coming Soon Section', () => {
    it('should render coming soon title', () => {
      render(<GamesPage />);

      expect(screen.getByText('COMING SOON')).toBeInTheDocument();
      expect(screen.getByText('Future interactive experiences in development')).toBeInTheDocument();
    });

    it('should display future game concepts', () => {
      render(<GamesPage />);

      expect(screen.getByText('PIXEL TETRIS')).toBeInTheDocument();
      expect(screen.getByText('PIXEL PONG')).toBeInTheDocument();
      expect(screen.getByText('CODE BREAKER')).toBeInTheDocument();
    });

    it('should show game statuses', () => {
      render(<GamesPage />);

      expect(screen.getByText('STATUS: Planning')).toBeInTheDocument();
      expect(screen.getByText('STATUS: Design')).toBeInTheDocument();
      expect(screen.getByText('STATUS: Concept')).toBeInTheDocument();
    });

    it('should display game features', () => {
      render(<GamesPage />);

      expect(screen.getByText('FEATURES: WebGL • Particle Systems • Audio')).toBeInTheDocument();
      expect(screen.getByText('FEATURES: AI • WebSockets • Multiplayer')).toBeInTheDocument();
      expect(screen.getByText('FEATURES: Algorithms • Visualizations • Metrics')).toBeInTheDocument();
    });
  });

  describe('Development Process Section', () => {
    it('should render development process title', () => {
      render(<GamesPage />);

      expect(screen.getByText('DEVELOPMENT PROCESS')).toBeInTheDocument();
      expect(screen.getByText('Behind the scenes of game creation')).toBeInTheDocument();
    });

    it('should display technical approach steps', () => {
      render(<GamesPage />);

      expect(screen.getByText('TECHNICAL APPROACH')).toBeInTheDocument();
      expect(screen.getByText('1. GAME DESIGN')).toBeInTheDocument();
      expect(screen.getByText('2. CORE ENGINE')).toBeInTheDocument();
      expect(screen.getByText('3. OPTIMIZATION')).toBeInTheDocument();
    });

    it('should show tech stack details', () => {
      render(<GamesPage />);

      expect(screen.getByText('TECH STACK')).toBeInTheDocument();
      expect(screen.getByText('RENDERING')).toBeInTheDocument();
      expect(screen.getByText('INTERACTION')).toBeInTheDocument();
      expect(screen.getByText('PERFORMANCE')).toBeInTheDocument();
    });

    it('should display technology details', () => {
      render(<GamesPage />);

      expect(screen.getByText(/Canvas API for 2D graphics/)).toBeInTheDocument();
      expect(screen.getByText(/WebGL for 3D effects/)).toBeInTheDocument();
      expect(screen.getByText(/RequestAnimationFrame game loops/)).toBeInTheDocument();
    });
  });

  describe('Footer', () => {
    it('should render terminal footer with description', () => {
      render(<GamesPage />);

      expect(screen.getByText(/games developed with react, typescript/)).toBeInTheDocument();
      expect(screen.getByText(/built for learning and entertainment/)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<GamesPage />);

      expect(screen.getByRole('heading', { name: /GAMES\// })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /FEATURED GAME/ })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /COMING SOON/ })).toBeInTheDocument();
    });

    it('should have descriptive content for screen readers', () => {
      render(<GamesPage />);

      expect(screen.getByText(/Interactive pixel art games showcasing creative coding/)).toBeInTheDocument();
    });
  });

  describe('Layout and Styling', () => {
    it('should apply terminal styling classes', () => {
      const { container } = render(<GamesPage />);

      expect(container.querySelector('.font-pixel')).toBeInTheDocument();
      expect(container.querySelector('.text-terminal-400')).toBeInTheDocument();
      expect(container.querySelector('.border-terminal-400')).toBeInTheDocument();
    });

    it('should use grid layouts for game sections', () => {
      const { container } = render(<GamesPage />);

      expect(container.querySelector('.grid')).toBeInTheDocument();
    });
  });
});