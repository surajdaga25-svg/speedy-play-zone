import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Coins, Star } from 'lucide-react';
import { MOCK_LEADERBOARD } from '@/lib/gameState';
import PlayerHUD from '@/components/PlayerHUD';

const medals = ['🥇', '🥈', '🥉'];

const Leaderboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-arcade pt-16 pb-8 px-4">
      <PlayerHUD />
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/lobby')} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-arcade text-sm text-coin">🏆 LEADERBOARD</h1>
        </div>

        <div className="space-y-2">
          {MOCK_LEADERBOARD.map((entry, i) => (
            <motion.div
              key={entry.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                i < 3 ? 'bg-card border-coin/20' : 'bg-card/50 border-border'
              }`}
            >
              <span className="w-8 text-center font-arcade text-xs text-muted-foreground">
                {i < 3 ? medals[i] : `#${i + 1}`}
              </span>
              <span className="text-2xl">{entry.avatar}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{entry.name}</p>
                <p className="text-xs text-muted-foreground">LVL {entry.level} • {entry.wins}W</p>
              </div>
              <div className="flex items-center gap-1">
                <Coins className="w-3 h-3 text-coin" />
                <span className="text-xs font-bold text-coin">{entry.coins.toLocaleString()}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
