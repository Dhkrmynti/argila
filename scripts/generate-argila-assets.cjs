// Renders the Argila vessel mark into every logo, favicon and OG image in /public.
// Run with: node scripts/generate-argila-assets.cjs
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const PUB = path.join(__dirname, "..", "public");
const APP = path.join(__dirname, "..", "src", "app");

const INK = "#120E0B";
const INK_2 = "#1B1612";
const PAPER = "#F4ECDF";
const PAPER_DIM = "#BDAF9B";
const TERRA = "#D2693C";

// The vessel: flared lip, narrow neck, full shoulder, a foot. Two glaze bands
// are cut out of the body so it still reads at 16px.
const VESSEL =
  "M35 10H65V15Q59.5 16 59.5 21.5V26C59.5 31 83 38.5 83 59C83 75 71.5 84.5 64 89H36C28.5 84.5 17 75 17 59C17 38.5 40.5 31 40.5 26V21.5Q40.5 16 35 15Z";
const BANDS = '<rect x="10" y="50" width="80" height="4.5"/><rect x="10" y="62" width="80" height="4.5"/>';

const mark = (fill, size = 100) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}">
  <defs><mask id="m"><rect width="100" height="100" fill="#fff"/><g fill="#000">${BANDS}</g></mask></defs>
  <path d="${VESSEL}" fill="${fill}" mask="url(#m)"/>
</svg>`;

// Square app icon: the mark on the kiln field
const icon = (size) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}">
  <defs><mask id="m"><rect width="100" height="100" fill="#fff"/><g fill="#000">${BANDS}</g></mask></defs>
  <rect width="100" height="100" fill="${INK}"/>
  <g transform="translate(14 14) scale(0.72)"><path d="${VESSEL}" fill="${TERRA}" mask="url(#m)"/></g>
</svg>`;

const og = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <radialGradient id="glow" cx="50%" cy="40%" r="45%">
      <stop offset="0" stop-color="${TERRA}" stop-opacity="0.22"/>
      <stop offset="1" stop-color="${TERRA}" stop-opacity="0"/>
    </radialGradient>
    <mask id="m"><rect width="100" height="100" fill="#fff"/><g fill="#000">${BANDS}</g></mask>
  </defs>
  <rect width="1200" height="630" fill="${INK}"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <g fill="none" stroke="${TERRA}" stroke-opacity="0.35">
    <ellipse cx="600" cy="250" rx="230" ry="230"/>
    <ellipse cx="600" cy="250" rx="200" ry="200" stroke-opacity="0.2"/>
  </g>
  <circle cx="600" cy="250" r="150" fill="${INK_2}"/>
  <g transform="translate(510 160) scale(1.8)"><path d="${VESSEL}" fill="${TERRA}" mask="url(#m)"/></g>
  <text x="600" y="545" text-anchor="middle" fill="${PAPER}" font-family="Arial Black, Arial, Helvetica, sans-serif" font-weight="900" font-size="78" letter-spacing="16">ARGILA</text>
  <text x="600" y="592" text-anchor="middle" fill="${PAPER_DIM}" font-family="Consolas, Menlo, monospace" font-size="22">Staking on Robinhood Chain</text>
</svg>`;

const png = (svg, out) => sharp(Buffer.from(svg)).png().toFile(out);

async function run() {
  await png(mark(TERRA, 512), path.join(PUB, "argila-logo-terra.png"));
  await png(mark(INK, 512), path.join(PUB, "argila-logo-ink.png"));
  await png(mark(PAPER, 512), path.join(PUB, "argila-logo-paper.png"));
  fs.writeFileSync(path.join(PUB, "argila-mark.svg"), mark(TERRA));

  await png(icon(32), path.join(PUB, "argila-icon-32.png"));
  await png(icon(512), path.join(PUB, "argila-icon-512.png"));
  await png(icon(180), path.join(PUB, "argila-apple-touch.png"));

  // Legacy favicon paths still requested by browsers and older metadata
  await png(icon(32), path.join(PUB, "favicon-32x32.png"));
  await png(icon(180), path.join(PUB, "apple-touch-icon.png"));
  await png(icon(192), path.join(PUB, "icon.png"));
  await png(icon(64), path.join(APP, "icon.png"));
  fs.copyFileSync(path.join(PUB, "favicon-32x32.png"), path.join(PUB, "favicon.ico"));
  if (fs.existsSync(path.join(APP, "favicon.ico"))) {
    fs.copyFileSync(path.join(PUB, "favicon-32x32.png"), path.join(APP, "favicon.ico"));
  }
  fs.writeFileSync(path.join(PUB, "favicon.svg"), icon(32));

  await png(og, path.join(PUB, "og-argila.png"));
  console.log("Argila assets written to /public");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
