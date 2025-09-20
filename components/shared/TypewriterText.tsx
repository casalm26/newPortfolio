"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface TypewriterTextProps {
  text: string | string[];
  speed?: number;
  delay?: number;
  loop?: boolean;
  cursor?: boolean;
  cursorChar?: string;
  className?: string;
  onComplete?: () => void;
  eraseSpeed?: number;
  pauseDuration?: number;
}

export default function TypewriterText({
  text,
  speed = 100,
  delay = 0,
  loop = false,
  cursor = true,
  cursorChar = "_",
  className,
  onComplete,
  eraseSpeed = 50,
  pauseDuration = 1000,
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [arrayIndex, setArrayIndex] = useState(0);

  const texts = Array.isArray(text) ? text : [text];
  const currentText = texts[arrayIndex];
  const timeoutRef = useRef<NodeJS.Timeout>();
  const intervalRef = useRef<NodeJS.Timeout>();

  // Cursor blinking effect
  useEffect(() => {
    if (cursor) {
      const interval = setInterval(() => {
        setShowCursor((prev) => !prev);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [cursor]);

  // Main typewriter effect
  useEffect(() => {
    const startTyping = () => {
      setIsTyping(true);

      const typeChar = () => {
        if (currentIndex < currentText.length) {
          setDisplayText(currentText.slice(0, currentIndex + 1));
          setCurrentIndex((prev) => prev + 1);
        } else {
          setIsTyping(false);

          if (onComplete) {
            onComplete();
          }

          // Handle multiple texts or looping
          if (texts.length > 1 || loop) {
            timeoutRef.current = setTimeout(() => {
              // Start erasing
              const eraseText = () => {
                if (displayText.length > 0) {
                  setDisplayText((prev) => prev.slice(0, -1));
                } else {
                  // Move to next text or restart
                  if (texts.length > 1) {
                    setArrayIndex((prev) => (prev + 1) % texts.length);
                  }
                  setCurrentIndex(0);
                  clearInterval(intervalRef.current);
                }
              };

              intervalRef.current = setInterval(eraseText, eraseSpeed);
            }, pauseDuration);
          }
        }
      };

      intervalRef.current = setInterval(typeChar, speed);
    };

    // Initial delay before starting
    timeoutRef.current = setTimeout(startTyping, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentText, currentIndex, speed, delay, onComplete, eraseSpeed, pauseDuration, texts.length, loop, displayText.length]);

  // Reset when text array changes
  useEffect(() => {
    setDisplayText("");
    setCurrentIndex(0);
  }, [arrayIndex]);

  return (
    <span className={cn("font-pixel", className)}>
      {displayText}
      {cursor && (
        <span
          className={cn(
            "inline-block transition-opacity duration-75",
            showCursor ? "opacity-100" : "opacity-0"
          )}
        >
          {cursorChar}
        </span>
      )}
    </span>
  );
}

// Terminal-style typewriter with command prompt
interface TerminalTypewriterProps {
  commands: string[];
  prompt?: string;
  speed?: number;
  className?: string;
}

export function TerminalTypewriter({
  commands,
  prompt = "caspian@localhost:~$",
  speed = 80,
  className,
}: TerminalTypewriterProps) {
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);

  const handleCommandComplete = () => {
    setCompleted((prev) => [...prev, commands[currentCommandIndex]]);

    if (currentCommandIndex < commands.length - 1) {
      setTimeout(() => {
        setCurrentCommandIndex((prev) => prev + 1);
      }, 500);
    }
  };

  return (
    <div className={cn("font-mono text-sm space-y-2", className)}>
      {/* Completed commands */}
      {completed.map((command, index) => (
        <div key={index} className="text-terminal-300">
          <span className="text-green-400">{prompt}</span>
          <span className="text-white ml-1">{command}</span>
        </div>
      ))}

      {/* Current typing command */}
      {currentCommandIndex < commands.length && (
        <div className="text-terminal-300">
          <span className="text-green-400">{prompt}</span>
          <span className="text-white ml-1">
            <TypewriterText
              text={commands[currentCommandIndex]}
              speed={speed}
              onComplete={handleCommandComplete}
            />
          </span>
        </div>
      )}
    </div>
  );
}

// Matrix-style digital rain typewriter
interface MatrixTypewriterProps {
  text: string;
  speed?: number;
  glitchProbability?: number;
  className?: string;
}

export function MatrixTypewriter({
  text,
  speed = 150,
  glitchProbability = 0.1,
  className,
}: MatrixTypewriterProps) {
  const [displayChars, setDisplayChars] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        const char = text[currentIndex];

        // Add glitch effect
        if (Math.random() < glitchProbability && char !== " ") {
          const glitchChar = matrixChars[Math.floor(Math.random() * matrixChars.length)];
          setDisplayChars((prev) => [...prev, glitchChar]);

          // Replace with correct character after brief delay
          setTimeout(() => {
            setDisplayChars((prev) => {
              const newChars = [...prev];
              newChars[newChars.length - 1] = char;
              return newChars;
            });
          }, 100);
        } else {
          setDisplayChars((prev) => [...prev, char]);
        }

        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed, glitchProbability]);

  return (
    <span className={cn("font-mono text-green-400", className)}>
      {displayChars.map((char, index) => (
        <span
          key={index}
          className={cn(
            "inline-block",
            char === " " ? "w-2" : "",
            // Add slight flicker to some characters
            Math.random() < 0.05 ? "animate-pulse" : ""
          )}
          style={{
            textShadow: char !== " " ? "0 0 5px currentColor" : undefined,
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}