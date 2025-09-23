import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { LazySection, useIntersectionObserver } from './LazySection';

// Mock the intersection observer
const mockIntersectionObserver = vi.fn();
const mockObserve = vi.fn();
const mockUnobserve = vi.fn();
const mockDisconnect = vi.fn();

beforeEach(() => {
  mockIntersectionObserver.mockReturnValue({
    observe: mockObserve,
    unobserve: mockUnobserve,
    disconnect: mockDisconnect,
  });

  global.IntersectionObserver = mockIntersectionObserver;
  global.window.IntersectionObserver = mockIntersectionObserver;
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('LazySection', () => {
  describe('Basic Functionality', () => {
    it('should render fallback initially when not visible', () => {
      const TestComponent = () => <div>Lazy content</div>;
      const fallback = <div>Loading...</div>;

      render(
        <LazySection fallback={fallback}>
          <TestComponent />
        </LazySection>
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.queryByText('Lazy content')).not.toBeInTheDocument();
    });

    it('should set up intersection observer on mount', () => {
      const TestComponent = () => <div>Lazy content</div>;

      render(
        <LazySection>
          <TestComponent />
        </LazySection>
      );

      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          rootMargin: '100px',
          threshold: 0.1,
        })
      );
      expect(mockObserve).toHaveBeenCalled();
    });

    it('should render children when intersection observer is not available', () => {
      global.IntersectionObserver = undefined as any;
      global.window.IntersectionObserver = undefined as any;

      const TestComponent = () => <div>Lazy content</div>;

      render(
        <LazySection>
          <TestComponent />
        </LazySection>
      );

      expect(screen.getByText('Lazy content')).toBeInTheDocument();
    });

    it('should accept custom root margin and threshold', () => {
      const TestComponent = () => <div>Lazy content</div>;

      render(
        <LazySection rootMargin="200px" threshold={0.5}>
          <TestComponent />
        </LazySection>
      );

      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        {
          rootMargin: '200px',
          threshold: 0.5,
        }
      );
    });

    it('should apply custom className and component type', () => {
      const TestComponent = () => <div>Lazy content</div>;

      render(
        <LazySection as="section" className="custom-class">
          <TestComponent />
        </LazySection>
      );

      const section = screen.getByRole('generic');
      expect(section.tagName).toBe('SECTION');
      expect(section).toHaveClass('custom-class');
    });
  });

  describe('Intersection Observer Behavior', () => {
    it('should render children when element becomes visible', async () => {
      let intersectionCallback: (entries: IntersectionObserverEntry[]) => void;

      mockIntersectionObserver.mockImplementation((callback) => {
        intersectionCallback = callback;
        return {
          observe: mockObserve,
          unobserve: mockUnobserve,
          disconnect: mockDisconnect,
        };
      });

      const TestComponent = () => <div>Lazy content</div>;
      const fallback = <div>Loading...</div>;

      render(
        <LazySection fallback={fallback}>
          <TestComponent />
        </LazySection>
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();

      // Simulate intersection
      intersectionCallback!([
        {
          isIntersecting: true,
          target: document.createElement('div'),
        } as IntersectionObserverEntry,
      ]);

      await waitFor(() => {
        expect(screen.getByText('Lazy content')).toBeInTheDocument();
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
    });

    it('should disconnect observer when triggerOnce is true', async () => {
      let intersectionCallback: (entries: IntersectionObserverEntry[]) => void;

      mockIntersectionObserver.mockImplementation((callback) => {
        intersectionCallback = callback;
        return {
          observe: mockObserve,
          unobserve: mockUnobserve,
          disconnect: mockDisconnect,
        };
      });

      const TestComponent = () => <div>Lazy content</div>;

      render(
        <LazySection triggerOnce={true}>
          <TestComponent />
        </LazySection>
      );

      // Simulate intersection
      intersectionCallback!([
        {
          isIntersecting: true,
          target: document.createElement('div'),
        } as IntersectionObserverEntry,
      ]);

      await waitFor(() => {
        expect(mockDisconnect).toHaveBeenCalled();
      });
    });

    it('should not disconnect observer when triggerOnce is false', async () => {
      let intersectionCallback: (entries: IntersectionObserverEntry[]) => void;

      mockIntersectionObserver.mockImplementation((callback) => {
        intersectionCallback = callback;
        return {
          observe: mockObserve,
          unobserve: mockUnobserve,
          disconnect: mockDisconnect,
        };
      });

      const TestComponent = () => <div>Lazy content</div>;

      render(
        <LazySection triggerOnce={false}>
          <TestComponent />
        </LazySection>
      );

      // Simulate intersection
      intersectionCallback!([
        {
          isIntersecting: true,
          target: document.createElement('div'),
        } as IntersectionObserverEntry,
      ]);

      await waitFor(() => {
        expect(mockDisconnect).not.toHaveBeenCalled();
      });
    });
  });

  describe('Cleanup', () => {
    it('should disconnect observer on unmount', () => {
      const TestComponent = () => <div>Lazy content</div>;

      const { unmount } = render(
        <LazySection>
          <TestComponent />
        </LazySection>
      );

      unmount();

      expect(mockDisconnect).toHaveBeenCalled();
    });
  });
});

describe('useIntersectionObserver', () => {
  it('should return correct initial state', () => {
    let hookResult: any;

    function TestComponent() {
      hookResult = useIntersectionObserver();
      return <div ref={hookResult.ref}>Test</div>;
    }

    render(<TestComponent />);

    expect(hookResult.isVisible).toBe(false);
    expect(hookResult.hasTriggered).toBe(false);
    expect(hookResult.ref).toBeDefined();
  });

  it('should update state when element becomes visible', async () => {
    let intersectionCallback: (entries: IntersectionObserverEntry[]) => void;
    let hookResult: any;

    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionCallback = callback;
      return {
        observe: mockObserve,
        unobserve: mockUnobserve,
        disconnect: mockDisconnect,
      };
    });

    function TestComponent() {
      hookResult = useIntersectionObserver();
      return <div ref={hookResult.ref}>Test</div>;
    }

    render(<TestComponent />);

    expect(hookResult.isVisible).toBe(false);

    // Simulate intersection
    intersectionCallback!([
      {
        isIntersecting: true,
        target: document.createElement('div'),
      } as IntersectionObserverEntry,
    ]);

    await waitFor(() => {
      expect(hookResult.isVisible).toBe(true);
      expect(hookResult.hasTriggered).toBe(true);
    });
  });

  it('should handle custom options', () => {
    function TestComponent() {
      const result = useIntersectionObserver({
        rootMargin: '50px',
        threshold: 0.25,
        triggerOnce: false,
      });
      return <div ref={result.ref}>Test</div>;
    }

    render(<TestComponent />);

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        rootMargin: '50px',
        threshold: 0.25,
      }
    );
  });
});