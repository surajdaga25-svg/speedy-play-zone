import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { usePlayer } from '@/context/PlayerContext';
import { motion, AnimatePresence } from 'framer-motion';
import ReactionGame from '@/components/games/ReactionGame';
import TriviaGame from '@/components/games/TriviaGame';
import ScrambleGame from '@/components/games/ScrambleGame';
import MemoryTilesGame from '@/components/games/MemoryTilesGame';
import EmojiChat from '@/components/EmojiChat';

const GameRoom = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { player } = usePlayer();
  const opponent = (location.state as any)?.opponent || { name: 'Opponent', avatar: '👾' };

  const [timeLeft, setTimeLeft] = useState(60);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!player) { navigate('/'); return; }
    if (timeLeft <= 0) {
      setGameOver(true);
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, player]);

  // Simulate opponent scoring
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        setOpponentScore(s => s + Math.floor(Math.random() * 15 + 5));
      }
    }, 2000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) {
      const coinsEarned = playerScore > opponentScore ? 50 : 10;
      setTimeout(() => {
        navigate('/results', {
          state: {
            playerScore,
            opponentScore,
            opponent,
            game: gameId,
            coinsEarned,
            won: playerScore > opponentScore,
          }
        });
      }, 1500);
    }
  }, [gameOver]);

  const handleScore = useCallback((points: number) => {
    if (!gameOver) setPlayerScore(s => s + points);
  }, [gameOver]);

  if (!player) return null;

  const timerColor = timeLeft <= 10 ? 'text-destructive' : timeLeft <= 20 ? 'text-neon-yellow' : 'text-primary';

  return (
    <div className="min-h-screen gradient-arcade flex flex-col">
      {/* Score bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-card/90 backdrop-blur border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-xl">{player.avatar}</span>
          <div>
            <p className="text-xs font-arcade text-primary">{playerScore}</p>
            <p className="text-[10px] text-muted-foreground">YOU</p>
          </div>
        </div>
        <motion.div
          key={timeLeft}
          initial={{ scale: timeLeft <= 10 ? 1.3 : 1 }}
          animate={{ scale: 1 }}
          className={`font-arcade text-lg ${timerColor}`}
        >
          {timeLeft}
        </motion.div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-xs font-arcade text-accent">{opponentScore}</p>
            <p className="text-[10px] text-muted-foreground">{opponent.name.slice(0, 8)}</p>
          </div>
          <span className="text-xl">{opponent.avatar}</span>
        </div>
      </div>

      {/* Timer bar */}
      <div className="h-1 bg-muted">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: '100%' }}
          animate={{ width: `${(timeLeft / 60) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Game area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
        <AnimatePresence>
          {gameOver && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10"
            >
              <p className="font-arcade text-2xl text-primary text-glow-green">TIME'S UP!</p>
            </motion.div>
          )}
        </AnimatePresence>

        {gameId === 'memory' && <MemoryTilesGame onScore={handleScore} disabled={gameOver} />}
        {gameId === 'reaction' && <ReactionGame onScore={handleScore} disabled={gameOver} />}
        {gameId === 'trivia' && <TriviaGame onScore={handleScore} disabled={gameOver} />}
        {gameId === 'scramble' && <ScrambleGame onScore={handleScore} disabled={gameOver} />}
      </div>

      {/* Emoji chat */}
      <EmojiChat />
    </div>
  );
};

export default GameRoom;
