'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import PixelButton from '@/components/shared/ui/PixelButton';

interface PixelArtNameProps {
  className?: string;
}

export function PixelArtName({ className }: PixelArtNameProps) {
  const fullName = "CASPIAN ALMERUD";
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (currentIndex < fullName.length) {
      const timer = setTimeout(() => {
        setDisplayedText(fullName.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 150); // Type each character after 150ms
      return () => clearTimeout(timer);
    } else {
      // Blink cursor effect after typing is complete
      const cursorTimer = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);
      return () => clearInterval(cursorTimer);
    }
  }, [currentIndex, fullName.length]);

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
      <div className="relative">
        <h1 className="font-pixel text-4xl md:text-6xl lg:text-8xl font-bold text-center tracking-wider">
          <span className="text-white">
            {displayedText}
          </span>
          <span 
            className={cn(
              "text-white transition-opacity duration-100",
              showCursor ? "opacity-100" : "opacity-0"
            )}
          >
            |
          </span>
        </h1>
      </div>
      
      <div className="text-center space-y-4">
        <p className="font-pixel text-lg md:text-xl text-terminal-300 tracking-wide">
          $ whoami
        </p>
        <p className="font-pixel text-sm md:text-base text-terminal-400 tracking-wide">
          generalist_developer@localhost:~$ pwd
        </p>
        <div className="flex justify-center space-x-2 mt-4 mb-6">
          <div className="w-1 h-4 bg-white animate-pulse" />
          <div className="w-1 h-4 bg-terminal-400 animate-pulse delay-150" />
          <div className="w-1 h-4 bg-terminal-600 animate-pulse delay-300" />
        </div>
        
        {/* CTA Buttons */}
        {currentIndex >= fullName.length && (
          <div className="flex flex-col md:flex-row items-center justify-center space-y-3 md:space-y-0 md:space-x-4 mt-8 animate-fade-in">
            <PixelButton href="/projects" variant="primary">
              cd ./projects
            </PixelButton>
            <PixelButton href="/cv" variant="secondary">
              cat cv.json
            </PixelButton>
            <PixelButton href="/contact" variant="outline">
              sudo touch contact.sh
            </PixelButton>
          </div>
        )}
      </div>
    </div>
  );
}