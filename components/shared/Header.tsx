"use client";

import { useState } from "react";
import ThemeSwitch from "@/components/shared/ThemeSwitch";
import SearchButton from "@/components/search/SearchButton";
import SocialLinks from "@/components/shared/SocialLinks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVisualFeedback } from "@/lib/visual-feedback";

const Header = ({ className }: { className?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const feedback = useVisualFeedback();

  const navItems = [
    { href: "/", label: "HOME", prefix: "~/" },
    { href: "/projects", label: "PROJECTS", prefix: "./projects" },
    { href: "/games", label: "GAMES", prefix: "./games" },
    { href: "/cv", label: "CV", prefix: "./cv" },
    { href: "/about", label: "ABOUT", prefix: "./about" },
    { href: "/contact", label: "CONTACT", prefix: "./contact" },
  ];

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-terminal-400",
        className,
      )}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 group"
            onClick={() => feedback.click()}
            onMouseEnter={() => feedback.hover()}
          >
            <div className="w-8 h-8 bg-white border border-terminal-400 flex items-center justify-center font-pixel text-black font-bold transition-all duration-150 group-hover:bg-terminal-300 group-hover:border-white group-hover:shadow-[2px_2px_0px_#ffffff] group-hover:translate-x-[-1px] group-hover:translate-y-[-1px]">
              CA
            </div>
            <span className="font-pixel text-lg font-bold text-white group-hover:text-terminal-300 transition-all duration-150 group-hover:drop-shadow-[2px_2px_0px_rgba(255,255,255,0.3)]">
              $ CASPIAN.DEV
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => feedback.click()}
                onMouseEnter={() => feedback.hover()}
                className={cn(
                  "font-pixel text-xs px-3 py-2 border transition-all duration-150 relative overflow-hidden",
                  isActive(item.href)
                    ? "bg-white text-black border-white shadow-[2px_2px_0px_#a1a1aa]"
                    : "bg-transparent text-white border-terminal-400 hover:bg-white hover:text-black hover:border-white hover:shadow-[2px_2px_0px_#a1a1aa] hover:translate-x-[-1px] hover:translate-y-[-1px]",
                )}
              >
                <span className="mr-1 text-terminal-400">{item.prefix}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Utility buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <SocialLinks variant="header" size={18} />
            <div className="w-px h-6 bg-terminal-400"></div>
            <SearchButton />
            <ThemeSwitch />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => {
              setIsOpen(!isOpen);
              feedback.click();
            }}
            onMouseEnter={() => feedback.hover()}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className="md:hidden font-pixel px-3 py-2 bg-transparent text-white border border-terminal-400 hover:bg-white hover:text-black hover:border-white hover:shadow-[2px_2px_0px_#a1a1aa] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-150"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-terminal-400 pt-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    setIsOpen(false);
                    feedback.click();
                  }}
                  onMouseEnter={() => feedback.hover()}
                  className={cn(
                    "font-pixel text-sm px-4 py-3 border transition-all duration-150 w-full text-left",
                    isActive(item.href)
                      ? "bg-white text-black border-white shadow-[2px_2px_0px_#a1a1aa]"
                      : "bg-transparent text-white border-terminal-400 hover:bg-white hover:text-black hover:border-white hover:shadow-[2px_2px_0px_#a1a1aa] hover:translate-x-[-1px] hover:translate-y-[-1px]",
                  )}
                >
                  <span className="mr-2 text-terminal-400">{item.prefix}</span>
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col space-y-4 mt-4 pt-4 border-t border-terminal-400">
                <SocialLinks variant="inline" showLabels={true} size={16} />
                <div className="flex items-center space-x-2">
                  <SearchButton />
                  <ThemeSwitch />
                </div>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
