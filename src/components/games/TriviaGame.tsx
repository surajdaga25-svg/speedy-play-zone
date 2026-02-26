import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const QUESTIONS = [
  { q: "What planet is closest to the Sun?", a: ["Mercury", "Venus", "Mars", "Earth"], correct: 0 },
  { q: "How many legs does a spider have?", a: ["6", "8", "10", "4"], correct: 1 },
  { q: "What gas do plants absorb?", a: ["Oxygen", "Nitrogen", "CO2", "Helium"], correct: 2 },
  { q: "What is the largest ocean?", a: ["Atlantic", "Indian", "Arctic", "Pacific"], correct: 3 },
  { q: "How many colors in a rainbow?", a: ["5", "6", "7", "8"], correct: 2 },
  { q: "What is the hardest natural substance?", a: ["Gold", "Iron", "Diamond", "Quartz"], correct: 2 },
  { q: "Which country has the most people?", a: ["USA", "India", "China", "Brazil"], correct: 1 },
  { q: "What year did WW2 end?", a: ["1943", "1944", "1945", "1946"], correct: 2 },
  { q: "What is the smallest planet?", a: ["Mars", "Mercury", "Pluto", "Venus"], correct: 1 },
  { q: "How many bones in an adult body?", a: ["186", "206", "226", "256"], correct: 1 },
];

interface Props {
  onScore: (points: number) => void;
  disabled: boolean;
}

const TriviaGame = ({ onScore, disabled }: Props) => {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [shuffled] = useState(() => [...QUESTIONS].sort(() => Math.random() - 0.5));

  const current = shuffled[qIndex % shuffled.length];

  const handleAnswer = (idx: number) => {
    if (disabled || selected !== null) return;
    setSelected(idx);
    if (idx === current.correct) onScore(25);

    setTimeout(() => {
      setSelected(null);
      setQIndex(i => i + 1);
    }, 1000);
  };

  const getButtonStyle = (idx: number) => {
    if (selected === null) return 'bg-card border-border hover:border-primary/50';
    if (idx === current.correct) return 'bg-primary/20 border-primary';
    if (idx === selected) return 'bg-destructive/20 border-destructive';
    return 'bg-card border-border opacity-50';
  };

  return (
    <div className="w-full max-w-sm">
      <motion.div key={qIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p className="text-xs text-muted-foreground mb-2">Question {qIndex + 1}</p>
        <p className="font-body text-lg text-foreground font-semibold">{current.q}</p>
      </motion.div>
      <div className="grid grid-cols-2 gap-3">
        {current.a.map((answer, idx) => (
          <motion.button
            key={`${qIndex}-${idx}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAnswer(idx)}
            className={`p-4 rounded-lg border text-sm text-foreground transition-colors ${getButtonStyle(idx)}`}
          >
            {answer}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default TriviaGame;
