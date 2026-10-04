const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function buildBlackAssets() {
  const inputPath = 'C:/Users/ADMIN/.gemini/antigravity/brain/6b999076-82fd-4b2c-9fe3-ba04315414a8/.user_uploaded/media_1790245972501.jpg';
  const { data, info } = await sharp(inputPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  
  const blackData = Buffer.alloc(data.length);
  const whiteData = Buffer.alloc(data.length);
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i+1], b = data[i+2];
    const bri = (r * 0.299 + g * 0.587 + b * 0.114);
    
    let alpha = 0;
    if (bri <= 75) {
      alpha = 0;
    } else if (bri >= 165) {
      alpha = 255;
    } else {
      alpha = Math.round(((bri - 75) / (165 - 75)) * 255);
    }
    
    // Pure black #000000
    blackData[i] = 0;
    blackData[i+1] = 0;
    blackData[i+2] = 0;
    blackData[i+3] = alpha;

    // Pure white #FFFFFF
    whiteData[i] = 255;
    whiteData[i+1] = 255;
    whiteData[i+2] = 255;
    whiteData[i+3] = alpha;
  }
  
  // 1. Black trimmed and centered
  const blackTrimmedBuf = await sharp(blackData, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .trim()
    .toBuffer();
    
  // Center trimmed image in a 1024x1024 square with 5% padding
  const blackResized = await sharp(blackTrimmedBuf)
    .resize(920, 920, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  const blackFinal = await sharp({
    create: { width: 1024, height: 1024, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
  })
    .composite([{ input: blackResized, gravity: 'centre' }])
    .png()
    .toBuffer();

  // 2. White trimmed and centered
  const whiteTrimmedBuf = await sharp(whiteData, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .trim()
    .toBuffer();
    
  const whiteResized = await sharp(whiteTrimmedBuf)
    .resize(920, 920, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  const whiteFinal = await sharp({
    create: { width: 1024, height: 1024, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
  })
    .composite([{ input: whiteResized, gravity: 'centre' }])
    .png()
    .toBuffer();

  // Save black & white master files
  fs.writeFileSync('public/argila-logo-black.png', blackFinal);
  fs.writeFileSync('public/argila-logo-white.png', whiteFinal);
  fs.writeFileSync('public/argila-logo-transparent.png', blackFinal);
  fs.writeFileSync('public/layer5-logo-black-trimmed.png', blackFinal);
  fs.writeFileSync('public/layer5-logo-white-trimmed.png', whiteFinal);

  // Favicons
  await sharp(blackFinal)
    .resize(512, 512)
    .png()
    .toFile('public/icon.png');
  fs.copyFileSync('public/icon.png', 'src/app/icon.png');

  await sharp(blackFinal)
    .resize(32, 32)
    .png()
    .toFile('public/favicon-32x32.png');

  await sharp(blackFinal)
    .resize(48, 48)
    .toFile('public/favicon.ico');
  fs.copyFileSync('public/favicon.ico', 'src/app/favicon.ico');

  // Apple touch icon (with warm paper background)
  const appleTouchBg = await sharp({
    create: { width: 180, height: 180, channels: 4, background: { r: 246, g: 243, b: 236, alpha: 1 } }
  }).png().toBuffer();
  const appleTouchShield = await sharp(blackFinal).resize(140, 140, { fit: 'contain' }).toBuffer();
  await sharp(appleTouchBg)
    .composite([{ input: appleTouchShield, gravity: 'centre' }])
    .png()
    .toFile('public/apple-touch-icon.png');

  // SVG favicon
  const b32 = fs.readFileSync('public/favicon-32x32.png').toString('base64');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <image href="data:image/png;base64,${b32}" width="64" height="64"/>
</svg>`;
  fs.writeFileSync('public/favicon.svg', svg);

  // Clean up test file
  if (fs.existsSync('public/test-black.png')) {
    fs.unlinkSync('public/test-black.png');
  }

  console.log('Successfully generated all black logo & favicon assets!');
}

buildBlackAssets().catch(console.error);
