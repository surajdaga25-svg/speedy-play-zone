import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onScore: (points: number) => void;
  disabled: boolean;
}

const ReactionGame = ({ onScore, disabled }: Props) => {
  const [phase, setPhase] = useState<'wait' | 'ready' | 'go' | 'tapped' | 'early'>('wait');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const goTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const startRound = () => {
    if (disabled) return;
    setPhase('ready');
    setReactionTime(null);
    const delay = 1000 + Math.random() * 3000;
    timerRef.current = setTimeout(() => {
      goTimeRef.current = performance.now();
      setPhase('go');
    }, delay);
  };

  const handleTap = () => {
    if (disabled) return;
    if (phase === 'ready') {
      clearTimeout(timerRef.current);
      setPhase('early');
      setTimeout(() => setPhase('wait'), 1000);
    } else if (phase === 'go') {
      const rt = Math.round(performance.now() - goTimeRef.current);
      setReactionTime(rt);
      const points = Math.max(5, Math.round(50 - (rt / 10)));
      onScore(points);
      setPhase('tapped');
      setTimeout(() => setPhase('wait'), 1200);
    }
  };

  useEffect(() => {
    if (phase === 'wait' && !disabled) {
      const t = setTimeout(startRound, 500);
      return () => clearTimeout(t);
    }
  }, [phase, disabled]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const bgColor = {
    wait: 'bg-muted',
    ready: 'bg-destructive/80',
    go: 'bg-primary',
    tapped: 'bg-neon-blue',
    early: 'bg-neon-yellow/80',
  }[phase];

  const text = {
    wait: 'Get ready...',
    ready: 'WAIT FOR GREEN...',
    go: 'TAP NOW! ⚡',
    tapped: `${reactionTime}ms! +${Math.max(5, Math.round(50 - ((reactionTime || 500) / 10)))} pts`,
    early: 'Too early! 😤',
  }[phase];

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={handleTap}
      className={`w-full max-w-sm aspect-square rounded-2xl flex flex-col items-center justify-center transition-colors duration-200 ${bgColor}`}
    >
      <p className="font-arcade text-sm text-primary-foreground text-center px-4">{text}</p>
      {phase === 'wait' && (
        <p className="text-xs text-primary-foreground/60 mt-3">Tap when the box turns green</p>
      )}
    </motion.button>
  );
};

export default ReactionGame;
