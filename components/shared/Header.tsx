"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import SocialLinks from "@/components/shared/SocialLinks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "@/components/icons/Icons";
import { cn } from "@/lib/utils";

const Header = ({ className }: { className?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navItems = [
    { href: "/", label: "HOME", prefix: "~/" },
    { href: "/projects", label: "PROJECTS", prefix: "./projects" },
    { href: "/blog", label: "BLOG", prefix: "./blog" },
    { href: "/videos", label: "VIDEOS", prefix: "./videos" },
    { href: "/cv", label: "CV", prefix: "./cv" },
    { href: "/contact", label: "CONTACT", prefix: "./contact" },
  ];

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-terminal-400",
          className,
        )}
      >
        <meta
          name="google-site-verification"
          content="vmR3RFjWYvRqjp711FtJsa2vzyHUZ1QUaw_3iVDgrEI"
        />
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-white border border-terminal-400 flex items-center justify-center font-pixel text-black font-bold transition-all duration-150 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-white/20">
                CA
              </div>
              <span className="font-pixel text-lg font-bold text-white group-hover:text-terminal-300 transition-colors">
                $ CASPIAN.DEV
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "font-pixel text-xs px-3 py-2 border transition-all duration-150 group/nav",
                    isActive(item.href)
                      ? "bg-white text-black font-bold border-white"
                      : "bg-transparent text-white border-terminal-400 hover:bg-white hover:text-black hover:font-bold",
                  )}
                >
                  <span
                    className={cn(
                      "mr-1 transition-colors",
                      isActive(item.href)
                        ? "text-black/60"
                        : "text-terminal-400 group-hover/nav:text-black/60",
                    )}
                  >
                    {item.prefix}
                  </span>
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Social links */}
            <div className="hidden md:flex items-center space-x-4">
              <SocialLinks variant="header" size={18} />
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              className="md:hidden font-pixel px-3 py-2 bg-transparent text-white border border-terminal-400 hover:bg-white hover:text-black transition-all duration-150"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation - portaled to body to escape parent stacking contexts */}
      {isOpen &&
        createPortal(
          <nav className="md:hidden fixed inset-x-0 top-[57px] bottom-0 bg-black border-t border-terminal-400 overflow-y-auto z-50">
            <div className="flex flex-col space-y-2 p-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "font-pixel text-sm px-4 py-3 border transition-all duration-75 w-full text-left group/nav",
                    isActive(item.href)
                      ? "bg-white text-black font-bold border-white"
                      : "bg-transparent text-white border-terminal-400 hover:bg-white hover:text-black hover:font-bold",
                  )}
                >
                  <span
                    className={cn(
                      "mr-2 transition-colors",
                      isActive(item.href)
                        ? "text-black/60"
                        : "text-terminal-400 group-hover/nav:text-black/60",
                    )}
                  >
                    {item.prefix}
                  </span>
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col space-y-4 mt-4 pt-4 border-t border-terminal-400">
                <SocialLinks variant="inline" showLabels={true} size={16} />
              </div>
            </div>
          </nav>,
          document.body,
        )}
    </>
  );
};

export default Header;
