/**
 * Image optimization utilities for better performance
 */

export interface ResponsiveImageConfig {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  quality?: number;
}

/**
 * Generates optimized image props with responsive sizes
 */
export function getResponsiveImageProps({
  src,
  alt,
  width = 800,
  height = 600,
  priority = false,
  sizes,
  quality = 75,
}: ResponsiveImageConfig) {
  const defaultSizes =
    sizes || "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

  return {
    src,
    alt,
    width,
    height,
    priority,
    sizes: defaultSizes,
    quality,
    loading: priority ? ("eager" as const) : ("lazy" as const),
    placeholder: "blur" as const,
    blurDataURL: generateBlurDataURL(width, height),
  };
}

/**
 * Generates a base64 blur placeholder for images
 */
export function generateBlurDataURL(
  width: number = 200,
  height: number = 200,
): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="a" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#23272a"/>
          <stop offset="100%" stop-color="#1f2378"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#a)"/>
    </svg>
  `;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

/**
 * Common image sizes for different use cases
 */
export const imageSizes = {
  avatar: {
    sm: { width: 32, height: 32 },
    md: { width: 64, height: 64 },
    lg: { width: 128, height: 128 },
  },
  card: {
    sm: { width: 300, height: 200 },
    md: { width: 600, height: 400 },
    lg: { width: 800, height: 600 },
  },
  hero: {
    sm: { width: 640, height: 480 },
    md: { width: 1200, height: 800 },
    lg: { width: 1920, height: 1080 },
  },
  thumbnail: {
    sm: { width: 150, height: 150 },
    md: { width: 300, height: 300 },
    lg: { width: 500, height: 500 },
  },
} as const;

/**
 * Predefined responsive sizes strings for common layouts
 */
export const responsiveSizes = {
  full: "100vw",
  half: "(max-width: 768px) 100vw, 50vw",
  third: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  quarter:
    "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw",
  avatar: "(max-width: 640px) 64px, 128px",
  card: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px",
} as const;

/**
 * Optimizes image loading based on position and context
 */
export function getImageLoadingStrategy(
  isAboveFold: boolean = false,
  isHeroImage: boolean = false,
): { priority: boolean; loading: "eager" | "lazy" } {
  if (isHeroImage || isAboveFold) {
    return { priority: true, loading: "eager" };
  }

  return { priority: false, loading: "lazy" };
}

/**
 * Preloads critical images for better performance
 */
export function preloadImage(src: string, priority: boolean = true): void {
  if (typeof window !== "undefined" && priority) {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = src;
    document.head.appendChild(link);
  }
}

/**
 * Intersection Observer based lazy loading hook
 */
export function createIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {},
): IntersectionObserver | null {
  if (typeof window === "undefined" || !window.IntersectionObserver) {
    return null;
  }

  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: "50px",
    threshold: 0.1,
    ...options,
  };

  return new IntersectionObserver(callback, defaultOptions);
}
