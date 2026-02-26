import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePlayer } from '@/context/PlayerContext';
import { generateGuestName, AVATARS } from '@/lib/gameState';
import { motion, AnimatePresence } from 'framer-motion';
import PlayerHUD from '@/components/PlayerHUD';

const Matchmaking = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { player } = usePlayer();
  const [phase, setPhase] = useState<'searching' | 'found' | 'starting'>('searching');
  const [opponent, setOpponent] = useState({ name: '', avatar: '' });
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (!player) { navigate('/'); return; }

    const dotInterval = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.');
    }, 500);

    const findTimer = setTimeout(() => {
      setOpponent({
        name: generateGuestName(),
        avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
      });
      setPhase('found');
    }, 1500 + Math.random() * 1500);

    return () => { clearInterval(dotInterval); clearTimeout(findTimer); };
  }, []);

  useEffect(() => {
    if (phase === 'found') {
      const timer = setTimeout(() => setPhase('starting'), 1500);
      return () => clearTimeout(timer);
    }
    if (phase === 'starting') {
      const timer = setTimeout(() => navigate(`/game/${gameId}`, { state: { opponent } }), 800);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  return (
    <div className="min-h-screen gradient-arcade flex flex-col items-center justify-center px-4">
      <PlayerHUD />

      <AnimatePresence mode="wait">
        {phase === 'searching' && (
          <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="w-20 h-20 mx-auto mb-6 rounded-full border-4 border-primary/30 border-t-primary" />
            <p className="font-arcade text-sm text-primary text-glow-green">SEARCHING{dots}</p>
            <p className="text-muted-foreground text-sm mt-2">Finding a worthy opponent</p>
          </motion.div>
        )}
        {phase === 'found' && (
          <motion.div key="found" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
            <div className="flex items-center gap-6 mb-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-card border-2 border-primary flex items-center justify-center text-3xl">{player?.avatar}</div>
                <p className="text-xs font-arcade text-primary mt-2">{player?.name?.slice(0, 10)}</p>
              </div>
              <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.8, repeat: Infinity }} className="font-arcade text-xl text-accent text-glow-pink">VS</motion.span>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-card border-2 border-accent flex items-center justify-center text-3xl">{opponent.avatar}</div>
                <p className="text-xs font-arcade text-accent mt-2">{opponent.name.slice(0, 10)}</p>
              </div>
            </div>
            <p className="font-arcade text-xs text-neon-yellow animate-pulse-glow">OPPONENT FOUND!</p>
          </motion.div>
        )}
        {phase === 'starting' && (
          <motion.div key="start" initial={{ scale: 2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
            <p className="font-arcade text-2xl text-primary text-glow-green">GET READY!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Matchmaking;
