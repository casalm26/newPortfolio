"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PixelLoadingProps {
  variant?: "dots" | "progress" | "spinner" | "glitch";
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

const PixelDots = ({ size }: { size: string }) => {
  const dotSizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  return (
    <div className="flex items-center space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={cn("bg-white", dotSizes[size as keyof typeof dotSizes])}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

const PixelProgress = ({ size }: { size: string }) => {
  const progressWidths = {
    sm: "w-32",
    md: "w-48",
    lg: "w-64",
  };

  const progressHeights = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  return (
    <div
      className={cn(
        "border border-terminal-400 bg-black overflow-hidden",
        progressWidths[size as keyof typeof progressWidths],
        progressHeights[size as keyof typeof progressHeights]
      )}
    >
      <motion.div
        className="h-full bg-white"
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "loop",
        }}
      />
    </div>
  );
};

const PixelSpinner = ({ size }: { size: string }) => {
  const spinnerSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const dotSize = {
    sm: "w-1 h-1",
    md: "w-1.5 h-1.5",
    lg: "w-2 h-2",
  };

  return (
    <div className={cn("relative", spinnerSizes[size as keyof typeof spinnerSizes])}>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <motion.div
          key={i}
          className={cn(
            "absolute bg-white",
            dotSize[size as keyof typeof dotSize]
          )}
          style={{
            top: "50%",
            left: "50%",
            transformOrigin: `${size === "sm" ? "12px" : size === "md" ? "16px" : "24px"} 0px`,
            transform: `rotate(${i * 45}deg) translateX(-50%) translateY(-50%)`,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.125,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

const PixelGlitch = ({ size, text }: { size: string; text?: string }) => {
  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const displayText = text || "LOADING";

  return (
    <div className="relative">
      <motion.div
        className={cn("font-pixel text-white", textSizes[size as keyof typeof textSizes])}
        animate={{
          textShadow: [
            "2px 0 #ff0000, -2px 0 #00ffff",
            "0 0 transparent",
            "-2px 0 #ff0000, 2px 0 #00ffff",
            "0 0 transparent",
          ],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {displayText}
      </motion.div>

      {/* Glitch overlay */}
      <motion.div
        className={cn(
          "absolute inset-0 font-pixel text-terminal-300 overflow-hidden",
          textSizes[size as keyof typeof textSizes]
        )}
        animate={{
          clipPath: [
            "polygon(0 0, 100% 0, 100% 45%, 0 45%)",
            "polygon(0 60%, 100% 60%, 100% 100%, 0 100%)",
            "polygon(0 15%, 100% 15%, 100% 85%, 0 85%)",
            "polygon(0 0, 100% 0, 100% 45%, 0 45%)",
          ],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {displayText}
      </motion.div>
    </div>
  );
};

export default function PixelLoading({
  variant = "dots",
  size = "md",
  text,
  className,
}: PixelLoadingProps) {
  const renderAnimation = () => {
    switch (variant) {
      case "progress":
        return <PixelProgress size={size} />;
      case "spinner":
        return <PixelSpinner size={size} />;
      case "glitch":
        return <PixelGlitch size={size} text={text} />;
      default:
        return <PixelDots size={size} />;
    }
  };

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
      {renderAnimation()}
      {text && variant !== "glitch" && (
        <div className={cn("font-pixel text-terminal-400", {
          "text-xs": size === "sm",
          "text-sm": size === "md",
          "text-base": size === "lg",
        })}>
          {text}
        </div>
      )}
    </div>
  );
}