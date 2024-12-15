'use client';

import { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const GAME_SPEED = 150;

export default function Home() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
    generateFood();
  };

  const checkCollision = useCallback((head) => {
    if (
      head.x < 0 || head.x >= GRID_SIZE ||
      head.y < 0 || head.y >= GRID_SIZE
    ) {
      return true;
    }

    for (let segment of snake.slice(1)) {
      if (head.x === segment.x && head.y === segment.y) {
        return true;
      }
    }
    return false;
  }, [snake]);

  const moveSnake = useCallback(() => {
    if (gameOver) return;

    const newSnake = [...snake];
    const head = {
      x: newSnake[0].x + direction.x,
      y: newSnake[0].y + direction.y
    };

    if (checkCollision(head)) {
      setGameOver(true);
      return;
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setScore(prev => prev + 1);
      generateFood();
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food, gameOver, generateFood, checkCollision]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [moveSnake]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Cyberpunk background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDBNIDAgMjAgTCA0MCAyMCBNIDIwIDAgTCAyMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDY2LCAyNTUsIDI1NSwgMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />

      <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-4 relative">
        CYBER SNAKE
      </h1>
      
      <div className="text-2xl font-mono text-cyan-400 mb-4 relative">
        SCORE: <span className="text-purple-400">{score}</span>
      </div>
      
      <div className="relative bg-black border-2 border-cyan-500 rounded-lg overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.5)]"
           style={{
             width: `${GRID_SIZE * 20}px`,
             height: `${GRID_SIZE * 20}px`
           }}>
        {/* Grid lines */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAyMCAwIEwgMCAyME0gMCAwIEwgMjAgMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSg2NiwgMjU1LCAyNTUsIDAuMSkiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
        
        {snake.map((segment, index) => (
          <div
            key={index}
            className="absolute bg-purple-500 rounded-sm transition-all duration-100 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
            style={{
              left: `${segment.x * 20}px`,
              top: `${segment.y * 20}px`,
              width: '20px',
              height: '20px',
              filter: index === 0 ? 'brightness(1.2)' : 'brightness(1)'
            }}
          />
        ))}
        <div
          className="absolute bg-cyan-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,211,238,0.6)]"
          style={{
            left: `${food.x * 20}px`,
            top: `${food.y * 20}px`,
            width: '20px',
            height: '20px'
          }}
        />
      </div>

      {gameOver && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-gray-900 p-8 rounded-lg text-center border border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            <h2 className="text-3xl font-bold text-red-500 mb-4 glitch">GAME OVER</h2>
            <div className="text-cyan-400 mb-4">Final Score: {score}</div>
            <button
              onClick={resetGame}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-3 rounded-lg 
                       hover:from-cyan-600 hover:to-purple-600 transition-all duration-300
                       shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]
                       font-mono uppercase tracking-wider"
            >
              Restart Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
