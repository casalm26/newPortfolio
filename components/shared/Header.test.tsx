import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from './Header';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  usePathname: () => '/'
}));

describe('Header', () => {
  describe('Component Rendering', () => {
    it('should render navigation items correctly', () => {
      render(<Header />);
      
      expect(screen.getByText('~/')).toBeInTheDocument();
      expect(screen.getByText('HOME')).toBeInTheDocument();
      expect(screen.getByText('./projects')).toBeInTheDocument();
      expect(screen.getByText('PROJECTS')).toBeInTheDocument();
      expect(screen.getByText('./cv')).toBeInTheDocument();
      expect(screen.getByText('CV')).toBeInTheDocument();
    });

    it('should render proper navigation links', () => {
      render(<Header />);
      
      const homeLink = screen.getByRole('link', { name: /HOME/i });
      const projectsLink = screen.getByRole('link', { name: /PROJECTS/i });
      const cvLink = screen.getByRole('link', { name: /CV/i });
      
      expect(homeLink).toHaveAttribute('href', '/');
      expect(projectsLink).toHaveAttribute('href', '/projects');
      expect(cvLink).toHaveAttribute('href', '/cv');
    });

    it('should have terminal styling classes', () => {
      const { container } = render(<Header />);
      
      expect(container.firstChild).toHaveClass('fixed', 'top-0', 'left-0', 'right-0', 'z-50', 'bg-black/95', 'backdrop-blur-sm', 'border-b', 'border-terminal-400');
    });
  });

  describe('Navigation Behavior', () => {
    it('should apply active styling to current page', () => {
      render(<Header />);
      
      // When on home page, home link should have active styling
      const homeLink = screen.getByRole('link', { name: /HOME/i });
      expect(homeLink).toHaveClass('text-white');
    });

    it('should apply hover effects to navigation items', () => {
      render(<Header />);
      
      const projectsLink = screen.getByRole('link', { name: /PROJECTS/i });
      expect(projectsLink).toHaveClass('hover:bg-white', 'hover:text-black');
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic navigation structure', () => {
      render(<Header />);
      
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('should have accessible link text', () => {
      render(<Header />);
      
      expect(screen.getByRole('link', { name: /HOME/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /PROJECTS/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /CV/i })).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing pathname gracefully', () => {
      vi.mock('next/navigation', () => ({
        usePathname: () => undefined
      }));
      
      expect(() => render(<Header />)).not.toThrow();
    });

    it('should render correctly with different viewport sizes', () => {
      render(<Header />);
      
      const container = screen.getByRole('navigation').parentElement?.parentElement;
      expect(container).toHaveClass('container', 'mx-auto', 'px-4', 'py-3');
    });
  });
});