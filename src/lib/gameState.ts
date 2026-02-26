export interface Player {
  id: string;
  name: string;
  avatar: string;
  level: number;
  coins: number;
  streak: number;
}

export interface MatchResult {
  winner: string;
  player1Score: number;
  player2Score: number;
  game: string;
  coinsEarned: number;
}

export const AVATARS = ['🤖', '👾', '🎮', '🕹️', '👻', '🦊', '🐉', '🎃', '⚡', '🔥', '💀', '🌟'];

export const AVATAR_COLORS = [
  'from-neon-green to-neon-blue',
  'from-neon-pink to-neon-purple',
  'from-neon-yellow to-neon-green',
  'from-neon-blue to-neon-purple',
  'from-neon-pink to-neon-yellow',
  'from-accent to-secondary',
];

export const generateGuestName = () => {
  const adjectives = ['Swift', 'Shadow', 'Neon', 'Pixel', 'Turbo', 'Blazing', 'Cosmic', 'Glitch', 'Cyber', 'Quantum'];
  const nouns = ['Fox', 'Wolf', 'Hawk', 'Ninja', 'Knight', 'Storm', 'Blaze', 'Viper', 'Ghost', 'Phoenix'];
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${Math.floor(Math.random() * 99)}`;
};

export const MOCK_LEADERBOARD = [
  { name: 'PixelNinja42', level: 24, coins: 12500, wins: 189, avatar: '🤖' },
  { name: 'NeonViper7', level: 21, coins: 10200, wins: 156, avatar: '👾' },
  { name: 'TurboGhost88', level: 19, coins: 8900, wins: 134, avatar: '👻' },
  { name: 'CosmicBlaze3', level: 17, coins: 7600, wins: 112, avatar: '🔥' },
  { name: 'SwiftHawk55', level: 15, coins: 6100, wins: 98, avatar: '🦊' },
  { name: 'GlitchStorm1', level: 14, coins: 5400, wins: 87, avatar: '⚡' },
  { name: 'CyberKnight9', level: 12, coins: 4200, wins: 72, avatar: '🎮' },
  { name: 'QuantumFox66', level: 10, coins: 3100, wins: 58, avatar: '🐉' },
  { name: 'ShadowPhoenix', level: 9, coins: 2500, wins: 45, avatar: '💀' },
  { name: 'BlazeWolf22', level: 7, coins: 1800, wins: 33, avatar: '🌟' },
];
