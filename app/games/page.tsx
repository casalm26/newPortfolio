"use client";

import { Suspense } from "react";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import PixelSnakeGame from "@/components/games/PixelSnakeGame";

function GamesSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-96 bg-terminal-800 border border-terminal-400"></div>
    </div>
  );
}

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Terminal Header */}
        <div className="mb-12">
          <div className="font-pixel text-sm text-terminal-400 mb-2">
            caspian@localhost:~$ ls games/
          </div>
          <h1 className="text-4xl md:text-6xl font-pixel font-bold text-white mb-4">
            GAMES/
          </h1>
          <p className="text-terminal-300 max-w-2xl">
            Interactive pixel art games showcasing creative coding skills and
            retro game development. Each game demonstrates different technical
            concepts and programming patterns.
          </p>
        </div>

        {/* Featured Game */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-2xl font-pixel font-bold text-white mb-2">
              FEATURED GAME
            </h2>
            <div className="font-pixel text-xs text-terminal-400">
              ./pixel_snake.exe - Classic Snake reimagined with modern web tech
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Game Container */}
            <div className="flex justify-center">
              <Suspense fallback={<GamesSkeleton />}>
                <PixelSnakeGame />
              </Suspense>
            </div>

            {/* Game Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-pixel font-bold text-white mb-3">
                  ABOUT PIXEL SNAKE
                </h3>
                <p className="text-terminal-300 text-sm leading-relaxed mb-4">
                  A modern take on the classic Snake game, built with React, TypeScript,
                  and Canvas API. Features pixel-perfect rendering, smooth animations,
                  and responsive controls optimized for both keyboard and touch devices.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-pixel text-xs text-terminal-400">TECH:</span>
                    <span className="font-pixel text-xs text-terminal-300">
                      React • TypeScript • Canvas • Game Loop
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-pixel text-xs text-terminal-400">FEATURES:</span>
                    <span className="font-pixel text-xs text-terminal-300">
                      Collision Detection • State Management • Keyboard Controls
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-pixel text-sm text-white mb-3">
                  TECHNICAL HIGHLIGHTS:
                </h4>
                <ul className="space-y-2 text-terminal-300 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-terminal-500 mt-1">•</span>
                    <span>Custom game loop with requestAnimationFrame optimization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terminal-500 mt-1">•</span>
                    <span>Efficient collision detection algorithms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terminal-500 mt-1">•</span>
                    <span>Immutable state management with React hooks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terminal-500 mt-1">•</span>
                    <span>Pixel-perfect SVG rendering with terminal aesthetics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terminal-500 mt-1">•</span>
                    <span>Comprehensive test coverage with Vitest</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 border border-terminal-400 bg-terminal-900">
                <div className="font-pixel text-xs text-terminal-400 mb-2">
                  DEVELOPER NOTES:
                </div>
                <p className="text-terminal-300 text-xs leading-relaxed">
                  This game demonstrates practical application of game development
                  concepts in web environments, including game loops, state management,
                  and user input handling. The pixel art style aligns with the portfolio's
                  retro aesthetic while showcasing modern React patterns.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Coming Soon Games */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-2xl font-pixel font-bold text-white mb-2">
              COMING SOON
            </h2>
            <div className="font-pixel text-xs text-terminal-400">
              Future interactive experiences in development
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tetris */}
            <div className="p-6 border border-terminal-400 hover:border-terminal-300 transition-colors">
              <div className="mb-4">
                <h3 className="font-pixel text-lg text-white mb-1">PIXEL TETRIS</h3>
                <div className="font-pixel text-xs text-terminal-400">
                  ./tetris.exe
                </div>
              </div>
              <p className="text-terminal-300 text-sm mb-4">
                Classic block-stacking puzzle with WebGL rendering and
                advanced particle effects.
              </p>
              <div className="space-y-2">
                <div className="font-pixel text-xs text-terminal-400">
                  FEATURES: WebGL • Particle Systems • Audio
                </div>
                <div className="inline-block px-2 py-1 bg-terminal-800 border border-terminal-500">
                  <span className="font-pixel text-xs text-terminal-300">
                    STATUS: Planning
                  </span>
                </div>
              </div>
            </div>

            {/* Pong */}
            <div className="p-6 border border-terminal-400 hover:border-terminal-300 transition-colors">
              <div className="mb-4">
                <h3 className="font-pixel text-lg text-white mb-1">PIXEL PONG</h3>
                <div className="font-pixel text-xs text-terminal-400">
                  ./pong.exe
                </div>
              </div>
              <p className="text-terminal-300 text-sm mb-4">
                Two-player Pong with AI opponent and multiplayer WebSocket
                support for online matches.
              </p>
              <div className="space-y-2">
                <div className="font-pixel text-xs text-terminal-400">
                  FEATURES: AI • WebSockets • Multiplayer
                </div>
                <div className="inline-block px-2 py-1 bg-terminal-800 border border-terminal-500">
                  <span className="font-pixel text-xs text-terminal-300">
                    STATUS: Design
                  </span>
                </div>
              </div>
            </div>

            {/* Code Breaker */}
            <div className="p-6 border border-terminal-400 hover:border-terminal-300 transition-colors">
              <div className="mb-4">
                <h3 className="font-pixel text-lg text-white mb-1">CODE BREAKER</h3>
                <div className="font-pixel text-xs text-terminal-400">
                  ./codebreaker.exe
                </div>
              </div>
              <p className="text-terminal-300 text-sm mb-4">
                Interactive coding challenges and algorithm visualizations
                with real-time performance metrics.
              </p>
              <div className="space-y-2">
                <div className="font-pixel text-xs text-terminal-400">
                  FEATURES: Algorithms • Visualizations • Metrics
                </div>
                <div className="inline-block px-2 py-1 bg-terminal-800 border border-terminal-500">
                  <span className="font-pixel text-xs text-terminal-300">
                    STATUS: Concept
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Game Development Process */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-pixel font-bold text-white mb-2">
              DEVELOPMENT PROCESS
            </h2>
            <div className="font-pixel text-xs text-terminal-400">
              Behind the scenes of game creation
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-pixel text-lg text-white mb-4">TECHNICAL APPROACH</h3>
              <div className="space-y-4">
                <div className="p-4 border border-terminal-400">
                  <h4 className="font-pixel text-sm text-white mb-2">1. GAME DESIGN</h4>
                  <p className="text-terminal-300 text-sm">
                    Conceptualize mechanics, define scope, and create pixel art assets
                    that align with the portfolio's retro aesthetic.
                  </p>
                </div>
                <div className="p-4 border border-terminal-400">
                  <h4 className="font-pixel text-sm text-white mb-2">2. CORE ENGINE</h4>
                  <p className="text-terminal-300 text-sm">
                    Build reusable game engine components including game loops,
                    input handling, and state management systems.
                  </p>
                </div>
                <div className="p-4 border border-terminal-400">
                  <h4 className="font-pixel text-sm text-white mb-2">3. OPTIMIZATION</h4>
                  <p className="text-terminal-300 text-sm">
                    Profile performance, optimize rendering, and ensure smooth
                    60fps gameplay across devices.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-pixel text-lg text-white mb-4">TECH STACK</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-pixel text-sm text-white mb-2">RENDERING</h4>
                  <ul className="text-terminal-300 text-sm space-y-1">
                    <li>• Canvas API for 2D graphics</li>
                    <li>• SVG for pixel-perfect UI elements</li>
                    <li>• WebGL for 3D effects (future games)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-pixel text-sm text-white mb-2">INTERACTION</h4>
                  <ul className="text-terminal-300 text-sm space-y-1">
                    <li>• Keyboard and touch input handling</li>
                    <li>• Game controller support (planned)</li>
                    <li>• WebSocket multiplayer (planned)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-pixel text-sm text-white mb-2">PERFORMANCE</h4>
                  <ul className="text-terminal-300 text-sm space-y-1">
                    <li>• RequestAnimationFrame game loops</li>
                    <li>• Object pooling for memory efficiency</li>
                    <li>• Comprehensive test coverage</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Terminal Footer */}
        <div className="mt-12 pt-8 border-t border-terminal-400">
          <div className="font-pixel text-xs text-terminal-400">
            games developed with react, typescript, and creative coding •
            built for learning and entertainment
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}