import { useLocation, useNavigate } from 'react-router-dom';
import { usePlayer } from '@/context/PlayerContext';
import { motion } from 'framer-motion';
import { Trophy, RotateCcw, Home, Coins } from 'lucide-react';
import { useEffect } from 'react';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { player, addCoins } = usePlayer();
  const state = location.state as any;

  useEffect(() => {
    if (!state || !player) { navigate('/'); return; }
    addCoins(state.coinsEarned);
  }, []);

  if (!state || !player) return null;

  const { playerScore, opponentScore, opponent, game, coinsEarned, won } = state;

  return (
    <div className="min-h-screen gradient-arcade flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', bounce: 0.5 }}
        className="text-center mb-8"
      >
        <div className="text-6xl mb-4">{won ? '🏆' : '😔'}</div>
        <h1 className={`font-arcade text-2xl mb-2 ${won ? 'text-primary text-glow-green' : 'text-accent text-glow-pink'}`}>
          {won ? 'YOU WIN!' : 'YOU LOSE'}
        </h1>
        {playerScore === opponentScore && (
          <h1 className="font-arcade text-2xl text-neon-yellow mb-2">IT'S A TIE!</h1>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-sm bg-card rounded-xl border border-border p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="text-center flex-1">
            <span className="text-3xl">{player.avatar}</span>
            <p className="text-xs text-muted-foreground mt-1">YOU</p>
            <p className="font-arcade text-lg text-primary">{playerScore}</p>
          </div>
          <div className="font-arcade text-muted-foreground text-xs">VS</div>
          <div className="text-center flex-1">
            <span className="text-3xl">{opponent.avatar}</span>
            <p className="text-xs text-muted-foreground mt-1">{opponent.name.slice(0, 8)}</p>
            <p className="font-arcade text-lg text-accent">{opponentScore}</p>
          </div>
        </div>

        <div className="border-t border-border pt-4 flex items-center justify-center gap-2">
          <Coins className="w-5 h-5 text-coin" />
          <span className="font-arcade text-sm text-coin">+{coinsEarned} coins</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex gap-3 w-full max-w-sm"
      >
        <button
          onClick={() => navigate(`/matchmaking/${game}`)}
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-arcade text-xs py-4 rounded-lg box-glow-green"
        >
          <RotateCcw className="w-4 h-4" />
          REMATCH
        </button>
        <button
          onClick={() => navigate('/lobby')}
          className="flex-1 flex items-center justify-center gap-2 bg-card border border-border text-foreground font-arcade text-xs py-4 rounded-lg hover:border-primary/30 transition-colors"
        >
          <Home className="w-4 h-4" />
          LOBBY
        </button>
      </motion.div>
    </div>
  );
};

export default Results;
