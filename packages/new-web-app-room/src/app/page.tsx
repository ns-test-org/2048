'use client';

import React, { useEffect } from 'react';
import { use2048 } from '../hooks/use2048';
import { GameBoard } from '../components/GameBoard';

export default function Game2048() {
  const { gameState, initializeGame } = use2048();

  // Save best score to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentBest = parseInt(localStorage.getItem('2048-best') || '0');
      if (gameState.score > currentBest) {
        localStorage.setItem('2048-best', gameState.score.toString());
      }
    }
  }, [gameState.score]);

  const getBestScore = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('2048-best') || '0';
    }
    return '0';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">2048</h1>
        
        {/* Score Display */}
        <div className="flex justify-between mb-6">
          <div className="bg-gray-200 rounded-lg p-3 text-center flex-1 mr-2">
            <div className="text-sm text-gray-600">SCORE</div>
            <div className="text-xl font-bold">{gameState.score}</div>
          </div>
          <div className="bg-gray-200 rounded-lg p-3 text-center flex-1 ml-2">
            <div className="text-sm text-gray-600">BEST</div>
            <div className="text-xl font-bold">{getBestScore()}</div>
          </div>
        </div>

        {/* Game Status Messages */}
        {gameState.won && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-center">
            🎉 You won! You reached 2048!
          </div>
        )}
        
        {gameState.gameOver && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
            Game Over! No more moves available.
          </div>
        )}

        {/* Game Board */}
        <div className="mb-6">
          <GameBoard tiles={gameState.tiles} />
        </div>

        {/* Controls */}
        <div className="text-center">
          <button 
            onClick={initializeGame}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg mb-4 transition-colors"
          >
            New Game
          </button>
          <p className="text-sm text-gray-600">
            Use arrow keys to move tiles. Combine tiles with the same number to reach 2048!
          </p>
        </div>
      </div>
    </div>
  );
}

