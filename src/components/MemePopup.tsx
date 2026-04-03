import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Heart, RotateCcw } from 'lucide-react';
import { useState } from 'react';

interface MemePopupProps {
  meme: {
    id: string;
    imageUrl: string;
    caption: string;
    title: string;
  };
  position: { x: number; y: number };
  onClose: () => void;
  onNext: () => void;
}

const entryAnimations = [
  { initial: { scale: 0, rotate: -180 }, animate: { scale: 1, rotate: 0 } },
  { initial: { y: -600, rotate: 20 }, animate: { y: 0, rotate: 0 } },
  { initial: { x: -600 }, animate: { x: 0 } },
  { initial: { scale: 3, opacity: 0 }, animate: { scale: 1, opacity: 1 } },
  { initial: { y: 600, rotate: -10 }, animate: { y: 0, rotate: 0 } },
];

export default function MemePopup({ meme, position, onClose, onNext }: MemePopupProps) {
  const [liked, setLiked] = useState(false);
  const anim = entryAnimations[Math.floor(Math.random() * entryAnimations.length)];

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: meme.title, text: meme.caption, url: window.location.href });
    }
  };

  return (
    <motion.div
      key={meme.id}
      initial={anim.initial}
      animate={anim.animate}
      exit={{ scale: 0, opacity: 0, rotate: 90 }}
      transition={{ type: 'spring', damping: 15, stiffness: 200 }}
      drag
      dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
      className="fixed z-50 w-[90vw] max-w-sm rounded-2xl border-2 border-primary/50 bg-card shadow-[0_0_40px_hsl(var(--primary)/0.3)] overflow-hidden"
      style={{ left: `${position.x}%`, top: `${position.y}%`, transform: 'translate(-50%, -50%)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-primary/10 border-b border-primary/20">
        <motion.span
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-sm font-bold text-primary"
        >
          {meme.title}
        </motion.span>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-destructive/20 transition-colors">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Meme Image */}
      <div className="relative aspect-square bg-muted flex items-center justify-center overflow-hidden">
        <img
          src={meme.imageUrl}
          alt="meme"
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>

      {/* Caption */}
      <div className="px-4 py-3">
        <p className="text-sm text-foreground font-medium leading-relaxed">{meme.caption}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border">
        <button
          onClick={() => setLiked(!liked)}
          className="flex items-center gap-1.5 text-sm transition-colors"
        >
          <Heart className={`w-5 h-5 ${liked ? 'fill-accent text-accent' : 'text-muted-foreground'}`} />
          <span className={liked ? 'text-accent' : 'text-muted-foreground'}>{liked ? 'Loved!' : 'Like'}</span>
        </button>
        <button onClick={handleShare} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Share2 className="w-4 h-4" />
          Share
        </button>
        <button onClick={onNext} className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
          <RotateCcw className="w-4 h-4" />
          Next
        </button>
      </div>
    </motion.div>
  );
}
