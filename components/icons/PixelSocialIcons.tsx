"use client";

interface IconProps {
  className?: string;
  size?: number;
}

export const GitHubPixelIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={`pixel-perfect ${className}`}
    style={{ imageRendering: "pixelated" }}
    role="img"
    aria-label="GitHub"
  >
    <rect x="6" y="2" width="12" height="2" fill="currentColor" />
    <rect x="4" y="4" width="2" height="2" fill="currentColor" />
    <rect x="18" y="4" width="2" height="2" fill="currentColor" />
    <rect x="2" y="6" width="2" height="4" fill="currentColor" />
    <rect x="20" y="6" width="2" height="4" fill="currentColor" />
    <rect x="2" y="10" width="2" height="2" fill="currentColor" />
    <rect x="20" y="10" width="2" height="2" fill="currentColor" />
    <rect x="4" y="12" width="2" height="2" fill="currentColor" />
    <rect x="18" y="12" width="2" height="2" fill="currentColor" />
    <rect x="6" y="14" width="2" height="2" fill="currentColor" />
    <rect x="16" y="14" width="2" height="2" fill="currentColor" />
    <rect x="8" y="16" width="2" height="2" fill="currentColor" />
    <rect x="14" y="16" width="2" height="2" fill="currentColor" />
    <rect x="10" y="18" width="4" height="2" fill="currentColor" />
    <rect x="6" y="20" width="2" height="2" fill="currentColor" />
    <rect x="16" y="20" width="2" height="2" fill="currentColor" />
  </svg>
);

export const LinkedInPixelIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={`pixel-perfect ${className}`}
    style={{ imageRendering: "pixelated" }}
    role="img"
    aria-label="LinkedIn"
  >
    <rect x="2" y="2" width="20" height="2" fill="currentColor" />
    <rect x="2" y="4" width="2" height="16" fill="currentColor" />
    <rect x="20" y="4" width="2" height="16" fill="currentColor" />
    <rect x="2" y="20" width="20" height="2" fill="currentColor" />

    {/* Profile square */}
    <rect x="6" y="6" width="4" height="4" fill="currentColor" />

    {/* Contact line */}
    <rect x="6" y="12" width="4" height="2" fill="currentColor" />
    <rect x="6" y="16" width="4" height="2" fill="currentColor" />

    {/* Experience bars */}
    <rect x="12" y="8" width="6" height="2" fill="currentColor" />
    <rect x="12" y="12" width="8" height="2" fill="currentColor" />
    <rect x="12" y="16" width="4" height="2" fill="currentColor" />
  </svg>
);

export const TwitterPixelIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={`pixel-perfect ${className}`}
    style={{ imageRendering: "pixelated" }}
    role="img"
    aria-label="X (Twitter)"
  >
    <rect x="6" y="4" width="2" height="2" fill="currentColor" />
    <rect x="4" y="6" width="2" height="2" fill="currentColor" />
    <rect x="8" y="6" width="6" height="2" fill="currentColor" />
    <rect x="16" y="6" width="2" height="2" fill="currentColor" />
    <rect x="2" y="8" width="2" height="2" fill="currentColor" />
    <rect x="6" y="8" width="12" height="2" fill="currentColor" />
    <rect x="20" y="8" width="2" height="2" fill="currentColor" />
    <rect x="4" y="10" width="16" height="2" fill="currentColor" />
    <rect x="6" y="12" width="12" height="2" fill="currentColor" />
    <rect x="8" y="14" width="8" height="2" fill="currentColor" />
    <rect x="10" y="16" width="4" height="2" fill="currentColor" />
  </svg>
);

export const EmailPixelIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={`pixel-perfect ${className}`}
    style={{ imageRendering: "pixelated" }}
    role="img"
    aria-label="Email"
  >
    <rect x="2" y="6" width="20" height="2" fill="currentColor" />
    <rect x="2" y="8" width="2" height="8" fill="currentColor" />
    <rect x="20" y="8" width="2" height="8" fill="currentColor" />
    <rect x="4" y="10" width="2" height="2" fill="currentColor" />
    <rect x="18" y="10" width="2" height="2" fill="currentColor" />
    <rect x="6" y="12" width="2" height="2" fill="currentColor" />
    <rect x="16" y="12" width="2" height="2" fill="currentColor" />
    <rect x="8" y="14" width="2" height="2" fill="currentColor" />
    <rect x="14" y="14" width="2" height="2" fill="currentColor" />
    <rect x="10" y="16" width="4" height="2" fill="currentColor" />
    <rect x="2" y="16" width="20" height="2" fill="currentColor" />
  </svg>
);

export const WebsitePixelIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={`pixel-perfect ${className}`}
    style={{ imageRendering: "pixelated" }}
    role="img"
    aria-label="Website"
  >
    {/* Globe outline */}
    <rect x="8" y="2" width="8" height="2" fill="currentColor" />
    <rect x="6" y="4" width="2" height="2" fill="currentColor" />
    <rect x="16" y="4" width="2" height="2" fill="currentColor" />
    <rect x="4" y="6" width="2" height="12" fill="currentColor" />
    <rect x="18" y="6" width="2" height="12" fill="currentColor" />
    <rect x="6" y="18" width="2" height="2" fill="currentColor" />
    <rect x="16" y="18" width="2" height="2" fill="currentColor" />
    <rect x="8" y="20" width="8" height="2" fill="currentColor" />

    {/* Center line */}
    <rect x="11" y="4" width="2" height="16" fill="currentColor" />

    {/* Horizontal lines */}
    <rect x="6" y="8" width="12" height="2" fill="currentColor" />
    <rect x="6" y="14" width="12" height="2" fill="currentColor" />

    {/* Curved lines */}
    <rect x="8" y="6" width="2" height="2" fill="currentColor" />
    <rect x="14" y="6" width="2" height="2" fill="currentColor" />
    <rect x="8" y="16" width="2" height="2" fill="currentColor" />
    <rect x="14" y="16" width="2" height="2" fill="currentColor" />
  </svg>
);
