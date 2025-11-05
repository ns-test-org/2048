import React from 'react';
import { Tile } from '../hooks/use2048';
import { GameTile } from './GameTile';

interface GameBoardProps {
  tiles: Tile[];
}

export const GameBoard: React.FC<GameBoardProps> = ({ tiles }) => {
  // Create empty grid cells for background
  const gridCells = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      gridCells.push(
        <div
          key={`${row}-${col}`}
          className="bg-gray-300 rounded-lg"
          style={{
            gridRow: row + 1,
            gridColumn: col + 1,
          }}
        />
      );
    }
  }

  return (
    <div className="relative">
      {/* Background grid */}
      <div className="grid grid-cols-4 gap-2 p-4 bg-gray-400 rounded-lg">
        {gridCells}
      </div>
      
      {/* Tiles */}
      <div className="absolute inset-0 grid grid-cols-4 gap-2 p-4">
        {tiles.map(tile => (
          <GameTile key={tile.id} tile={tile} />
        ))}
      </div>
    </div>
  );
};
