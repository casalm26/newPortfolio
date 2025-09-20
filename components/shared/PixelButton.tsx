"use client";

import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useVisualFeedback } from "@/lib/visual-feedback";

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  effect?: "press" | "bounce" | "glitch" | "glow";
  children: React.ReactNode;
  className?: string;
}

const PixelButton = forwardRef<HTMLButtonElement, PixelButtonProps>(
  ({ variant = "primary", size = "md", effect = "press", children, className, onClick, onMouseEnter, ...props }, ref) => {
    const [isPressed, setIsPressed] = useState(false);
    const feedback = useVisualFeedback();

    const variants = {
      primary: {
        base: "bg-white text-black border-white",
        hover: "hover:bg-terminal-200 hover:text-black",
        shadow: "shadow-[4px_4px_0px_#a1a1aa]",
        pressedShadow: "shadow-[2px_2px_0px_#a1a1aa]",
      },
      secondary: {
        base: "bg-transparent text-white border-terminal-400",
        hover: "hover:bg-white hover:text-black hover:border-white",
        shadow: "shadow-[4px_4px_0px_#27272a]",
        pressedShadow: "shadow-[2px_2px_0px_#27272a]",
      },
      accent: {
        base: "bg-green-400 text-black border-green-400",
        hover: "hover:bg-green-300 hover:border-green-300",
        shadow: "shadow-[4px_4px_0px_#15803d]",
        pressedShadow: "shadow-[2px_2px_0px_#15803d]",
      },
      danger: {
        base: "bg-red-500 text-white border-red-500",
        hover: "hover:bg-red-400 hover:border-red-400",
        shadow: "shadow-[4px_4px_0px_#991b1b]",
        pressedShadow: "shadow-[2px_2px_0px_#991b1b]",
      },
      success: {
        base: "bg-blue-500 text-white border-blue-500",
        hover: "hover:bg-blue-400 hover:border-blue-400",
        shadow: "shadow-[4px_4px_0px_#1d4ed8]",
        pressedShadow: "shadow-[2px_2px_0px_#1d4ed8]",
      },
    };

    const sizes = {
      sm: "px-3 py-2 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };

    const currentVariant = variants[variant];

    const getEffectClasses = () => {
      const baseClasses = "transition-all duration-150 font-pixel border-2";

      switch (effect) {
        case "bounce":
          return cn(
            baseClasses,
            "hover:animate-bounce active:animate-none",
            currentVariant.shadow,
            isPressed ? currentVariant.pressedShadow : ""
          );
        case "glitch":
          return cn(
            baseClasses,
            "hover:animate-pulse",
            currentVariant.shadow,
            isPressed ? "transform translate-x-1 translate-y-1" : "hover:translate-x-[-2px] hover:translate-y-[-2px]"
          );
        case "glow":
          return cn(
            baseClasses,
            "hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]",
            currentVariant.shadow,
            isPressed ? currentVariant.pressedShadow : ""
          );
        default: // press
          return cn(
            baseClasses,
            currentVariant.shadow,
            isPressed
              ? `${currentVariant.pressedShadow} translate-x-[2px] translate-y-[2px]`
              : "hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#a1a1aa]"
          );
      }
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Trigger visual feedback based on variant
      const feedbackType = variant === 'danger' ? 'error' : variant === 'success' ? 'success' : variant === 'accent' ? 'complete' : 'click';
      feedback.trigger(feedbackType);

      if (onClick) {
        onClick(e);
      }
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      feedback.hover();

      if (onMouseEnter) {
        onMouseEnter(e);
      }
    };

    const handleMouseDown = () => {
      setIsPressed(true);
    };

    const handleMouseUp = () => {
      setIsPressed(false);
    };

    const handleMouseLeave = () => {
      setIsPressed(false);
    };

    return (
      <button
        ref={ref}
        className={cn(
          currentVariant.base,
          currentVariant.hover,
          sizes[size],
          getEffectClasses(),
          "relative overflow-hidden",
          // Pixel-perfect rendering
          "image-rendering-pixelated select-none",
          className
        )}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{
          imageRendering: "pixelated",
        }}
        {...props}
      >
        {/* Scanline effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent opacity-20 pointer-events-none" />

        {/* Content */}
        <span className="relative z-10 block">
          {children}
        </span>

        {/* Glitch effect for glitch variant */}
        {effect === "glitch" && (
          <span
            className="absolute inset-0 z-0 block opacity-30 text-red-500"
            style={{
              clipPath: isPressed ? "polygon(0 0, 100% 0, 100% 50%, 0 50%)" : "polygon(0 0, 0 0, 0 100%, 0 100%)",
              transform: "translateX(2px)",
            }}
          >
            {children}
          </span>
        )}
      </button>
    );
  }
);

PixelButton.displayName = "PixelButton";

export default PixelButton;

// Icon button variant
interface PixelIconButtonProps extends Omit<PixelButtonProps, 'children'> {
  icon: React.ReactNode;
  label?: string;
}

export function PixelIconButton({ icon, label, ...props }: PixelIconButtonProps) {
  return (
    <PixelButton
      {...props}
      className={cn("!p-2 aspect-square flex items-center justify-center", props.className)}
      title={label}
    >
      {icon}
    </PixelButton>
  );
}

// Toggle button variant
interface PixelToggleButtonProps extends PixelButtonProps {
  isToggled: boolean;
  onToggle: (toggled: boolean) => void;
}

export function PixelToggleButton({
  isToggled,
  onToggle,
  children,
  className,
  ...props
}: PixelToggleButtonProps) {
  return (
    <PixelButton
      {...props}
      className={cn(
        isToggled ? "bg-green-400 text-black border-green-400" : "",
        className
      )}
      onClick={() => onToggle(!isToggled)}
    >
      {children}
    </PixelButton>
  );
}

// Loading button variant
interface PixelLoadingButtonProps extends PixelButtonProps {
  isLoading: boolean;
  loadingText?: string;
}

export function PixelLoadingButton({
  isLoading,
  loadingText = "LOADING...",
  children,
  disabled,
  ...props
}: PixelLoadingButtonProps) {
  return (
    <PixelButton
      {...props}
      disabled={disabled || isLoading}
      className={cn(isLoading ? "cursor-not-allowed opacity-75" : "", props.className)}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="animate-spin">⏳</span>
          {loadingText}
        </span>
      ) : (
        children
      )}
    </PixelButton>
  );
}