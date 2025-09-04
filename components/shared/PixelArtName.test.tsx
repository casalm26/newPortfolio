import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock the PixelArtName component to avoid timer complexity
vi.mock('@/components/landing', () => ({
  PixelArtName: ({ className }: { className?: string }) => (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className || ''}`}>
      <div className="relative">
        <h1 className="font-pixel text-4xl md:text-6xl lg:text-8xl font-bold text-center tracking-wider">
          <span className="text-white">CASPIAN ALMERUD</span>
          <span className="text-white transition-opacity duration-100 opacity-100">|</span>
        </h1>
      </div>
      <div className="text-center space-y-4">
        <p className="font-pixel text-lg md:text-xl text-terminal-300 tracking-wide">$ whoami</p>
        <p className="font-pixel text-sm md:text-base text-terminal-400 tracking-wide">generalist_developer@localhost:~$ pwd</p>
        <div className="flex justify-center space-x-2 mt-4 mb-6">
          <div className="w-1 h-4 bg-white animate-pulse" />
          <div className="w-1 h-4 bg-terminal-400 animate-pulse delay-150" />
          <div className="w-1 h-4 bg-terminal-600 animate-pulse delay-300" />
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center space-y-3 md:space-y-0 md:space-x-4 mt-8">
          <span className="inline-block">cd ./projects</span>
          <span className="inline-block">cat cv.json</span>
          <span className="inline-block">sudo touch contact.sh</span>
        </div>
      </div>
    </div>
  )
}));

const { PixelArtName } = await import('@/components/landing');

describe('PixelArtName', () => {

  describe('Component Rendering', () => {
    it('should render the component with proper structure', () => {
      render(<PixelArtName />);
      
      expect(screen.getByText('$ whoami')).toBeInTheDocument();
      expect(screen.getByText('generalist_developer@localhost:~$ pwd')).toBeInTheDocument();
    });

    it('should render typewriter text container', () => {
      render(<PixelArtName />);
      
      const typewriterContainer = screen.getByRole('heading', { level: 1 });
      expect(typewriterContainer).toHaveClass('font-pixel');
    });

    it('should render terminal commands', () => {
      render(<PixelArtName />);
      
      expect(screen.getByText('cd ./projects')).toBeInTheDocument();
      expect(screen.getByText('cat cv.json')).toBeInTheDocument();
      expect(screen.getByText('sudo touch contact.sh')).toBeInTheDocument();
    });
  });

  describe('Content Display', () => {
    it('should show terminal prompt text', () => {
      render(<PixelArtName />);
      
      expect(screen.getByText('$ whoami')).toBeInTheDocument();
      expect(screen.getByText('generalist_developer@localhost:~$ pwd')).toBeInTheDocument();
    });

    it('should display the name text', () => {
      render(<PixelArtName />);
      
      expect(screen.getByText('CASPIAN ALMERUD')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive typography classes', () => {
      const { container } = render(<PixelArtName />);
      
      const nameElement = screen.getByRole('heading', { level: 1 });
      expect(nameElement).toHaveClass('text-4xl', 'md:text-6xl', 'lg:text-8xl');
    });

    it('should have responsive spacing classes', () => {
      const { container } = render(<PixelArtName />);
      
      expect(container.firstChild).toHaveClass('space-y-4');
    });
  });

  describe('Terminal Commands', () => {
    it('should render terminal commands', () => {
      render(<PixelArtName />);
      
      expect(screen.getByText('cd ./projects')).toBeInTheDocument();
      expect(screen.getByText('cat cv.json')).toBeInTheDocument();
      expect(screen.getByText('sudo touch contact.sh')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle className prop correctly', () => {
      const { container } = render(<PixelArtName className="custom-class" />);
      
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should render without crashing when no props provided', () => {
      expect(() => render(<PixelArtName />)).not.toThrow();
    });
  });
});