import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import PixelButton from './ui/PixelButton';

// Mock next/link
vi.mock('next/link', () => {
  return {
    default: ({ children, href, ...props }: any) => (
      <a href={href} {...props}>
        {children}
      </a>
    )
  };
});

describe('PixelButton', () => {
  describe('Component Rendering', () => {
    it('should render button with default props', () => {
      render(<PixelButton href="/test">Test Button</PixelButton>);
      
      const button = screen.getByRole('link', { name: 'Test Button' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('href', '/test');
    });

    it('should render with primary variant styling', () => {
      render(
        <PixelButton href="/test" variant="primary">
          Primary Button
        </PixelButton>
      );
      
      const button = screen.getByRole('link', { name: 'Primary Button' });
      expect(button).toHaveClass('bg-white', 'text-black');
    });

    it('should render with secondary variant styling', () => {
      render(
        <PixelButton href="/test" variant="secondary">
          Secondary Button
        </PixelButton>
      );
      
      const button = screen.getByRole('link', { name: 'Secondary Button' });
      expect(button).toHaveClass('border-terminal-400', 'text-terminal-300');
    });

    it('should apply pixel font styling', () => {
      render(<PixelButton href="/test">Test</PixelButton>);
      
      const button = screen.getByRole('link', { name: 'Test' });
      expect(button).toHaveClass('font-pixel');
    });
  });

  describe('Size Variants', () => {
    it('should apply default size classes', () => {
      render(<PixelButton href="/test">Test</PixelButton>);
      
      const button = screen.getByRole('link', { name: 'Test' });
      expect(button).toHaveClass('px-6', 'py-3', 'text-sm');
    });

    it('should handle responsive sizing', () => {
      render(<PixelButton href="/test">Test</PixelButton>);
      
      const button = screen.getByRole('link', { name: 'Test' });
      expect(button).toHaveClass('md:px-8', 'md:py-4', 'md:text-base');
    });
  });

  describe('Interactive States', () => {
    it('should have hover effects for primary variant', () => {
      render(
        <PixelButton href="/test" variant="primary">
          Hover Test
        </PixelButton>
      );
      
      const button = screen.getByRole('link', { name: 'Hover Test' });
      expect(button).toHaveClass('hover:bg-transparent', 'hover:text-white');
    });

    it('should have hover effects for secondary variant', () => {
      render(
        <PixelButton href="/test" variant="secondary">
          Hover Test
        </PixelButton>
      );
      
      const button = screen.getByRole('link', { name: 'Hover Test' });
      expect(button).toHaveClass('hover:border-white', 'hover:text-white');
    });

    it('should have transition classes', () => {
      render(<PixelButton href="/test">Test</PixelButton>);
      
      const button = screen.getByRole('link', { name: 'Test' });
      expect(button).toHaveClass('transition-colors');
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard accessible', () => {
      render(<PixelButton href="/test">Accessible Button</PixelButton>);
      
      const button = screen.getByRole('link', { name: 'Accessible Button' });
      expect(button).toBeInTheDocument();
    });

    it('should have proper link semantics', () => {
      render(<PixelButton href="/external">External Link</PixelButton>);
      
      const link = screen.getByRole('link', { name: 'External Link' });
      expect(link).toHaveAttribute('href', '/external');
    });
  });

  describe('Custom Props', () => {
    it('should accept and apply custom className', () => {
      render(
        <PixelButton href="/test" className="custom-class">
          Custom Class
        </PixelButton>
      );
      
      const button = screen.getByRole('link', { name: 'Custom Class' });
      expect(button).toHaveClass('custom-class');
    });

    it('should merge custom className with default classes', () => {
      render(
        <PixelButton href="/test" className="custom-class">
          Merged Classes
        </PixelButton>
      );
      
      const button = screen.getByRole('link', { name: 'Merged Classes' });
      expect(button).toHaveClass('custom-class', 'font-pixel', 'border');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty href', () => {
      render(<PixelButton href="">Empty Href</PixelButton>);
      
      const button = screen.getByRole('link', { name: 'Empty Href' });
      expect(button).toHaveAttribute('href', '');
    });

    it('should handle long text content', () => {
      const longText = 'This is a very long button text that might wrap';
      render(<PixelButton href="/test">{longText}</PixelButton>);
      
      const button = screen.getByRole('link', { name: longText });
      expect(button).toBeInTheDocument();
    });

    it('should handle special characters in href', () => {
      render(<PixelButton href="/test?param=value&other=123">Special Chars</PixelButton>);
      
      const button = screen.getByRole('link', { name: 'Special Chars' });
      expect(button).toHaveAttribute('href', '/test?param=value&other=123');
    });

    it('should render without crashing with minimal props', () => {
      expect(() => 
        render(<PixelButton href="/">Minimal</PixelButton>)
      ).not.toThrow();
    });
  });
});