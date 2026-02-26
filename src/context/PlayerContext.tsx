import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Player, generateGuestName, AVATARS } from '@/lib/gameState';

interface PlayerContextType {
  player: Player | null;
  setPlayer: (p: Player | null) => void;
  loginAsGuest: () => void;
  addCoins: (amount: number) => void;
  isLoggedIn: boolean;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
};

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [player, setPlayer] = useState<Player | null>(null);

  const loginAsGuest = () => {
    setPlayer({
      id: crypto.randomUUID(),
      name: generateGuestName(),
      avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
      level: 1,
      coins: 100,
      streak: 0,
    });
  };

  const addCoins = (amount: number) => {
    setPlayer(prev => prev ? { ...prev, coins: prev.coins + amount } : null);
  };

  return (
    <PlayerContext.Provider value={{ player, setPlayer, loginAsGuest, isLoggedIn: !!player, addCoins }}>
      {children}
    </PlayerContext.Provider>
  );
};
