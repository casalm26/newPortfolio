import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getResponsiveImageProps,
  generateBlurDataURL,
  getImageLoadingStrategy,
  preloadImage,
  createIntersectionObserver,
  imageSizes,
  responsiveSizes,
} from './image-utils';

describe('Image Utils', () => {
  describe('getResponsiveImageProps', () => {
    it('should return default props with minimal config', () => {
      const props = getResponsiveImageProps({
        src: '/test.jpg',
        alt: 'Test image',
      });

      expect(props).toEqual({
        src: '/test.jpg',
        alt: 'Test image',
        width: 800,
        height: 600,
        priority: false,
        sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
        quality: 75,
        loading: 'lazy',
        placeholder: 'blur',
        blurDataURL: expect.stringContaining('data:image/svg+xml;base64,'),
      });
    });

    it('should override defaults with custom config', () => {
      const props = getResponsiveImageProps({
        src: '/hero.jpg',
        alt: 'Hero image',
        width: 1200,
        height: 800,
        priority: true,
        quality: 90,
        sizes: '100vw',
      });

      expect(props.width).toBe(1200);
      expect(props.height).toBe(800);
      expect(props.priority).toBe(true);
      expect(props.quality).toBe(90);
      expect(props.sizes).toBe('100vw');
      expect(props.loading).toBe('eager');
    });
  });

  describe('generateBlurDataURL', () => {
    it('should generate a valid base64 data URL', () => {
      const blurURL = generateBlurDataURL(200, 200);

      expect(blurURL).toMatch(/^data:image\/svg\+xml;base64,/);
      expect(blurURL.length).toBeGreaterThan(100);
    });

    it('should handle custom dimensions', () => {
      const blurURL = generateBlurDataURL(400, 300);

      expect(blurURL).toContain('base64,');
      const decoded = Buffer.from(blurURL.split(',')[1], 'base64').toString();
      expect(decoded).toContain('width="400"');
      expect(decoded).toContain('height="300"');
    });

    it('should use default dimensions when not provided', () => {
      const blurURL = generateBlurDataURL();

      const decoded = Buffer.from(blurURL.split(',')[1], 'base64').toString();
      expect(decoded).toContain('width="200"');
      expect(decoded).toContain('height="200"');
    });
  });

  describe('getImageLoadingStrategy', () => {
    it('should return eager loading for above fold images', () => {
      const strategy = getImageLoadingStrategy(true, false);

      expect(strategy).toEqual({
        priority: true,
        loading: 'eager',
      });
    });

    it('should return eager loading for hero images', () => {
      const strategy = getImageLoadingStrategy(false, true);

      expect(strategy).toEqual({
        priority: true,
        loading: 'eager',
      });
    });

    it('should return lazy loading for below fold images', () => {
      const strategy = getImageLoadingStrategy(false, false);

      expect(strategy).toEqual({
        priority: false,
        loading: 'lazy',
      });
    });
  });

  describe('preloadImage', () => {
    beforeEach(() => {
      // Mock DOM
      global.document = {
        createElement: vi.fn(() => ({
          rel: '',
          as: '',
          href: '',
        })),
        head: {
          appendChild: vi.fn(),
        },
      } as any;

      global.window = {} as any;
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it('should create and append preload link for priority images', () => {
      const mockLink = { rel: '', as: '', href: '' };
      const createElement = vi.fn(() => mockLink);
      const appendChild = vi.fn();

      global.document.createElement = createElement;
      global.document.head.appendChild = appendChild;

      preloadImage('/test.jpg', true);

      expect(createElement).toHaveBeenCalledWith('link');
      expect(mockLink.rel).toBe('preload');
      expect(mockLink.as).toBe('image');
      expect(mockLink.href).toBe('/test.jpg');
      expect(appendChild).toHaveBeenCalledWith(mockLink);
    });

    it('should not preload non-priority images', () => {
      const appendChild = vi.fn();
      global.document.head.appendChild = appendChild;

      preloadImage('/test.jpg', false);

      expect(appendChild).not.toHaveBeenCalled();
    });
  });

  describe('createIntersectionObserver', () => {
    beforeEach(() => {
      global.window = {
        IntersectionObserver: vi.fn((callback, options) => ({
          observe: vi.fn(),
          unobserve: vi.fn(),
          disconnect: vi.fn(),
        })),
      } as any;
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it('should create IntersectionObserver with default options', () => {
      const callback = vi.fn();
      const observer = createIntersectionObserver(callback);

      expect(observer).toBeDefined();
      expect(global.window.IntersectionObserver).toHaveBeenCalledWith(
        callback,
        {
          root: null,
          rootMargin: '50px',
          threshold: 0.1,
        }
      );
    });

    it('should merge custom options with defaults', () => {
      const callback = vi.fn();
      const customOptions = { threshold: 0.5, rootMargin: '100px' };

      createIntersectionObserver(callback, customOptions);

      expect(global.window.IntersectionObserver).toHaveBeenCalledWith(
        callback,
        {
          root: null,
          rootMargin: '100px',
          threshold: 0.5,
        }
      );
    });

    it('should return null if IntersectionObserver is not supported', () => {
      global.window = {} as any;

      const observer = createIntersectionObserver(vi.fn());

      expect(observer).toBeNull();
    });

    it('should return null in server environment', () => {
      global.window = undefined as any;

      const observer = createIntersectionObserver(vi.fn());

      expect(observer).toBeNull();
    });
  });

  describe('imageSizes constants', () => {
    it('should provide predefined image sizes', () => {
      expect(imageSizes.avatar.sm).toEqual({ width: 32, height: 32 });
      expect(imageSizes.avatar.md).toEqual({ width: 64, height: 64 });
      expect(imageSizes.avatar.lg).toEqual({ width: 128, height: 128 });

      expect(imageSizes.card.sm).toEqual({ width: 300, height: 200 });
      expect(imageSizes.hero.lg).toEqual({ width: 1920, height: 1080 });
    });
  });

  describe('responsiveSizes constants', () => {
    it('should provide predefined responsive size strings', () => {
      expect(responsiveSizes.full).toBe('100vw');
      expect(responsiveSizes.half).toBe('(max-width: 768px) 100vw, 50vw');
      expect(responsiveSizes.third).toBe('(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw');
    });
  });
});