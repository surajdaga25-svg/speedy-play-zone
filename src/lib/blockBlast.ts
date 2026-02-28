// Block shapes for the Block Blast game
export type BlockShape = boolean[][];

export interface BlockPiece {
  id: string;
  shape: BlockShape;
  color: string; // tailwind color class
}

// All possible block shapes
const SHAPES: { shape: BlockShape; color: string }[] = [
  // Single
  { shape: [[true]], color: 'bg-primary' },
  // 1x2
  { shape: [[true, true]], color: 'bg-neon-blue' },
  // 2x1
  { shape: [[true], [true]], color: 'bg-neon-blue' },
  // 1x3
  { shape: [[true, true, true]], color: 'bg-neon-pink' },
  // 3x1
  { shape: [[true], [true], [true]], color: 'bg-neon-pink' },
  // 1x4
  { shape: [[true, true, true, true]], color: 'bg-secondary' },
  // 4x1
  { shape: [[true], [true], [true], [true]], color: 'bg-secondary' },
  // 1x5
  { shape: [[true, true, true, true, true]], color: 'bg-accent' },
  // 5x1
  { shape: [[true], [true], [true], [true], [true]], color: 'bg-accent' },
  // 2x2
  { shape: [[true, true], [true, true]], color: 'bg-neon-yellow' },
  // 3x3
  { shape: [[true, true, true], [true, true, true], [true, true, true]], color: 'bg-destructive' },
  // L shapes
  { shape: [[true, false], [true, false], [true, true]], color: 'bg-primary' },
  { shape: [[false, true], [false, true], [true, true]], color: 'bg-primary' },
  { shape: [[true, true], [true, false], [true, false]], color: 'bg-neon-green' },
  { shape: [[true, true], [false, true], [false, true]], color: 'bg-neon-green' },
  // Small L
  { shape: [[true, false], [true, true]], color: 'bg-neon-blue' },
  { shape: [[false, true], [true, true]], color: 'bg-neon-blue' },
  { shape: [[true, true], [true, false]], color: 'bg-neon-purple' },
  { shape: [[true, true], [false, true]], color: 'bg-neon-purple' },
  // T shape
  { shape: [[true, true, true], [false, true, false]], color: 'bg-secondary' },
  // 2x3
  { shape: [[true, true, true], [true, true, true]], color: 'bg-accent' },
  // 3x2
  { shape: [[true, true], [true, true], [true, true]], color: 'bg-accent' },
];

export const GRID_SIZE = 8;

export type Grid = (string | null)[][]; // null = empty, string = color class

export const createEmptyGrid = (): Grid =>
  Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));

export const generatePieces = (count: number = 3): BlockPiece[] =>
  Array.from({ length: count }, () => {
    const template = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    return {
      id: crypto.randomUUID(),
      shape: template.shape,
      color: template.color,
    };
  });

export const canPlacePiece = (grid: Grid, piece: BlockPiece, row: number, col: number): boolean => {
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (!piece.shape[r][c]) continue;
      const gr = row + r;
      const gc = col + c;
      if (gr < 0 || gr >= GRID_SIZE || gc < 0 || gc >= GRID_SIZE) return false;
      if (grid[gr][gc] !== null) return false;
    }
  }
  return true;
};

export const placePiece = (grid: Grid, piece: BlockPiece, row: number, col: number): Grid => {
  const newGrid = grid.map(r => [...r]);
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (piece.shape[r][c]) {
        newGrid[row + r][col + c] = piece.color;
      }
    }
  }
  return newGrid;
};

export const clearLines = (grid: Grid): { newGrid: Grid; linesCleared: number } => {
  const rowsToClear: number[] = [];
  const colsToClear: number[] = [];

  // Check rows
  for (let r = 0; r < GRID_SIZE; r++) {
    if (grid[r].every(cell => cell !== null)) rowsToClear.push(r);
  }

  // Check columns
  for (let c = 0; c < GRID_SIZE; c++) {
    if (grid.every(row => row[c] !== null)) colsToClear.push(c);
  }

  const linesCleared = rowsToClear.length + colsToClear.length;
  if (linesCleared === 0) return { newGrid: grid, linesCleared: 0 };

  const newGrid = grid.map(r => [...r]);

  for (const r of rowsToClear) {
    for (let c = 0; c < GRID_SIZE; c++) newGrid[r][c] = null;
  }
  for (const c of colsToClear) {
    for (let r = 0; r < GRID_SIZE; r++) newGrid[r][c] = null;
  }

  return { newGrid, linesCleared };
};

export const canAnyPieceFit = (grid: Grid, pieces: BlockPiece[]): boolean => {
  for (const piece of pieces) {
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (canPlacePiece(grid, piece, r, c)) return true;
      }
    }
  }
  return false;
};

export const calculateScore = (linesCleared: number, combo: number): number => {
  if (linesCleared === 0) return 0;
  // Base: 10 per line, bonus for multiple lines, combo multiplier
  const lineBonus = linesCleared * linesCleared * 10;
  const comboMultiplier = 1 + combo * 0.5;
  return Math.round(lineBonus * comboMultiplier);
};
