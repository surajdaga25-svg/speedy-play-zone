import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const EMOJIS = ['👍', '😂', '🔥', '😤', '💀', '🎉', '👀', '😎', '🤯', '💪', '😭', '⚡'];

const EmojiChat = () => {
  const [open, setOpen] = useState(false);
  const [sentEmoji, setSentEmoji] = useState<string | null>(null);

  const send = (emoji: string) => {
    setSentEmoji(emoji);
    setTimeout(() => setSentEmoji(null), 1500);
    setOpen(false);
  };

  return (
    <div className="relative px-4 py-3 border-t border-border bg-card/50">
      <AnimatePresence>
        {sentEmoji && (
          <motion.div
            initial={{ y: 0, opacity: 1, scale: 1 }}
            animate={{ y: -80, opacity: 0, scale: 2 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 text-4xl pointer-events-none"
          >
            {sentEmoji}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-0 right-0 p-3 bg-card border border-border rounded-t-xl"
          >
            <div className="grid grid-cols-6 gap-2">
              {EMOJIS.map(e => (
                <button
                  key={e}
                  onClick={() => send(e)}
                  className="text-2xl hover:scale-125 transition-transform p-1"
                >
                  {e}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground transition-colors">
        <MessageCircle className="w-4 h-4" />
        <span>Send emoji</span>
      </button>
    </div>
  );
};

export default EmojiChat;
