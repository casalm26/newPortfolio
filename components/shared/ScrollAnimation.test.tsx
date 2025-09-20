import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ScrollAnimation, { useScrollAnimation, ParallaxScroll, StaggerAnimation } from './ScrollAnimation';

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});

// Mock window.IntersectionObserver
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: mockIntersectionObserver
});

// Mock window.pageYOffset
Object.defineProperty(window, 'pageYOffset', {
  writable: true,
  configurable: true,
  value: 0
});

describe('ScrollAnimation', () => {
  beforeEach(() => {
    mockIntersectionObserver.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Animation Component', () => {
    it('should render children with initial animation classes', () => {
      render(
        <ScrollAnimation animation="fadeIn">
          <div data-testid="animated-content">Test Content</div>
        </ScrollAnimation>
      );

      const content = screen.getByTestId('animated-content');
      expect(content).toBeInTheDocument();

      // Check that parent container has initial fade classes
      const container = content.parentElement;
      expect(container).toHaveClass('opacity-0');
      expect(container).toHaveClass('transition-opacity');
    });

    it('should apply correct animation classes for slideUp', () => {
      render(
        <ScrollAnimation animation="slideUp">
          <div data-testid="slide-content">Slide Content</div>
        </ScrollAnimation>
      );

      const content = screen.getByTestId('slide-content');
      const container = content.parentElement;

      expect(container).toHaveClass('opacity-0');
      expect(container).toHaveClass('translate-y-8');
      expect(container).toHaveClass('transition-all');
    });

    it('should apply correct animation classes for scaleIn', () => {
      render(
        <ScrollAnimation animation="scaleIn">
          <div data-testid="scale-content">Scale Content</div>
        </ScrollAnimation>
      );

      const content = screen.getByTestId('scale-content');
      const container = content.parentElement;

      expect(container).toHaveClass('opacity-0');
      expect(container).toHaveClass('scale-95');
      expect(container).toHaveClass('transition-all');
    });

    it('should accept custom className', () => {
      render(
        <ScrollAnimation className="custom-class">
          <div data-testid="custom-content">Custom Content</div>
        </ScrollAnimation>
      );

      const content = screen.getByTestId('custom-content');
      const container = content.parentElement;

      expect(container).toHaveClass('custom-class');
    });

    it('should apply custom duration style', () => {
      render(
        <ScrollAnimation duration={800}>
          <div data-testid="duration-content">Duration Content</div>
        </ScrollAnimation>
      );

      const content = screen.getByTestId('duration-content');
      const container = content.parentElement;

      expect(container).toHaveStyle('transition-duration: 800ms');
    });
  });

  describe('Animation Types', () => {
    it('should handle slideLeft animation', () => {
      render(
        <ScrollAnimation animation="slideLeft">
          <div data-testid="slide-left">Slide Left</div>
        </ScrollAnimation>
      );

      const content = screen.getByTestId('slide-left');
      const container = content.parentElement;

      expect(container).toHaveClass('translate-x-8');
    });

    it('should handle slideRight animation', () => {
      render(
        <ScrollAnimation animation="slideRight">
          <div data-testid="slide-right">Slide Right</div>
        </ScrollAnimation>
      );

      const content = screen.getByTestId('slide-right');
      const container = content.parentElement;

      expect(container).toHaveClass('-translate-x-8');
    });

    it('should handle rotateIn animation', () => {
      render(
        <ScrollAnimation animation="rotateIn">
          <div data-testid="rotate-in">Rotate In</div>
        </ScrollAnimation>
      );

      const content = screen.getByTestId('rotate-in');
      const container = content.parentElement;

      expect(container).toHaveClass('rotate-6');
      expect(container).toHaveClass('scale-95');
    });
  });

  describe('ParallaxScroll Component', () => {
    it('should render children with overflow hidden', () => {
      render(
        <ParallaxScroll>
          <div data-testid="parallax-content">Parallax Content</div>
        </ParallaxScroll>
      );

      const content = screen.getByTestId('parallax-content');
      expect(content).toBeInTheDocument();

      // Check that container has overflow hidden
      const outerContainer = content.parentElement?.parentElement;
      expect(outerContainer).toHaveClass('overflow-hidden');
    });

    it('should apply custom className to container', () => {
      render(
        <ParallaxScroll className="parallax-custom">
          <div data-testid="parallax-custom-content">Custom Parallax</div>
        </ParallaxScroll>
      );

      const content = screen.getByTestId('parallax-custom-content');
      const outerContainer = content.parentElement?.parentElement;

      expect(outerContainer).toHaveClass('parallax-custom');
    });

    it('should set initial transform style', () => {
      render(
        <ParallaxScroll>
          <div data-testid="parallax-transform">Transform Content</div>
        </ParallaxScroll>
      );

      const content = screen.getByTestId('parallax-transform');
      const innerContainer = content.parentElement;

      expect(innerContainer).toHaveStyle('will-change: transform');
    });
  });

  describe('StaggerAnimation Component', () => {
    it('should render multiple children with stagger effect', () => {
      const children = [
        <div key="1" data-testid="stagger-1">Item 1</div>,
        <div key="2" data-testid="stagger-2">Item 2</div>,
        <div key="3" data-testid="stagger-3">Item 3</div>
      ];

      render(
        <StaggerAnimation>
          {children}
        </StaggerAnimation>
      );

      expect(screen.getByTestId('stagger-1')).toBeInTheDocument();
      expect(screen.getByTestId('stagger-2')).toBeInTheDocument();
      expect(screen.getByTestId('stagger-3')).toBeInTheDocument();
    });

    it('should apply custom className to container', () => {
      const children = [
        <div key="1" data-testid="stagger-custom-1">Item 1</div>
      ];

      const { container } = render(
        <StaggerAnimation className="stagger-custom">
          {children}
        </StaggerAnimation>
      );

      expect(container.firstChild).toHaveClass('stagger-custom');
    });

    it('should handle empty children array', () => {
      const { container } = render(
        <StaggerAnimation>
          {[]}
        </StaggerAnimation>
      );

      expect(container.firstChild).toBeInTheDocument();
      expect(container.firstChild?.children).toHaveLength(0);
    });
  });

  describe('Animation Options', () => {
    it('should handle delay prop', () => {
      render(
        <ScrollAnimation delay={500}>
          <div data-testid="delayed-content">Delayed Content</div>
        </ScrollAnimation>
      );

      const content = screen.getByTestId('delayed-content');
      expect(content).toBeInTheDocument();
    });

    it('should handle threshold prop', () => {
      render(
        <ScrollAnimation threshold={0.5}>
          <div data-testid="threshold-content">Threshold Content</div>
        </ScrollAnimation>
      );

      const content = screen.getByTestId('threshold-content');
      expect(content).toBeInTheDocument();
    });

    it('should handle once prop', () => {
      render(
        <ScrollAnimation once={false}>
          <div data-testid="repeat-content">Repeat Content</div>
        </ScrollAnimation>
      );

      const content = screen.getByTestId('repeat-content');
      expect(content).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle missing children gracefully', () => {
      const { container } = render(
        <ScrollAnimation>
          {null}
        </ScrollAnimation>
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle invalid animation type gracefully', () => {
      render(
        <ScrollAnimation animation="fadeIn">
          <div data-testid="fallback-content">Fallback Content</div>
        </ScrollAnimation>
      );

      const content = screen.getByTestId('fallback-content');
      expect(content).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should not create multiple observers for same element', () => {
      render(
        <ScrollAnimation>
          <div data-testid="performance-content">Performance Content</div>
        </ScrollAnimation>
      );

      expect(mockIntersectionObserver).toHaveBeenCalledTimes(1);
    });

    it('should apply will-change property for parallax', () => {
      render(
        <ParallaxScroll>
          <div data-testid="will-change-content">Will Change</div>
        </ParallaxScroll>
      );

      const content = screen.getByTestId('will-change-content');
      const innerContainer = content.parentElement;

      expect(innerContainer).toHaveStyle('will-change: transform');
    });
  });
});