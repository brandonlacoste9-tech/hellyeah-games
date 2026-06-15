import 'dotenv/config';
import { gamesData } from '../src/data/games.js';
import { newsData } from '../../digital-newspaper/src/data/news.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || null;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const generateHellYeahPost = () => {
  const HYPE_MESSAGES = [
    "🔥 Can you beat the high score? Play [TITLE] right now on Hell Yeah Games!",
    "🚨 New obsession unlocked! Dive into [TITLE] for free right here:",
    "🎮 Looking for something new to play? Check out [TITLE]. First 1.5 hours are entirely on us!",
    "⚡ Start your weekend right. Play [TITLE] instantly in your browser right now:",
    "🏆 Only 1% of players can master [TITLE]. Are you one of them? Prove it here:"
  ];
  
  const randomGame = gamesData[Math.floor(Math.random() * gamesData.length)];
  const randomHype = HYPE_MESSAGES[Math.floor(Math.random() * HYPE_MESSAGES.length)];
  const content = randomHype.replace('[TITLE]', `**${randomGame.title}**`);
  const link = `https://hellyeah-games-inc.com/game/${randomGame.id}`;

  return {
    content: `${content}\n\n👉 Play now: ${link}`,
    embeds: [
      {
        title: randomGame.title,
        description: randomGame.description.substring(0, 200) + '...',
        url: link,
        color: 16744960, // Orange
        image: { url: randomGame.coverUrl }
      }
    ]
  };
};

const generateArcadePost = () => {
  const ARCADE_MESSAGES = [
    "💎 Ready for the premium experience? Play [TITLE] AD-FREE on The Arcade!",
    "🕹️ No ads. No interruptions. Experience [TITLE] the way it was meant to be played.",
    "🚀 Unlock [TITLE] instantly with an Arcade Subscription. Join the elite today!",
    "⚡ Seamless, uninterrupted gaming. Drop into [TITLE] instantly on The Arcade."
  ];

  const randomGame = gamesData[Math.floor(Math.random() * gamesData.length)];
  const randomHype = ARCADE_MESSAGES[Math.floor(Math.random() * ARCADE_MESSAGES.length)];
  const content = randomHype.replace('[TITLE]', `**${randomGame.title}**`);
  const link = `https://hellyeah-games.com/play/${randomGame.id}`;

  return {
    content: `${content}\n\n👉 Experience Premium: ${link}`,
    embeds: [
      {
        title: randomGame.title,
        description: randomGame.description.substring(0, 200) + '...',
        url: link,
        color: 65416, // Cyborg Neon Green
        image: { url: randomGame.coverUrl }
      }
    ]
  };
};

const generateHackerMediaPost = () => {
  const NEWS_MESSAGES = [
    "📰 BREAKING: [TITLE]",
    "💻 TECH UPDATE: Did you catch this? [TITLE]",
    "🔍 DEEP DIVE: [TITLE]. Read the full report on Hacker Media.",
    "🌐 LATEST FROM THE WIRE: [TITLE]"
  ];

  const randomNews = newsData[Math.floor(Math.random() * newsData.length)];
  const randomHype = NEWS_MESSAGES[Math.floor(Math.random() * NEWS_MESSAGES.length)];
  const content = randomHype.replace('[TITLE]', `**${randomNews.title}**`);
  const link = `https://www.hackermedia.ca/article/${randomNews.id}`;

  // Fix image URL if it's a relative asset URL
  let imageUrl = randomNews.imageUrl;
  if (imageUrl && imageUrl.startsWith('/')) {
    imageUrl = `https://www.hackermedia.ca${imageUrl}`;
  }

  return {
    content: `${content}\n\n👉 Read More: ${link}`,
    embeds: [
      {
        title: randomNews.title,
        description: randomNews.summary,
        url: link,
        color: 15088198, // Hacker Media Red
        image: { url: imageUrl }
      }
    ]
  };
};

const postToDiscord = async (postData) => {
  if (!DISCORD_WEBHOOK_URL) {
    console.log("=========================================");
    console.log("[SIMULATED EMPIRE BOT POST]");
    console.log(postData.content);
    console.log(`EMBED COLOR: ${postData.embeds[0].color}`);
    console.log(`IMAGE URL: ${postData.embeds[0].image?.url}`);
    console.log("=========================================\n");
    return;
  }

  try {
    const res = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    });

    if (res.ok) {
      console.log(`[BOT] Successfully broadcasted to Discord: ${postData.embeds[0].title}`);
    } else {
      console.error(`[BOT] Failed to post: ${res.statusText}`);
    }
  } catch (err) {
    console.error(`[BOT] Error posting to Discord:`, err);
  }
};

const runBot = async () => {
  console.log("🚀 EMPIRE MARKETING BOT STARTED!");
  
  if (process.argv.includes('--test')) {
    console.log("Running test burst for all platforms...");
    await postToDiscord(generateHellYeahPost());
    await sleep(2000);
    await postToDiscord(generateArcadePost());
    await sleep(2000);
    await postToDiscord(generateHackerMediaPost());
    return;
  }

  const INTERVAL_MS = 4 * 60 * 60 * 1000;
  console.log(`Bot will randomly promote a platform every 4 hours.`);
  
  while (true) {
    const choice = Math.floor(Math.random() * 3);
    let post;
    
    if (choice === 0) post = generateHellYeahPost();
    else if (choice === 1) post = generateArcadePost();
    else post = generateHackerMediaPost();

    await postToDiscord(post);
    await sleep(INTERVAL_MS);
  }
};

runBot();
