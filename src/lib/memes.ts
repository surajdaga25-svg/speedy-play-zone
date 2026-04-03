export interface Meme {
  id: string;
  imageUrl: string;
  caption: string;
  category: 'wholesome' | 'relatable' | 'random' | 'animal' | 'cringe';
}

// Using placeholder meme images from public APIs
export const MEME_SOURCES = [
  { url: 'https://i.imgflip.com/1bij.jpg', caption: "One does not simply stop scrolling memes" },
  { url: 'https://i.imgflip.com/26am.jpg', caption: "Y U NO laugh at this?" },
  { url: 'https://i.imgflip.com/9ehk.jpg', caption: "Not sure if funny or just sleep deprived" },
  { url: 'https://i.imgflip.com/1ur9b0.jpg', caption: "Change my mind: pineapple belongs on pizza" },
  { url: 'https://i.imgflip.com/30b1gx.jpg', caption: "Am I a joke to you?" },
  { url: 'https://i.imgflip.com/1g8my4.jpg', caption: "But that's none of my business" },
  { url: 'https://i.imgflip.com/1otk96.jpg', caption: "Roll Safe: Can't have bugs if you don't write code" },
  { url: 'https://i.imgflip.com/21uy0f.jpg', caption: "Distracted by this meme app" },
  { url: 'https://i.imgflip.com/2wifvo.jpg', caption: "Wait, it's all memes? Always has been" },
  { url: 'https://i.imgflip.com/22bdq6.jpg', caption: "Left: work | Right: this app" },
];

export const FUNNY_CAPTIONS = [
  "POV: You opened this app instead of being productive 💀",
  "Your boss is watching... jk here's a meme 😂",
  "Breaking news: You're still scrolling 📰",
  "This meme found you. You didn't find it. 🎯",
  "Roses are red, violets are blue, here's a random meme just for you 🌹",
  "Alert: Your daily dose of serotonin has arrived 💊",
  "Emergency meme deployment activated 🚨",
  "You've been hit by a smooth meme-inal 🕺",
  "Plot twist: The meme was inside you all along 🧠",
  "Scientists confirm: This meme is 100% organic 🌿",
  "Warning: Side effects may include uncontrollable laughter 😂",
  "This meme is brought to you by procrastination™",
  "Fun fact: You blinked while reading this. Or did you? 👁️",
  "The Wi-Fi password is: LOL_NICE_TRY 📶",
  "Error 404: Productivity not found 🖥️",
  "Your phone called. It said you need more memes 📱",
  "Congratulations! You're the 1,000,000th meme viewer! 🎉",
  "This meme has been aged 3 seconds for maximum freshness 🧀",
  "Local person stares at phone, giggles. More at 11 📺",
  "Mom said it's my turn to show you a meme 👶",
];

export const POPUP_TITLES = [
  "🚨 MEME ALERT",
  "😂 INCOMING",
  "🔥 HOT MEME",
  "💀 DEAD 💀",
  "🎉 SURPRISE",
  "⚡ ZAP",
  "🤡 HONK",
  "👀 LOOK",
  "🍕 PIZZA TIME",
  "🐸 WEDNESDAY",
];

export function getRandomMeme() {
  const source = MEME_SOURCES[Math.floor(Math.random() * MEME_SOURCES.length)];
  const caption = FUNNY_CAPTIONS[Math.floor(Math.random() * FUNNY_CAPTIONS.length)];
  const title = POPUP_TITLES[Math.floor(Math.random() * POPUP_TITLES.length)];
  return { ...source, caption, title, id: crypto.randomUUID() };
}
