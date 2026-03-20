const fetch = require('node-fetch');
const sharp = require('sharp');
require('dotenv').config();

const TOKEN = process.env.DISCORD_TOKEN;

// PP: Roland Garros 2025 — portrait headshot fond orange, 396x594
const PP_URL = 'https://media.gettyimages.com/id/2217140959/fr/photo/paris-france-francisco-lachowski-attends-the-2025-french-open-at-roland-garros-on-may-26-2025.jpg?s=612x612&w=0&k=20&c=A7UqesbmuximDEccb2Cqx_XLXzxviOK47tFKNTgpN3Y=';

// Banner: L'Oréal Paris défilé runway Tour Eiffel — 594x396 landscape
const BANNER_URL = 'https://media.gettyimages.com/id/1713043438/fr/photo/paris-france-francisco-lachowski-walks-the-runway-during-le-d%C3%A9fil%C3%A9-lor%C3%A9al-paris-walk-your.jpg?s=594x594&w=0&k=20&c=XLDhgsKYzMU5JpbCwoTwc799-CfzJpC1nBXx64Fuujw=';

async function downloadImage(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Referer': 'https://www.gettyimages.fr/',
    }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.buffer();
}

async function toBase64(buf) {
  return buf.toString('base64');
}

async function main() {
  console.log('Downloading profile picture...');
  const ppBuf = await downloadImage(PP_URL);

  // Roland Garros portrait (portrait 2:3 ratio) — crop carré depuis le haut pour centrer le visage
  const ppCropped = await sharp(ppBuf)
    .resize(512, 512, {
      fit: 'cover',
      position: 'top',
    })
    .png()
    .toBuffer();

  console.log('Downloading banner...');
  const bannerBuf = await downloadImage(BANNER_URL);

  // Banner: 594x396 landscape → upscale to 960x640 (Discord banner)
  const bannerCropped = await sharp(bannerBuf)
    .resize(960, 640, {
      fit: 'cover',
      position: 'centre',
    })
    .png()
    .toBuffer();

  const ppBase64 = await toBase64(ppCropped);
  const bannerBase64 = await toBase64(bannerCropped);

  console.log('Uploading to Discord...');
  const res = await fetch('https://discord.com/api/v10/users/@me', {
    method: 'PATCH',
    headers: {
      'Authorization': `Bot ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      avatar: `data:image/png;base64,${ppBase64}`,
      banner: `data:image/png;base64,${bannerBase64}`,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error('Discord error:', JSON.stringify(data, null, 2));
    process.exit(1);
  }

  console.log('✅ Avatar et bannière mis à jour !');
  console.log('Avatar hash:', data.avatar);
  console.log('Banner hash:', data.banner);
}

main().catch(err => {
  console.error('Erreur:', err);
  process.exit(1);
});
