"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

interface Position {
  x: number;
  y: number;
}

interface GameState {
  snake: Position[];
  food: Position;
  direction: Position;
  gameOver: boolean;
  score: number;
  isPlaying: boolean;
  highScore: number;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_FOOD = { x: 5, y: 5 };
const HIGH_SCORE_KEY = 'pixelSnakeHighScore';

const getHighScore = (): number => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(HIGH_SCORE_KEY);
    return stored ? parseInt(stored, 10) : 0;
  }
  return 0;
};

const setHighScore = (score: number): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(HIGH_SCORE_KEY, score.toString());
  }
};

const generateFood = (snake: Position[]): Position => {
  let food: Position;
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
  return food;
};

export default function PixelSnakeGame() {
  const [gameState, setGameState] = useState<GameState>({
    snake: [...INITIAL_SNAKE],
    food: INITIAL_FOOD,
    direction: INITIAL_DIRECTION,
    gameOver: false,
    score: 0,
    isPlaying: false,
    highScore: 0,
  });

  const gameLoopRef = useRef<NodeJS.Timeout>();
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Prepare client only state
  useEffect(() => {
    const savedHighScore = getHighScore();
    setGameState(prev => ({
      ...prev,
      highScore: savedHighScore,
      food: generateFood(prev.snake),
    }));
  }, []);

  const moveSnake = useCallback(() => {
    setGameState(prevState => {
      if (prevState.gameOver || !prevState.isPlaying) return prevState;

      const newSnake = [...prevState.snake];
      const head = { ...newSnake[0] };

      head.x += prevState.direction.x;
      head.y += prevState.direction.y;

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        const newHighScore = Math.max(prevState.score, prevState.highScore);
        if (newHighScore > prevState.highScore) {
          setHighScore(newHighScore);
        }
        return { ...prevState, gameOver: true, isPlaying: false, highScore: newHighScore };
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        const newHighScore = Math.max(prevState.score, prevState.highScore);
        if (newHighScore > prevState.highScore) {
          setHighScore(newHighScore);
        }
        return { ...prevState, gameOver: true, isPlaying: false, highScore: newHighScore };
      }

      newSnake.unshift(head);

      let newFood = prevState.food;
      let newScore = prevState.score;

      // Check food collision
      if (head.x === prevState.food.x && head.y === prevState.food.y) {
        newFood = generateFood(newSnake);
        newScore += 10;
      } else {
        newSnake.pop();
      }

      return {
        ...prevState,
        snake: newSnake,
        food: newFood,
        score: newScore,
      };
    });
  }, []);

  const startGame = useCallback(() => {
    setGameState(prev => ({
      snake: [...INITIAL_SNAKE],
      food: generateFood(INITIAL_SNAKE),
      direction: INITIAL_DIRECTION,
      gameOver: false,
      score: 0,
      isPlaying: true,
      highScore: prev.highScore,
    }));
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState(prev => ({
      snake: [...INITIAL_SNAKE],
      food: generateFood(INITIAL_SNAKE),
      direction: INITIAL_DIRECTION,
      gameOver: false,
      score: 0,
      isPlaying: false,
      highScore: prev.highScore,
    }));
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState.isPlaying && !gameState.gameOver) {
      gameLoopRef.current = setInterval(moveSnake, 150);
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.gameOver, moveSnake]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameState.isPlaying) return;

      setGameState(prevState => {
        const { direction } = prevState;
        let newDirection = direction;

        switch (e.key) {
          case 'ArrowUp':
          case 'w':
          case 'W':
            if (direction.y === 0) newDirection = { x: 0, y: -1 };
            break;
          case 'ArrowDown':
          case 's':
          case 'S':
            if (direction.y === 0) newDirection = { x: 0, y: 1 };
            break;
          case 'ArrowLeft':
          case 'a':
          case 'A':
            if (direction.x === 0) newDirection = { x: -1, y: 0 };
            break;
          case 'ArrowRight':
          case 'd':
          case 'D':
            if (direction.x === 0) newDirection = { x: 1, y: 0 };
            break;
          case ' ':
            e.preventDefault();
            return { ...prevState, isPlaying: !prevState.isPlaying };
          default:
            return prevState;
        }

        return { ...prevState, direction: newDirection };
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.isPlaying]);

  // Touch controls for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault(); // Prevent page scroll
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault(); // Prevent page scroll
    if (!touchStartRef.current || !gameState.isPlaying) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const minSwipeDistance = 30;

    // Determine swipe direction
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > minSwipeDistance) {
        setGameState(prevState => {
          const { direction } = prevState;
          if (direction.x === 0) { // Can only change direction if not already moving horizontally
            const newDirection = deltaX > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
            return { ...prevState, direction: newDirection };
          }
          return prevState;
        });
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > minSwipeDistance) {
        setGameState(prevState => {
          const { direction } = prevState;
          if (direction.y === 0) { // Can only change direction if not already moving vertically
            const newDirection = deltaY > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };
            return { ...prevState, direction: newDirection };
          }
          return prevState;
        });
      }
    }

    touchStartRef.current = null;
  }, [gameState.isPlaying]);

  // Disable page scroll during gameplay
  useEffect(() => {
    const preventScroll = (e: Event) => {
      if (gameState.isPlaying) {
        e.preventDefault();
      }
    };

    const preventKeyboardScroll = (e: KeyboardEvent) => {
      if (gameState.isPlaying && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
    };

    if (gameState.isPlaying) {
      // Prevent touch scrolling
      document.addEventListener('touchmove', preventScroll, { passive: false });
      // Prevent keyboard scrolling (space, arrows)
      document.addEventListener('keydown', preventKeyboardScroll, { passive: false });
      // Prevent wheel scrolling
      document.addEventListener('wheel', preventScroll, { passive: false });
    }

    return () => {
      document.removeEventListener('touchmove', preventScroll);
      document.removeEventListener('keydown', preventKeyboardScroll);
      document.removeEventListener('wheel', preventScroll);
    };
  }, [gameState.isPlaying]);

  const cellSize = 20;
  const boardSize = GRID_SIZE * cellSize;

  return (
    <div className="flex flex-col items-center space-y-6 p-6 border border-terminal-400 bg-black">
      {/* Game Header */}
      <div className="w-full max-w-lg">
        <div className="font-pixel text-sm text-terminal-400 mb-2">
          ./snake_game.exe
        </div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-pixel font-bold text-white">
            PIXEL SNAKE
          </h2>
          <div className="text-right space-y-1">
            <div className="font-pixel text-sm text-terminal-300">
              SCORE: <span className="text-white">{gameState.score.toString().padStart(4, '0')}</span>
            </div>
            <div className="font-pixel text-xs text-terminal-400">
              HIGH: <span className="text-terminal-200">{gameState.highScore.toString().padStart(4, '0')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative">
        <svg
          width={boardSize}
          height={boardSize}
          className="border-2 border-terminal-400"
          style={{ imageRendering: 'pixelated' }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Background grid */}
          <defs>
            <pattern id="grid" width={cellSize} height={cellSize} patternUnits="userSpaceOnUse">
              <path
                d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`}
                fill="none"
                stroke="#27272a"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Snake */}
          {gameState.snake.map((segment, index) => (
            <rect
              key={index}
              x={segment.x * cellSize + 1}
              y={segment.y * cellSize + 1}
              width={cellSize - 2}
              height={cellSize - 2}
              fill={index === 0 ? "#ffffff" : "#a1a1aa"}
              className="transition-all duration-75"
            />
          ))}

          {/* Food */}
          <rect
            x={gameState.food.x * cellSize + 2}
            y={gameState.food.y * cellSize + 2}
            width={cellSize - 4}
            height={cellSize - 4}
            fill="#ef4444"
            className="animate-pulse"
          />
        </svg>

        {/* Game Over Overlay */}
        {gameState.gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center">
            <div className="text-center">
              <div className="font-pixel text-xl text-white mb-2">GAME OVER</div>
              <div className="font-pixel text-sm text-terminal-300 mb-2">
                FINAL SCORE: {gameState.score}
              </div>
              {gameState.score === gameState.highScore && gameState.score > 0 && (
                <div className="font-pixel text-xs text-yellow-400 mb-2">
                  NEW HIGH SCORE!
                </div>
              )}
              <div className="font-pixel text-xs text-terminal-400 mb-4">
                HIGH SCORE: {gameState.highScore}
              </div>
              <button
                onClick={startGame}
                className="font-pixel text-xs px-4 py-2 border border-white bg-white text-black hover:bg-black hover:text-white transition-colors"
              >
                PLAY AGAIN
              </button>
            </div>
          </div>
        )}

        {/* Pause Overlay */}
        {!gameState.isPlaying && !gameState.gameOver && gameState.snake.length > 1 && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <div className="font-pixel text-xl text-white">PAUSED</div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="w-full max-w-lg space-y-4">
        <div className="flex justify-center gap-4">
          {!gameState.isPlaying && !gameState.gameOver ? (
            <button
              onClick={startGame}
              className="font-pixel text-xs px-4 py-2 border border-white bg-white text-black hover:bg-black hover:text-white transition-colors"
            >
              START GAME
            </button>
          ) : (
            <button
              onClick={pauseGame}
              className="font-pixel text-xs px-4 py-2 border border-terminal-400 text-terminal-300 hover:border-white hover:text-white transition-colors"
            >
              {gameState.isPlaying ? 'PAUSE' : 'RESUME'}
            </button>
          )}

          <button
            onClick={resetGame}
            className="font-pixel text-xs px-4 py-2 border border-terminal-400 text-terminal-300 hover:border-white hover:text-white transition-colors"
          >
            RESET
          </button>
        </div>

        {/* Instructions */}
        <div className="text-center space-y-2">
          <div className="font-pixel text-xs text-terminal-400">
            CONTROLS:
          </div>
          <div className="font-pixel text-xs text-terminal-300">
            ARROW KEYS or WASD to move • SPACE to pause • SWIPE on mobile
          </div>
          <div className="font-pixel text-xs text-terminal-500">
            Eat the red pixels to grow • Don't hit walls or yourself
          </div>
        </div>
      </div>
    </div>
  );
}