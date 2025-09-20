"use client";

import { motion } from "framer-motion";
import PixelLoading from "./PixelLoading";

interface PageLoadingProps {
  message?: string;
  progress?: number;
}

export default function PageLoading({ message = "LOADING", progress }: PageLoadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
    >
      <div className="text-center space-y-8">
        {/* Terminal window */}
        <div className="bg-terminal-900 border border-terminal-400 p-6 max-w-md mx-auto">
          <div className="flex items-center mb-4">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="ml-4 font-pixel text-xs text-terminal-400">
              terminal.app
            </div>
          </div>

          <div className="space-y-4">
            <div className="font-pixel text-sm text-terminal-300">
              <span className="text-green-400">caspian@localhost</span>
              <span className="text-white">:</span>
              <span className="text-blue-400">~</span>
              <span className="text-white">$ npm run dev</span>
            </div>

            <div className="flex items-center justify-center py-8">
              {progress !== undefined ? (
                <div className="space-y-4">
                  <PixelLoading variant="progress" size="lg" />
                  <div className="font-pixel text-xs text-terminal-400 text-center">
                    {Math.round(progress)}%
                  </div>
                </div>
              ) : (
                <PixelLoading variant="glitch" size="md" text={message} />
              )}
            </div>

            <div className="font-pixel text-xs text-terminal-500 space-y-1">
              <div>Starting development server...</div>
              <div>Compiling components...</div>
              <div>Optimizing pixel art assets...</div>
            </div>
          </div>
        </div>

        {/* Matrix-style background animation */}
        <div className="fixed inset-0 -z-10 overflow-hidden opacity-20">
          {Array.from({ length: 20 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute w-px bg-terminal-400"
              style={{
                left: `${i * 5}%`,
                height: "100%",
              }}
              animate={{
                y: ["0%", "100%"],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}