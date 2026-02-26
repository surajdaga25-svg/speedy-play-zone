import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

const WORDS = ['PIXEL', 'CLASH', 'STORM', 'BLAZE', 'FLASH', 'GHOST', 'CROWN', 'TURBO', 'CYBER', 'GLITCH', 'BRAVE', 'QUEST', 'RAPID', 'POWER', 'BOOST'];

const scramble = (word: string) => {
  const arr = word.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('') === word ? scramble(word) : arr.join('');
};

interface Props {
  onScore: (points: number) => void;
  disabled: boolean;
}

const ScrambleGame = ({ onScore, disabled }: Props) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [shuffledWords] = useState(() => [...WORDS].sort(() => Math.random() - 0.5));
  const [scrambled, setScrambled] = useState('');
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const currentWord = shuffledWords[wordIndex % shuffledWords.length];

  useEffect(() => {
    setScrambled(scramble(currentWord));
    setInput('');
    setFeedback(null);
  }, [wordIndex, currentWord]);

  const handleSubmit = useCallback(() => {
    if (disabled || !input.trim()) return;
    if (input.toUpperCase().trim() === currentWord) {
      setFeedback('correct');
      onScore(30);
      setTimeout(() => setWordIndex(i => i + 1), 600);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 500);
    }
  }, [input, currentWord, disabled, onScore]);

  return (
    <div className="w-full max-w-sm text-center">
      <p className="text-xs text-muted-foreground mb-4">Unscramble the word!</p>

      <motion.div
        key={wordIndex}
        initial={{ rotateX: 90 }}
        animate={{ rotateX: 0 }}
        className="flex justify-center gap-2 mb-8"
      >
        {scrambled.split('').map((letter, i) => (
          <motion.span
            key={i}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="w-10 h-12 flex items-center justify-center bg-card border border-primary/30 rounded-lg font-arcade text-sm text-primary"
          >
            {letter}
          </motion.span>
        ))}
      </motion.div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value.toUpperCase())}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          maxLength={currentWord.length}
          disabled={disabled}
          placeholder="Type answer..."
          className={`flex-1 bg-card border rounded-lg px-4 py-3 text-center font-arcade text-xs text-foreground outline-none focus:border-primary transition-colors ${
            feedback === 'correct' ? 'border-primary' : feedback === 'wrong' ? 'border-destructive animate-shake' : 'border-border'
          }`}
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleSubmit}
          disabled={disabled}
          className="bg-primary text-primary-foreground px-4 rounded-lg font-arcade text-xs"
        >
          GO
        </motion.button>
      </div>
      {feedback === 'correct' && (
        <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-primary font-arcade text-xs mt-3">+30 pts! ✨</motion.p>
      )}
    </div>
  );
};

export default ScrambleGame;
