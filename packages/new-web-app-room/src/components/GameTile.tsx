import React from 'react';
import { Tile } from '../hooks/use2048';

interface GameTileProps {
  tile: Tile;
}

export const GameTile: React.FC<GameTileProps> = ({ tile }) => {
  const getTileColor = (value: number): string => {
    const colors: { [key: number]: string } = {
      2: 'bg-gray-100 text-gray-800',
      4: 'bg-gray-200 text-gray-800',
      8: 'bg-orange-200 text-white',
      16: 'bg-orange-300 text-white',
      32: 'bg-orange-400 text-white',
      64: 'bg-orange-500 text-white',
      128: 'bg-yellow-400 text-white',
      256: 'bg-yellow-500 text-white',
      512: 'bg-yellow-600 text-white',
      1024: 'bg-red-400 text-white',
      2048: 'bg-red-500 text-white',
    };
    
    return colors[value] || 'bg-red-600 text-white';
  };

  const getFontSize = (value: number): string => {
    if (value >= 1000) return 'text-sm';
    if (value >= 100) return 'text-lg';
    return 'text-xl';
  };

  return (
    <div
      className={`
        ${getTileColor(tile.value)}
        ${getFontSize(tile.value)}
        ${tile.isNew ? 'animate-pulse' : ''}
        ${tile.isMerged ? 'animate-bounce' : ''}
        rounded-lg font-bold flex items-center justify-center
        transition-all duration-150 ease-in-out
        shadow-sm
      `}
      style={{
        gridRow: tile.row + 1,
        gridColumn: tile.col + 1,
      }}
    >
      {tile.value}
    </div>
  );
};
