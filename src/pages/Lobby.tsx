import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '@/context/PlayerContext';
import { motion } from 'framer-motion';
import { Zap, Trophy, User, LogOut } from 'lucide-react';
import PlayerHUD from '@/components/PlayerHUD';
const GAMES = [
  { id: 'blockblast', name: 'Block Blast', emoji: '🧱', desc: 'Clear rows & columns!', color: 'box-glow-green border-neon-green/30' },
  { id: 'memory', name: 'Memory Tiles', emoji: '🧩', desc: 'Remember the pattern!', color: 'box-glow-purple border-neon-purple/30' },
  { id: 'reaction', name: 'Reaction Tap', emoji: '⚡', desc: 'Tap when green!', color: 'box-glow-pink border-neon-pink/30' },
  { id: 'trivia', name: 'Trivia Duel', emoji: '🧠', desc: 'Outsmart your rival', color: 'box-glow-purple border-neon-purple/30' },
  { id: 'scramble', name: 'Word Scramble', emoji: '🔤', desc: 'Unscramble fastest', color: 'box-glow-pink border-neon-pink/30' },
];

const Lobby = () => {
  const navigate = useNavigate();
  const { player, setPlayer } = usePlayer();

  useEffect(() => {
    if (!player) navigate('/');
  }, [player, navigate]);

  if (!player) return null;

  const handlePlay = (gameId: string) => {
    navigate(`/matchmaking/${gameId}`);
  };

  return (
    <div className="min-h-screen gradient-arcade pt-16 pb-8 px-4">
      <PlayerHUD />

      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h2 className="font-arcade text-lg text-primary text-glow-green mb-2">CHOOSE YOUR GAME</h2>
          <p className="text-muted-foreground text-sm">Pick a game and get matched instantly</p>
        </motion.div>

        <div className="space-y-4 mb-8">
          {GAMES.map((game, i) => (
            <motion.button
              key={game.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handlePlay(game.id)}
              className={`w-full flex items-center gap-4 p-5 rounded-xl bg-card border ${game.color} transition-all`}
            >
              <span className="text-4xl">{game.emoji}</span>
              <div className="text-left flex-1">
                <p className="font-arcade text-xs text-foreground mb-1">{game.name}</p>
                <p className="text-xs text-muted-foreground">{game.desc}</p>
              </div>
              <Zap className="w-5 h-5 text-primary" />
            </motion.button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            onClick={() => navigate('/leaderboard')}
            className="flex items-center justify-center gap-2 p-3 rounded-lg bg-card border border-border hover:border-coin/40 transition-colors"
          >
            <Trophy className="w-4 h-4 text-coin" />
            <span className="text-sm">Leaderboard</span>
          </motion.button>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={() => navigate('/profile')}
            className="flex items-center justify-center gap-2 p-3 rounded-lg bg-card border border-border hover:border-secondary/40 transition-colors"
          >
            <User className="w-4 h-4 text-secondary" />
            <span className="text-sm">Profile</span>
          </motion.button>
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={() => { setPlayer(null); navigate('/'); }}
          className="mt-6 flex items-center justify-center gap-2 mx-auto text-muted-foreground text-xs hover:text-destructive transition-colors"
        >
          <LogOut className="w-3 h-3" />
          Leave Arcade
        </motion.button>
      </div>
    </div>
  );
};

export default Lobby;
