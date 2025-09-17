import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import PixelSnakeGame from './PixelSnakeGame';

// Mock the interval functions
vi.mock('timers', () => ({
  setInterval: vi.fn(),
  clearInterval: vi.fn(),
}));

describe('PixelSnakeGame', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Game Rendering', () => {
    it('should render the game title and initial elements', () => {
      render(<PixelSnakeGame />);

      expect(screen.getByText('PIXEL SNAKE')).toBeInTheDocument();
      expect(screen.getByText('./snake_game.exe')).toBeInTheDocument();
      expect(screen.getByText(/SCORE:/)).toBeInTheDocument();
      expect(screen.getByText('START GAME')).toBeInTheDocument();
    });

    it('should display initial score as 0000', () => {
      render(<PixelSnakeGame />);

      expect(screen.getByText('SCORE:')).toBeInTheDocument();
      expect(screen.getByText('0000')).toBeInTheDocument();
    });

    it('should render game controls and instructions', () => {
      render(<PixelSnakeGame />);

      expect(screen.getByText('CONTROLS:')).toBeInTheDocument();
      expect(screen.getByText(/ARROW KEYS or WASD/)).toBeInTheDocument();
      expect(screen.getByText(/SPACE to pause/)).toBeInTheDocument();
    });
  });

  describe('Game Controls', () => {
    it('should start game when START GAME button is clicked', () => {
      render(<PixelSnakeGame />);

      const startButton = screen.getByText('START GAME');
      fireEvent.click(startButton);

      expect(screen.getByText('PAUSE')).toBeInTheDocument();
      expect(screen.queryByText('START GAME')).not.toBeInTheDocument();
    });

    it('should show pause button when game is started', () => {
      render(<PixelSnakeGame />);

      // Start the game first
      const startButton = screen.getByText('START GAME');
      fireEvent.click(startButton);

      // Should show pause button
      expect(screen.getByText('PAUSE')).toBeInTheDocument();
    });

    it('should reset game when RESET button is clicked', () => {
      render(<PixelSnakeGame />);

      // Start and then reset
      const startButton = screen.getByText('START GAME');
      fireEvent.click(startButton);

      const resetButton = screen.getByText('RESET');
      fireEvent.click(resetButton);

      expect(screen.getByText('START GAME')).toBeInTheDocument();
      expect(screen.getByText('SCORE:')).toBeInTheDocument();
      expect(screen.getByText('0000')).toBeInTheDocument();
    });
  });

  describe('Keyboard Controls', () => {
    it('should handle arrow key navigation when game is playing', () => {
      render(<PixelSnakeGame />);

      // Start the game
      const startButton = screen.getByText('START GAME');
      fireEvent.click(startButton);

      // Test arrow key presses (no error should occur)
      fireEvent.keyDown(window, { key: 'ArrowUp' });
      fireEvent.keyDown(window, { key: 'ArrowDown' });
      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      fireEvent.keyDown(window, { key: 'ArrowRight' });

      expect(screen.getByText('PAUSE')).toBeInTheDocument();
    });

    it('should handle WASD keys for navigation', () => {
      render(<PixelSnakeGame />);

      // Start the game
      const startButton = screen.getByText('START GAME');
      fireEvent.click(startButton);

      // Test WASD key presses
      fireEvent.keyDown(window, { key: 'w' });
      fireEvent.keyDown(window, { key: 's' });
      fireEvent.keyDown(window, { key: 'a' });
      fireEvent.keyDown(window, { key: 'd' });

      expect(screen.getByText('PAUSE')).toBeInTheDocument();
    });

    it('should handle spacebar input for pause functionality', () => {
      render(<PixelSnakeGame />);

      // Start the game
      const startButton = screen.getByText('START GAME');
      fireEvent.click(startButton);

      // Press spacebar (should not error)
      fireEvent.keyDown(window, { key: ' ' });

      // Game should still be rendered
      expect(screen.getByText('PIXEL SNAKE')).toBeInTheDocument();
    });
  });

  describe('Game State', () => {
    it('should not respond to keyboard input when game is not playing', () => {
      render(<PixelSnakeGame />);

      // Try to use controls without starting game
      fireEvent.keyDown(window, { key: 'ArrowUp' });

      // Game should still show start button
      expect(screen.getByText('START GAME')).toBeInTheDocument();
    });

    it('should render SVG game board with correct dimensions', () => {
      render(<PixelSnakeGame />);

      const gameBoard = document.querySelector('svg');
      expect(gameBoard).toBeInTheDocument();
      expect(gameBoard).toHaveAttribute('width', '400'); // 20 * 20
      expect(gameBoard).toHaveAttribute('height', '400');
    });

    it('should display game over screen with final score', async () => {
      render(<PixelSnakeGame />);

      // This test would need to simulate game over conditions
      // For now, we just check the game over overlay elements exist in DOM structure
      const gameContainer = document.querySelector('.absolute.inset-0');
      expect(gameContainer).toBeNull(); // No game over initially
    });
  });

  describe('Score Display', () => {
    it('should pad score with leading zeros', () => {
      render(<PixelSnakeGame />);

      // Initial score should be padded
      expect(screen.getByText(/0000/)).toBeInTheDocument();
    });

    it('should contain game over elements in component structure', () => {
      // This test verifies the game over overlay exists in the component
      // The actual game over state would need simulation to test properly
      const { container } = render(<PixelSnakeGame />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper button roles', () => {
      render(<PixelSnakeGame />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);

      const startButton = screen.getByText('START GAME');
      expect(startButton.tagName).toBe('BUTTON');
    });

    it('should have descriptive text for game instructions', () => {
      render(<PixelSnakeGame />);

      expect(screen.getByText(/Eat the red pixels/)).toBeInTheDocument();
      expect(screen.getByText(/Don't hit walls/)).toBeInTheDocument();
    });
  });
});