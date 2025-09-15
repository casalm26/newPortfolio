'use client';

import SocialLinks from '@/components/shared/SocialLinks';
import Link from 'next/link';

const PersonalFooter = ({ className = '' }: { className?: string }) => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    quick: [
      { href: '/', label: 'Home' },
      { href: '/about', label: 'About' },
      { href: '/projects', label: 'Projects' },
      { href: '/cv', label: 'CV Timeline' },
      { href: '/contact', label: 'Contact' },
    ],
    legal: [
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
    ],
  };

  return (
    <footer className={`bg-black border-t border-terminal-400 ${className}`}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Branding Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white border border-terminal-400 flex items-center justify-center font-pixel text-black font-bold">
                CA
              </div>
              <span className="font-pixel text-lg font-bold text-white">
                CASPIAN.DEV
              </span>
            </div>
            <div className="font-pixel text-xs text-terminal-400 max-w-sm">
              &gt; whoami --role<br/>
              Generalist developer bridging technical expertise with creative problem-solving.
            </div>
            <div className="font-pixel text-xs text-terminal-300">
              Status: <span className="text-green-400">AVAILABLE_FOR_HIRE</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-6">
            <div>
              <h3 className="font-pixel text-xs text-terminal-400 mb-4 uppercase tracking-wider">
                &gt; ls navigation/
              </h3>
              <div className="space-y-2">
                {footerLinks.quick.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block font-pixel text-xs text-terminal-300 hover:text-white transition-colors"
                  >
                    → {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Connect Section */}
          <div className="space-y-6">
            <div>
              <h3 className="font-pixel text-xs text-terminal-400 mb-4 uppercase tracking-wider">
                &gt; cat social_links.json
              </h3>
              <SocialLinks variant="footer" showLabels={false} size={20} />
            </div>
            
            <div className="space-y-2">
              <div className="font-pixel text-xs text-terminal-300">
                <span className="text-terminal-500">email:</span> hello@caspian.dev
              </div>
              <div className="font-pixel text-xs text-terminal-300">
                <span className="text-terminal-500">timezone:</span> UTC+0
              </div>
              <div className="font-pixel text-xs text-terminal-300">
                <span className="text-terminal-500">response_time:</span> &lt; 24h
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-terminal-500">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="font-pixel text-xs text-terminal-500">
              © {currentYear} Caspian Almerud. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-4">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-pixel text-xs text-terminal-500 hover:text-terminal-300 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            
            <div className="font-pixel text-xs text-terminal-500">
              &gt; exit 0
            </div>
          </div>
        </div>

        {/* Easter Egg */}
        <div className="mt-8 text-center">
          <div className="font-pixel text-xs text-terminal-600 hover:text-terminal-400 transition-colors cursor-default">
            Made with ☕ and endless curiosity
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PersonalFooter;