import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Settings, Volume2, VolumeX } from 'lucide-react';
import MemePopup from '@/components/MemePopup';
import { getRandomMeme } from '@/lib/memes';

type ActiveMeme = ReturnType<typeof getRandomMeme> & { x: number; y: number };

export default function MemeHome() {
  const [memes, setMemes] = useState<ActiveMeme[]>([]);
  const [autoMode, setAutoMode] = useState(false);
  const [interval, setIntervalTime] = useState(5); // seconds
  const [totalSeen, setTotalSeen] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  const spawnMeme = useCallback(() => {
    const m = getRandomMeme();
    const x = 20 + Math.random() * 60;
    const y = 20 + Math.random() * 50;
    setMemes(prev => [...prev.slice(-4), { ...m, x, y }]); // max 5 popups
    setTotalSeen(p => p + 1);
  }, []);

  const removeMeme = (id: string) => {
    setMemes(prev => prev.filter(m => m.id !== id));
  };

  const replaceWithNext = (id: string) => {
    removeMeme(id);
    setTimeout(spawnMeme, 200);
  };

  // Auto mode
  useEffect(() => {
    if (!autoMode) return;
    const id = window.setInterval(spawnMeme, interval * 1000);
    return () => clearInterval(id);
  }, [autoMode, interval, spawnMeme]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* Animated background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 100, -50, 0], y: [0, -80, 60, 0] }}
          transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -80, 60, 0], y: [0, 100, -50, 0] }}
          transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/5 blur-3xl"
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 py-4 sm:px-8">
        <div className="flex items-center gap-2">
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-3xl"
          >
            😂
          </motion.span>
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            MemeBlast
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {totalSeen} seen
          </span>
          <button
            onClick={() => setSoundOn(!soundOn)}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-muted-foreground" /> : <VolumeX className="w-4 h-4 text-muted-foreground" />}
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <Settings className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </header>

      {/* Settings panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative z-20 mx-4 sm:mx-8 mb-4 p-4 rounded-xl bg-card border border-border"
          >
            <h3 className="text-sm font-semibold text-foreground mb-3">⚙️ Popup Settings</h3>
            <div className="flex flex-col gap-3">
              <label className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Auto-popup mode</span>
                <button
                  onClick={() => setAutoMode(!autoMode)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${autoMode ? 'bg-primary' : 'bg-muted'}`}
                >
                  <motion.div
                    animate={{ x: autoMode ? 24 : 2 }}
                    className="absolute top-1 w-4 h-4 rounded-full bg-foreground"
                  />
                </button>
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Interval: {interval}s</span>
                <input
                  type="range"
                  min={2}
                  max={30}
                  value={interval}
                  onChange={(e) => setIntervalTime(Number(e.target.value))}
                  className="w-32 accent-primary"
                />
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center CTA */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="text-center"
        >
          <p className="text-6xl sm:text-8xl mb-4">🤡</p>
          <h2 className="text-2xl sm:text-4xl font-bold text-foreground mb-2">
            Ready for chaos?
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-md">
            Tap the button to unleash random meme popups. Turn on auto-mode for maximum chaos. You've been warned.
          </p>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={spawnMeme}
          className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold text-lg shadow-[0_0_30px_hsl(var(--primary)/0.4)] hover:shadow-[0_0_50px_hsl(var(--primary)/0.6)] transition-shadow"
        >
          <Zap className="w-6 h-6" />
          GIMME A MEME
        </motion.button>

        {autoMode && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-xs text-accent font-semibold"
          >
            🔴 AUTO-MODE ACTIVE — Memes incoming every {interval}s
          </motion.p>
        )}
      </div>

      {/* Meme Popups */}
      <AnimatePresence>
        {memes.map((meme) => (
          <MemePopup
            key={meme.id}
            meme={meme}
            position={{ x: meme.x, y: meme.y }}
            onClose={() => removeMeme(meme.id)}
            onNext={() => replaceWithNext(meme.id)}
          />
        ))}
      </AnimatePresence>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 text-xs text-muted-foreground">
        Made with 😂 and questionable life choices
      </footer>
    </div>
  );
}
