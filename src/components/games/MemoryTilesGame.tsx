import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onScore: (points: number) => void;
  disabled: boolean;
}

const GRID_SIZE = 4;
const TOTAL_TILES = GRID_SIZE * GRID_SIZE;

const MemoryTilesGame = ({ onScore, disabled }: Props) => {
  const [pattern, setPattern] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [phase, setPhase] = useState<'showing' | 'input' | 'success' | 'fail'>('showing');
  const [level, setLevel] = useState(3); // start with 3 tiles to remember
  const [showingIndex, setShowingIndex] = useState(-1);
  const [streak, setStreak] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const generatePattern = useCallback((count: number) => {
    const tiles: number[] = [];
    while (tiles.length < count) {
      const t = Math.floor(Math.random() * TOTAL_TILES);
      if (!tiles.includes(t)) tiles.push(t);
    }
    return tiles;
  }, []);

  const startRound = useCallback(() => {
    if (disabled) return;
    const newPattern = generatePattern(level);
    setPattern(newPattern);
    setPlayerInput([]);
    setPhase('showing');
    setShowingIndex(-1);

    // Animate showing tiles one by one
    newPattern.forEach((_, i) => {
      setTimeout(() => setShowingIndex(i), (i + 1) * 400);
    });

    // After showing all, switch to input phase
    setTimeout(() => {
      setShowingIndex(-1);
      setPhase('input');
    }, (newPattern.length + 1) * 400);
  }, [level, disabled, generatePattern]);

  useEffect(() => {
    startRound();
    return () => clearTimeout(timeoutRef.current);
  }, [level]);

  // Auto-start first round
  useEffect(() => {
    if (!disabled) startRound();
  }, [disabled]);

  const handleTileTap = (index: number) => {
    if (disabled || phase !== 'input') return;

    const newInput = [...playerInput, index];
    setPlayerInput(newInput);

    const stepIndex = newInput.length - 1;

    if (!pattern.includes(index)) {
      // Wrong tile
      setPhase('fail');
      setStreak(0);
      const nextLevel = Math.max(3, level - 1);
      timeoutRef.current = setTimeout(() => {
        setLevel(nextLevel);
        startRound();
      }, 800);
      return;
    }

    // Check if all pattern tiles have been found
    const found = pattern.filter(t => newInput.includes(t));
    if (found.length === pattern.length) {
      // Success!
      const newStreak = streak + 1;
      setStreak(newStreak);
      const points = level * 10 + newStreak * 5;
      onScore(points);
      setPhase('success');
      timeoutRef.current = setTimeout(() => {
        setLevel(l => Math.min(l + 1, 10));
      }, 600);
    }
  };

  const isTileHighlighted = (index: number) => {
    if (phase === 'showing') {
      return pattern.slice(0, showingIndex + 1).includes(index);
    }
    if (phase === 'input') {
      return playerInput.includes(index) && pattern.includes(index);
    }
    if (phase === 'success') return pattern.includes(index);
    if (phase === 'fail') return pattern.includes(index);
    return false;
  };

  const getTileColor = (index: number) => {
    if (phase === 'fail' && pattern.includes(index) && !playerInput.includes(index)) {
      return 'bg-destructive/40 border-destructive/60';
    }
    if (phase === 'fail' && playerInput.includes(index) && !pattern.includes(index)) {
      return 'bg-destructive/60 border-destructive';
    }
    if (isTileHighlighted(index)) {
      return 'bg-primary/70 border-primary shadow-[0_0_15px_hsl(160_100%_50%/0.4)]';
    }
    return 'bg-card border-border hover:border-muted-foreground/30';
  };

  return (
    <div className="w-full max-w-xs text-center">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-muted-foreground">
          {phase === 'showing' && '👀 Watch carefully...'}
          {phase === 'input' && `Tap ${pattern.length - playerInput.filter(i => pattern.includes(i)).length} tiles`}
          {phase === 'success' && '🎉 Perfect!'}
          {phase === 'fail' && '💥 Wrong!'}
        </p>
        <div className="flex items-center gap-3">
          {streak > 0 && (
            <motion.span
              key={streak}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              className="text-xs font-arcade text-accent"
            >
              🔥{streak}
            </motion.span>
          )}
          <span className="text-xs font-arcade text-primary">LV.{level - 2}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: TOTAL_TILES }).map((_, i) => (
          <motion.button
            key={i}
            whileTap={phase === 'input' ? { scale: 0.9 } : undefined}
            onClick={() => handleTileTap(i)}
            className={`aspect-square rounded-lg border-2 transition-all duration-200 ${getTileColor(i)}`}
          />
        ))}
      </div>

      {phase === 'success' && (
        <motion.p
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-primary font-arcade text-xs mt-3"
        >
          +{level * 10 + streak * 5} pts! ✨
        </motion.p>
      )}
    </div>
  );
};

export default MemoryTilesGame;
