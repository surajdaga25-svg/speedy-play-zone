import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Grid, BlockPiece, GRID_SIZE,
  createEmptyGrid, generatePieces,
  canPlacePiece, placePiece, clearLines,
  canAnyPieceFit, calculateScore,
} from '@/lib/blockBlast';

interface Props {
  onScore: (points: number) => void;
  disabled: boolean;
}

const BlockBlastGame = ({ onScore, disabled }: Props) => {
  const [grid, setGrid] = useState<Grid>(createEmptyGrid);
  const [pieces, setPieces] = useState<BlockPiece[]>(() => generatePieces());
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [hoverCell, setHoverCell] = useState<{ row: number; col: number } | null>(null);
  const [combo, setCombo] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [clearingCells, setClearingCells] = useState<Set<string>>(new Set());
  const [lastScore, setLastScore] = useState<number | null>(null);

  // Check game over
  useEffect(() => {
    if (pieces.length > 0 && !canAnyPieceFit(grid, pieces)) {
      setGameOver(true);
    }
  }, [grid, pieces]);

  const handleSelectPiece = (index: number) => {
    if (disabled || gameOver) return;
    setSelectedPiece(prev => prev === index ? null : index);
  };

  const handleCellClick = useCallback((row: number, col: number) => {
    if (disabled || gameOver || selectedPiece === null) return;

    const piece = pieces[selectedPiece];
    if (!piece || !canPlacePiece(grid, piece, row, col)) return;

    // Place the piece
    const newGrid = placePiece(grid, piece, row, col);

    // Clear lines
    const { newGrid: clearedGrid, linesCleared } = clearLines(newGrid);

    // Animate clearing
    if (linesCleared > 0) {
      // Find cells that were cleared
      const cleared = new Set<string>();
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          if (newGrid[r][c] !== null && clearedGrid[r][c] === null) {
            cleared.add(`${r}-${c}`);
          }
        }
      }
      setClearingCells(cleared);
      setTimeout(() => setClearingCells(new Set()), 300);
    }

    // Score
    const newCombo = linesCleared > 0 ? combo + 1 : 0;
    const points = calculateScore(linesCleared, newCombo) + 2; // 2 pts for placing
    if (points > 2) {
      setLastScore(points);
      setTimeout(() => setLastScore(null), 800);
    }
    onScore(points);
    setCombo(newCombo);

    // Remove used piece
    const newPieces = pieces.filter((_, i) => i !== selectedPiece);
    setSelectedPiece(null);
    setHoverCell(null);

    // Refill pieces if all used
    if (newPieces.length === 0) {
      setPieces(generatePieces());
    } else {
      setPieces(newPieces);
    }

    setGrid(clearedGrid);
  }, [disabled, gameOver, selectedPiece, pieces, grid, combo, onScore]);

  const getPreviewCells = (): Set<string> => {
    if (selectedPiece === null || !hoverCell) return new Set();
    const piece = pieces[selectedPiece];
    if (!piece || !canPlacePiece(grid, piece, hoverCell.row, hoverCell.col)) return new Set();
    const cells = new Set<string>();
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c]) cells.add(`${hoverCell.row + r}-${hoverCell.col + c}`);
      }
    }
    return cells;
  };

  const previewCells = getPreviewCells();
  const selectedPieceData = selectedPiece !== null ? pieces[selectedPiece] : null;

  const handleRestart = () => {
    setGrid(createEmptyGrid());
    setPieces(generatePieces());
    setSelectedPiece(null);
    setCombo(0);
    setGameOver(false);
    setLastScore(null);
  };

  return (
    <div className="w-full max-w-sm flex flex-col items-center gap-4">
      {/* Combo indicator */}
      <div className="flex items-center gap-3 h-6">
        {combo > 0 && (
          <motion.span
            key={combo}
            initial={{ scale: 2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-arcade text-xs text-accent"
          >
            🔥 COMBO x{combo}
          </motion.span>
        )}
        <AnimatePresence>
          {lastScore && (
            <motion.span
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: -20, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="font-arcade text-xs text-primary"
            >
              +{lastScore}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Grid */}
      <div
        className="grid gap-[2px] p-2 bg-card rounded-xl border border-border"
        style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
      >
        {Array.from({ length: GRID_SIZE }).map((_, row) =>
          Array.from({ length: GRID_SIZE }).map((_, col) => {
            const cellKey = `${row}-${col}`;
            const cellColor = grid[row][col];
            const isPreview = previewCells.has(cellKey);
            const isClearing = clearingCells.has(cellKey);

            return (
              <motion.button
                key={cellKey}
                onClick={() => handleCellClick(row, col)}
                onMouseEnter={() => setHoverCell({ row, col })}
                onTouchStart={() => setHoverCell({ row, col })}
                animate={isClearing ? { scale: [1, 1.2, 0], opacity: [1, 1, 0] } : {}}
                transition={{ duration: 0.3 }}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-sm transition-all duration-100 border ${
                  cellColor
                    ? `${cellColor} border-white/10`
                    : isPreview
                      ? `${selectedPieceData?.color || 'bg-primary'} opacity-40 border-white/20`
                      : 'bg-muted/40 border-transparent hover:bg-muted/60'
                }`}
              />
            );
          })
        )}
      </div>

      {/* Pieces tray */}
      <div className="flex items-end justify-center gap-4 min-h-[80px]">
        {pieces.map((piece, i) => (
          <motion.button
            key={piece.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: selectedPiece === i ? 1.1 : 1, opacity: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelectPiece(i)}
            className={`p-2 rounded-lg border-2 transition-colors ${
              selectedPiece === i
                ? 'border-primary bg-primary/10 shadow-[0_0_15px_hsl(160_100%_50%/0.3)]'
                : 'border-border bg-card hover:border-muted-foreground/30'
            }`}
          >
            <div
              className="grid gap-[2px]"
              style={{ gridTemplateColumns: `repeat(${piece.shape[0].length}, 1fr)` }}
            >
              {piece.shape.flat().map((filled, j) => (
                <div
                  key={j}
                  className={`w-4 h-4 rounded-[2px] ${
                    filled ? piece.color : 'bg-transparent'
                  }`}
                />
              ))}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Instructions */}
      <p className="text-[10px] text-muted-foreground text-center">
        {selectedPiece !== null ? 'Tap grid to place block' : 'Select a block below, then tap grid to place'}
      </p>

      {/* Game Over overlay */}
      <AnimatePresence>
        {gameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-background/85 backdrop-blur-sm z-20 rounded-xl"
          >
            <p className="font-arcade text-lg text-destructive mb-2">GAME OVER</p>
            <p className="text-sm text-muted-foreground mb-4">No more moves!</p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleRestart}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-arcade text-xs"
            >
              PLAY AGAIN
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlockBlastGame;
