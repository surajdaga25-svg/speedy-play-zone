import { getRandomMeme, FUNNY_CAPTIONS } from './memes';

const NOTIF_STORAGE_KEY = 'memeblast_bg_notifications';

export interface BgNotifSettings {
  enabled: boolean;
  intervalMinutes: number;
}

export function getBgSettings(): BgNotifSettings {
  try {
    const stored = localStorage.getItem(NOTIF_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { enabled: false, intervalMinutes: 5 };
}

export function saveBgSettings(settings: BgNotifSettings) {
  localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(settings));
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function sendMemeNotification() {
  if (Notification.permission !== 'granted') return;
  const meme = getRandomMeme();
  const emojis = ['😂', '💀', '🤣', '🔥', '🤡', '👀', '⚡', '🎉', '🍕', '🐸'];
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];

  const notification = new Notification(`${emoji} MemeBlast`, {
    body: meme.caption,
    icon: '/placeholder.svg',
    badge: '/placeholder.svg',
    tag: `meme-${Date.now()}`,
    silent: false,
  } as NotificationOptions);

  notification.onclick = () => {
    window.focus();
    notification.close();
  };

  // Auto-close after 8 seconds
  setTimeout(() => notification.close(), 8000);
}

let bgIntervalId: number | null = null;

export function startBackgroundMemes(intervalMinutes: number) {
  stopBackgroundMemes();
  // Send one immediately
  sendMemeNotification();
  bgIntervalId = window.setInterval(() => {
    sendMemeNotification();
  }, intervalMinutes * 60 * 1000);
}

export function stopBackgroundMemes() {
  if (bgIntervalId !== null) {
    clearInterval(bgIntervalId);
    bgIntervalId = null;
  }
}
