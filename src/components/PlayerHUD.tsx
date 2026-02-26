import { usePlayer } from '@/context/PlayerContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const PlayerHUD = () => {
  const { player } = usePlayer();
  const navigate = useNavigate();
  const location = useLocation();

  if (!player || location.pathname === '/') return null;

  return (
    <motion.div
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 bg-card/90 backdrop-blur-md border-b border-border"
    >
      <button onClick={() => navigate('/lobby')} className="flex items-center gap-2">
        <span className="text-2xl">{player.avatar}</span>
        <div className="text-left">
          <p className="text-xs font-arcade text-primary">{player.name}</p>
          <p className="text-[10px] text-muted-foreground">LVL {player.level}</p>
        </div>
      </button>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 bg-muted px-3 py-1 rounded-full">
          <span className="text-sm">🪙</span>
          <span className="text-xs font-bold text-coin">{player.coins}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-muted px-3 py-1 rounded-full">
          <span className="text-sm">🔥</span>
          <span className="text-xs font-bold text-accent">{player.streak}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default PlayerHUD;
