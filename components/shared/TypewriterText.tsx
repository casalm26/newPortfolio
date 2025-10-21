"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useAnimation } from "./AnimationProvider";

interface TypewriterTextProps {
  text: string | string[];
  speed?: number;
  delay?: number;
  loop?: boolean;
  cursor?: boolean;
  cursorChar?: string;
  onComplete?: () => void;
  className?: string;
}

export function TypewriterText({
  text,
  speed = 100,
  delay = 0,
  loop = false,
  cursor = true,
  cursorChar = "|",
  onComplete,
  className = "",
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentStringIndex, setCurrentStringIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const { enableAnimations } = useAnimation();

  const textArray = useMemo(() => {
    return Array.isArray(text) ? text : [text];
  }, [text]);
  const currentString = textArray[currentStringIndex];

  useEffect(() => {
    if (!enableAnimations) {
      setDisplayText(textArray.join(" "));
      return;
    }

    const timer = setTimeout(
      () => {
        if (!isDeleting) {
          // Typing
          if (currentIndex < currentString.length) {
            setDisplayText(currentString.slice(0, currentIndex + 1));
            setCurrentIndex(currentIndex + 1);
          } else {
            // Finished typing current string
            if (textArray.length > 1 && loop) {
              // Wait before starting to delete
              setTimeout(() => setIsDeleting(true), 1000);
            } else {
              onComplete?.();
            }
          }
        } else {
          // Deleting
          if (currentIndex > 0) {
            setDisplayText(currentString.slice(0, currentIndex - 1));
            setCurrentIndex(currentIndex - 1);
          } else {
            // Finished deleting, move to next string
            setIsDeleting(false);
            setCurrentStringIndex((prev) => (prev + 1) % textArray.length);
          }
        }
      },
      delay + (isDeleting ? speed / 2 : speed),
    );

    return () => clearTimeout(timer);
  }, [
    currentIndex,
    currentString,
    currentStringIndex,
    delay,
    enableAnimations,
    isDeleting,
    loop,
    onComplete,
    speed,
    textArray,
  ]);

  // Cursor blinking effect
  useEffect(() => {
    if (!cursor || !enableAnimations) return;

    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => clearInterval(cursorTimer);
  }, [cursor, enableAnimations]);

  return (
    <span className={`font-pixel ${className}`}>
      {displayText}
      {cursor && enableAnimations && (
        <span
          className={`inline-block transition-opacity duration-100 ${
            showCursor ? "opacity-100" : "opacity-0"
          }`}
        >
          {cursorChar}
        </span>
      )}
    </span>
  );
}
