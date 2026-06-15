import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { gamesData } from './src/data/games.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITEMAP_FILE = path.join(__dirname, 'public', 'sitemap.xml');
// Use the production domain in the sitemap for Google
const BASE_URL = 'https://hellyeah-games.com';

const generateSitemap = () => {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${BASE_URL}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/games</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/pricing</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;

  gamesData.forEach(game => {
    // Escape ampersands and special characters in URLs for valid XML
    const safeUrl = (url) => url ? url.replace(/&/g, '&amp;') : '';
    
    xml += `  <url>
    <loc>${BASE_URL}/game/${game.id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
    <image:image>
      <image:loc>${safeUrl(game.coverUrl)}</image:loc>
      <image:title>${safeUrl(game.title)}</image:title>
    </image:image>
  </url>\n`;
  });

  xml += `</urlset>`;

  fs.writeFileSync(SITEMAP_FILE, xml, 'utf8');
  console.log(`[SEO] Sitemap successfully generated with ${gamesData.length + 3} indexed URLs at ${SITEMAP_FILE}`);
};

generateSitemap();
