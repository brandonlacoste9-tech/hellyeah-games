import 'dotenv/config';
import { TwitterApi } from 'twitter-api-v2';
import { gamesData } from '../src/data/games.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Requires Twitter API keys to be set in your .env file
const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

const rwClient = client.readWrite;

const BASE_URL = 'https://hellyeah-games.com';

const HYPE_MESSAGES = [
  "🚀 Can you beat the high score? Play [TITLE] right now on Hell Yeah Games!",
  "🔥 New obsession unlocked! Dive into [TITLE] for free right here:",
  "🎮 Looking for something new to play? Check out [TITLE]. First 1.5 hours are entirely on us!",
  "⚡ Start your weekend right. Play [TITLE] instantly in your browser right now:",
  "🎯 Only 1% of players can master [TITLE]. Are you one of them? Prove it here:"
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const generateMarketingPost = () => {
  // Pick a random game
  const randomGame = gamesData[Math.floor(Math.random() * gamesData.length)];
  
  // Pick a random hype message
  const randomHype = HYPE_MESSAGES[Math.floor(Math.random() * HYPE_MESSAGES.length)];
  const content = randomHype.replace('[TITLE]', `${randomGame.title}`);
  const link = `${BASE_URL}/game/${randomGame.id}`;

  const hashtags = "#FreeGames #BrowserGames #IndieGames #HellYeahGames";

  return `${content}\n\n👉 Play now: ${link}\n\n${hashtags}`;
};

async function runBot() {
  console.log('🐦 Hell Yeah Games Twitter Bot initialized...');
  
  if (!process.env.TWITTER_API_KEY || !process.env.TWITTER_ACCESS_TOKEN) {
    console.error('❌ ERROR: Twitter API keys are missing in .env');
    console.error('You need: TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET');
    return;
  }

  while (true) {
    try {
      const tweetText = generateMarketingPost();
      console.log(`\n📝 Attempting to post Tweet:\n${tweetText}\n`);
      
      const promoVideoPath = path.join(__dirname, 'promo.mp4');
      const promoImagePath = path.join(__dirname, 'promo.png');
      let mediaId = null;

      try {
        if (fs.existsSync(promoVideoPath)) {
          console.log('🎥 Uploading promo video (this might take a few seconds)...');
          mediaId = await client.v1.uploadMedia(promoVideoPath);
        } else if (fs.existsSync(promoImagePath)) {
          console.log('🖼️ Uploading promo image...');
          mediaId = await client.v1.uploadMedia(promoImagePath);
        }
      } catch (mediaError) {
        console.error('⚠️ Failed to upload media, falling back to text-only:', mediaError.message);
      }

      const tweetPayload = { text: tweetText };
      if (mediaId) {
        tweetPayload.media = { media_ids: [mediaId] };
      }
      
      const { data: createdTweet } = await rwClient.v2.tweet(tweetPayload);
      
      console.log(`✅ Successfully posted Tweet! ID: ${createdTweet.id}`);
    } catch (error) {
      console.error('❌ Failed to post Tweet:', error.message || error);
    }

    console.log('⏳ Waiting 4 hours before the next tweet...');
    // 4 hours = 4 * 60 * 60 * 1000 = 14400000 ms
    await sleep(14400000);
  }
}

// Start the bot
runBot();
