"use client";

import React from "react";

interface PixelLoaderProps {
  size?: "sm" | "md" | "lg";
  type?: "dots" | "bars" | "spinner" | "typewriter";
  text?: string;
  className?: string;
}

export function PixelLoader({
  size = "md",
  type = "dots",
  text = "Loading...",
  className = "",
}: PixelLoaderProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const renderDots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${sizeClasses[size]} bg-current animate-pixel-loading border border-current`}
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );

  const renderBars = () => (
    <div className="flex space-x-1 items-end">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`w-1 bg-current animate-pixel-loading border border-current`}
          style={{
            height: `${12 + (i % 3) * 8}px`,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );

  const renderSpinner = () => (
    <div
      className={`${sizeClasses[size]} border-2 border-current border-t-transparent animate-spin`}
      style={{ borderRadius: "2px" }}
    />
  );

  const renderTypewriter = () => (
    <div className="flex items-center space-x-2">
      <span className="font-pixel">{text}</span>
      <div className="w-2 h-4 bg-current animate-pixel-loading" />
    </div>
  );

  const renderLoader = () => {
    switch (type) {
      case "bars":
        return renderBars();
      case "spinner":
        return renderSpinner();
      case "typewriter":
        return renderTypewriter();
      default:
        return renderDots();
    }
  };

  return (
    <div
      className={`flex flex-col items-center space-y-2 text-white ${className}`}
    >
      {renderLoader()}
      {type !== "typewriter" && (
        <span className="font-pixel text-sm text-gray-400">{text}</span>
      )}
    </div>
  );
}
