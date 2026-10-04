import type { Config } from "tailwindcss";

// Argila "Heat": a coal-dark studio lit by the kiln. The heat ramp runs
// ember → terra → flame → glow → hot and is the only source of colour;
// glaze is the single cool note, kept for the "cold" end of the scale.
const coal = {
  DEFAULT: "#0D0907",
  2: "#151009",
  3: "#1F1712",
  4: "#2A2019",
};
const bone = {
  DEFAULT: "#F6EDE3",
  2: "#C2B2A3",
  3: "#86766A",
};
const heat = {
  ember: "#8E2D12",
  terra: "#D9622B",
  flame: "#F28C38",
  glow: "#FFC56E",
  hot: "#FFF0D4",
};
const glaze = {
  DEFAULT: "#8DB4C2",
  deep: "#4E7A8A",
};

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        coal,
        bone,
        ember: heat.ember,
        terra: heat.terra,
        flame: heat.flame,
        glow: heat.glow,
        hot: heat.hot,
        glaze,
        line: "rgba(255, 226, 196, 0.09)",
        "line-strong": "rgba(255, 226, 196, 0.18)",
      },
      fontFamily: {
        display: ["var(--font-bricolage)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-bricolage)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "0.92", transform: "scale(1)" },
          "35%": { opacity: "1", transform: "scale(1.025)" },
          "60%": { opacity: "0.86", transform: "scale(0.99)" },
        },
        drift: {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(2%, -3%, 0) scale(1.06)" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "1" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        flicker: "flicker 3.2s ease-in-out infinite",
        drift: "drift 14s ease-in-out infinite",
        "pulse-dot": "pulseDot 1.6s ease-in-out infinite",
        marquee: "marquee 40s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
