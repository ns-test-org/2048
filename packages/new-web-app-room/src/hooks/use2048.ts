import { useState, useCallback, useEffect } from 'react';

export type Tile = {
  id: string;
  value: number;
  row: number;
  col: number;
  isNew?: boolean;
  isMerged?: boolean;
};

export type GameState = {
  tiles: Tile[];
  score: number;
  gameOver: boolean;
  won: boolean;
};

const GRID_SIZE = 4;

export const use2048 = () => {
  const [gameState, setGameState] = useState<GameState>({
    tiles: [],
    score: 0,
    gameOver: false,
    won: false,
  });

  const createEmptyGrid = (): boolean[][] => {
    return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false));
  };

  const getRandomEmptyCell = (grid: boolean[][]): { row: number; col: number } | null => {
    const emptyCells: { row: number; col: number }[] = [];
    
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (!grid[row][col]) {
          emptyCells.push({ row, col });
        }
      }
    }
    
    if (emptyCells.length === 0) return null;
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  };

  const addRandomTile = (tiles: Tile[]): Tile[] => {
    const grid = createEmptyGrid();
    
    // Mark occupied cells
    tiles.forEach(tile => {
      grid[tile.row][tile.col] = true;
    });
    
    const emptyCell = getRandomEmptyCell(grid);
    if (!emptyCell) return tiles;
    
    const newTile: Tile = {
      id: Math.random().toString(36).substr(2, 9),
      value: Math.random() < 0.9 ? 2 : 4,
      row: emptyCell.row,
      col: emptyCell.col,
      isNew: true,
    };
    
    return [...tiles, newTile];
  };

  const initializeGame = useCallback(() => {
    let tiles: Tile[] = [];
    tiles = addRandomTile(tiles);
    tiles = addRandomTile(tiles);
    
    setGameState({
      tiles,
      score: 0,
      gameOver: false,
      won: false,
    });
  }, []);

  const moveTiles = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    setGameState(prevState => {
      if (prevState.gameOver) return prevState;

      const { tiles } = prevState;
      let newTiles: Tile[] = [];
      let newScore = prevState.score;
      let moved = false;

      // Create a 2D array representation
      const grid: (Tile | null)[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
      tiles.forEach(tile => {
        grid[tile.row][tile.col] = { ...tile, isNew: false, isMerged: false };
      });

      const moveRow = (row: (Tile | null)[], reverse = false): (Tile | null)[] => {
        const filtered = row.filter(tile => tile !== null);
        if (reverse) filtered.reverse();
        
        const merged: (Tile | null)[] = [];
        let i = 0;
        
        while (i < filtered.length) {
          if (i < filtered.length - 1 && filtered[i]!.value === filtered[i + 1]!.value) {
            // Merge tiles
            const mergedTile: Tile = {
              ...filtered[i]!,
              value: filtered[i]!.value * 2,
              isMerged: true,
            };
            merged.push(mergedTile);
            newScore += mergedTile.value;
            i += 2;
          } else {
            merged.push(filtered[i]);
            i++;
          }
        }
        
        // Fill with nulls
        while (merged.length < GRID_SIZE) {
          merged.push(null);
        }
        
        if (reverse) merged.reverse();
        return merged;
      };

      let newGrid: (Tile | null)[][];

      switch (direction) {
        case 'left':
          newGrid = grid.map(row => moveRow(row));
          break;
        case 'right':
          newGrid = grid.map(row => moveRow(row, true));
          break;
        case 'up':
          newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
          for (let col = 0; col < GRID_SIZE; col++) {
            const column = grid.map(row => row[col]);
            const movedColumn = moveRow(column);
            movedColumn.forEach((tile, row) => {
              newGrid[row][col] = tile;
            });
          }
          break;
        case 'down':
          newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
          for (let col = 0; col < GRID_SIZE; col++) {
            const column = grid.map(row => row[col]);
            const movedColumn = moveRow(column, true);
            movedColumn.forEach((tile, row) => {
              newGrid[row][col] = tile;
            });
          }
          break;
        default:
          newGrid = grid;
      }

      // Convert back to tiles array and check if anything moved
      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          const tile = newGrid[row][col];
          if (tile) {
            const updatedTile = { ...tile, row, col };
            newTiles.push(updatedTile);
            
            // Check if tile moved
            const originalTile = tiles.find(t => t.id === tile.id);
            if (originalTile && (originalTile.row !== row || originalTile.col !== col || tile.isMerged)) {
              moved = true;
            }
          }
        }
      }

      if (!moved) return prevState;

      // Add new random tile
      newTiles = addRandomTile(newTiles);

      // Check for win condition
      const won = newTiles.some(tile => tile.value >= 2048) && !prevState.won;

      // Check for game over
      const gameOver = checkGameOver(newTiles);

      return {
        tiles: newTiles,
        score: newScore,
        gameOver,
        won: won || prevState.won,
      };
    });
  }, []);

  const checkGameOver = (tiles: Tile[]): boolean => {
    // Check if grid is full
    if (tiles.length < GRID_SIZE * GRID_SIZE) return false;

    // Create grid for checking moves
    const grid: number[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
    tiles.forEach(tile => {
      grid[tile.row][tile.col] = tile.value;
    });

    // Check for possible moves
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const current = grid[row][col];
        
        // Check right
        if (col < GRID_SIZE - 1 && current === grid[row][col + 1]) return false;
        
        // Check down
        if (row < GRID_SIZE - 1 && current === grid[row + 1][col]) return false;
      }
    }

    return true;
  };

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        moveTiles('up');
        break;
      case 'ArrowDown':
        event.preventDefault();
        moveTiles('down');
        break;
      case 'ArrowLeft':
        event.preventDefault();
        moveTiles('left');
        break;
      case 'ArrowRight':
        event.preventDefault();
        moveTiles('right');
        break;
    }
  }, [moveTiles]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  return {
    gameState,
    initializeGame,
    moveTiles,
  };
};
