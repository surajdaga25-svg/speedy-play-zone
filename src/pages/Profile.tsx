import { useNavigate } from 'react-router-dom';
import { usePlayer } from '@/context/PlayerContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit } from 'lucide-react';
import { AVATARS } from '@/lib/gameState';
import PlayerHUD from '@/components/PlayerHUD';

const Profile = () => {
  const navigate = useNavigate();
  const { player, setPlayer } = usePlayer();

  if (!player) { navigate('/'); return null; }

  const changeAvatar = (avatar: string) => {
    setPlayer({ ...player, avatar });
  };

  return (
    <div className="min-h-screen gradient-arcade pt-16 pb-8 px-4">
      <PlayerHUD />
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate('/lobby')} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-arcade text-sm text-secondary">PROFILE</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-card border-2 border-primary flex items-center justify-center text-5xl box-glow-green mb-3">
            {player.avatar}
          </div>
          <p className="font-arcade text-sm text-primary">{player.name}</p>
          <p className="text-xs text-muted-foreground mt-1">Level {player.level}</p>
        </motion.div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Coins', value: player.coins, icon: '🪙' },
            { label: 'Streak', value: player.streak, icon: '🔥' },
            { label: 'Level', value: player.level, icon: '⭐' },
          ].map(stat => (
            <div key={stat.label} className="bg-card border border-border rounded-lg p-3 text-center">
              <span className="text-xl">{stat.icon}</span>
              <p className="font-arcade text-xs text-foreground mt-1">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div>
          <p className="font-arcade text-xs text-muted-foreground mb-3">Choose Avatar</p>
          <div className="grid grid-cols-6 gap-2">
            {AVATARS.map(a => (
              <button
                key={a}
                onClick={() => changeAvatar(a)}
                className={`text-2xl p-2 rounded-lg border transition-all ${
                  player.avatar === a ? 'border-primary bg-primary/10 box-glow-green' : 'border-border hover:border-primary/30'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
