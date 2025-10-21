"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import PixelButton from "@/components/shared/ui/PixelButton";

interface PixelArtNameProps {
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}

export function PixelArtName({
  className,
  "aria-hidden": ariaHidden,
}: PixelArtNameProps) {
  const fullName = "CASPIAN ALMERUD";
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [animationSkipped, setAnimationSkipped] = useState(false);

  useEffect(() => {
    if (animationSkipped) {
      setDisplayedText(fullName);
      setCurrentIndex(fullName.length);
      return;
    }

    if (currentIndex < fullName.length) {
      const timer = setTimeout(
        () => {
          setDisplayedText(fullName.slice(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);
        },
        currentIndex === 0 ? 500 : 150,
      );

      return () => clearTimeout(timer);
    }

    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorTimer);
  }, [currentIndex, animationSkipped, fullName]);

  const skipAnimation = () => {
    setAnimationSkipped(true);
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center space-y-4",
        className,
      )}
    >
      {currentIndex < fullName.length && !animationSkipped && (
        <button
          onClick={skipAnimation}
          className={cn(
            "btn-pixel-3d absolute top-4 right-4 font-pixel text-xs px-3 py-2",
            "bg-transparent text-terminal-400 border-terminal-400 z-[60]",
          )}
          aria-label="Skip typewriter animation"
        >
          SKIP &gt;&gt;
        </button>
      )}

      <div className="relative">
        <div
          className="font-pixel text-4xl md:text-6xl lg:text-8xl font-bold text-center tracking-wider"
          aria-hidden={ariaHidden}
          aria-live={!ariaHidden ? "polite" : undefined}
        >
          <span className="text-white">{displayedText}</span>
          <span
            className={cn(
              "text-white transition-opacity duration-100",
              showCursor ? "opacity-100" : "opacity-0",
            )}
            aria-hidden="true"
          >
            |
          </span>
        </div>
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

        {(currentIndex >= fullName.length || animationSkipped) && (
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
