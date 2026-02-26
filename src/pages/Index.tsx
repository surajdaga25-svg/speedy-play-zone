import { useNavigate } from 'react-router-dom';
import { usePlayer } from '@/context/PlayerContext';
import { motion } from 'framer-motion';
import { Zap, Trophy, Users, Gamepad2 } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { loginAsGuest, isLoggedIn } = usePlayer();

  const handlePlay = () => {
    if (!isLoggedIn) loginAsGuest();
    navigate('/lobby');
  };

  return (
    <div className="min-h-screen gradient-arcade flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 scanline pointer-events-none" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-neon-green/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-neon-pink/5 rounded-full blur-[100px]" />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center z-10 max-w-lg"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <h1 className="font-arcade text-3xl sm:text-4xl text-primary text-glow-green mb-2">
            QUICK
          </h1>
          <h1 className="font-arcade text-3xl sm:text-4xl text-accent text-glow-pink mb-6">
            CLASH
          </h1>
        </motion.div>

        <p className="text-muted-foreground text-lg mb-10">
          Instant 1v1 mini-games against strangers.<br />
          60 seconds. No mercy.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePlay}
          className="bg-primary text-primary-foreground font-arcade text-sm px-10 py-4 rounded-lg box-glow-green hover:brightness-110 transition-all mb-8"
        >
          ⚡ PLAY NOW
        </motion.button>

        <div className="grid grid-cols-3 gap-4 mt-8">
          {[
            { icon: Zap, label: '60s Rounds', color: 'text-neon-yellow' },
            { icon: Users, label: 'Instant Match', color: 'text-neon-blue' },
            { icon: Trophy, label: 'Win Coins', color: 'text-coin' },
          ].map(({ icon: Icon, label, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.15 }}
              className="flex flex-col items-center gap-2 bg-card/50 p-4 rounded-lg border border-border"
            >
              <Icon className={`w-6 h-6 ${color}`} />
              <span className="text-xs text-muted-foreground">{label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 flex items-center gap-2 text-muted-foreground text-xs"
      >
        <Gamepad2 className="w-4 h-4" />
        <span>3 mini-games • Leaderboards • Daily rewards</span>
      </motion.div>
    </div>
  );
};

export default Index;
