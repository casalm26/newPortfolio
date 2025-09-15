'use client';

import { GitHubPixelIcon, LinkedInPixelIcon, TwitterPixelIcon, EmailPixelIcon } from '@/components/icons/PixelSocialIcons';

interface SocialLink {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  color: string;
}

const socialLinks: SocialLink[] = [
  {
    href: 'https://github.com/caspianalmerud',
    label: 'GitHub',
    icon: GitHubPixelIcon,
    color: 'hover:text-gray-400',
  },
  {
    href: 'https://linkedin.com/in/caspian-almerud',
    label: 'LinkedIn',
    icon: LinkedInPixelIcon,
    color: 'hover:text-blue-400',
  },
  {
    href: 'https://twitter.com/caspianalmerud',
    label: 'X (Twitter)',
    icon: TwitterPixelIcon,
    color: 'hover:text-cyan-400',
  },
  {
    href: 'mailto:hello@caspian.dev',
    label: 'Email',
    icon: EmailPixelIcon,
    color: 'hover:text-green-400',
  },
];

interface SocialLinksProps {
  variant?: 'header' | 'footer' | 'inline';
  showLabels?: boolean;
  size?: number;
  className?: string;
}

export default function SocialLinks({ 
  variant = 'header', 
  showLabels = false, 
  size = 20,
  className = '' 
}: SocialLinksProps) {
  const baseClasses = 'transition-colors duration-200';
  
  const variantClasses = {
    header: 'flex items-center space-x-3',
    footer: 'flex items-center justify-center space-x-4',
    inline: 'inline-flex items-center space-x-3',
  };

  return (
    <div className={`${variantClasses[variant]} ${className}`}>
      {socialLinks.map((link) => {
        const IconComponent = link.icon;
        return (
          <a
            key={link.href}
            href={link.href}
            target={link.href.startsWith('mailto') ? undefined : '_blank'}
            rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
            aria-label={link.label}
            className={`${baseClasses} text-terminal-300 ${link.color} pixel-perfect group`}
            title={link.label}
          >
            <IconComponent size={size} className="pixel-art" />
            {showLabels && (
              <span className="font-pixel text-xs ml-2 group-hover:text-white transition-colors">
                {link.label}
              </span>
            )}
          </a>
        );
      })}
    </div>
  );
}