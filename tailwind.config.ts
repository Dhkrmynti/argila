import type { Config } from "tailwindcss";

// Argila: kiln char field, bisque paper, terracotta fire, cobalt glaze for marks.
const ink = {
  DEFAULT: "#120E0B",
  2: "#1B1612",
  3: "#0B0806",
  4: "#28201A",
};
const paper = {
  DEFAULT: "#F4ECDF",
  2: "#E9DDCA",
  3: "#D8C8B0",
  dim: "#BDAF9B",
  faint: "#8D8172",
};
const terra = {
  DEFAULT: "#D2693C",
  hi: "#EA9068",
  deep: "#A84E2A",
  dark: "#7A3720",
};
const cobalt = {
  DEFAULT: "#3B5BA5",
  hi: "#7D9BE0",
  deep: "#26438A",
};

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      spacing: {
        "4.5": "1.125rem",
        "13": "3.25rem",
        "15": "3.75rem",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        ink,
        paper,
        terra,
        cobalt,
        // Legacy names kept so untouched screens inherit the kiln palette.
        clay: terra,
        slip: ink,
        buff: { DEFAULT: paper.DEFAULT, dim: paper.dim, faint: paper.faint },
        miltos: { DEFAULT: cobalt.deep, hi: cobalt.hi },
        ochre: terra.hi,
      },
      borderRadius: {
        sm: "1px",
        DEFAULT: "2px",
        md: "2px",
        lg: "2px",
        xl: "2px",
        "2xl": "3px",
        "3xl": "3px",
      },
      fontFamily: {
        display: ["var(--font-archivo)", "Helvetica Neue", "sans-serif"],
        sans: ["var(--font-archivo)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["var(--font-martian)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        code: ["var(--font-martian)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        norse: ["var(--font-archivo)", "sans-serif"],
        editorial: ["var(--font-archivo)", "sans-serif"],
        cursive: ["var(--font-archivo)", "sans-serif"],
      },
      transitionTimingFunction: {
        vault: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(12px)", filter: "blur(4px)" },
          "100%": { opacity: "1", transform: "none", filter: "none" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 60s linear infinite",
        fadeIn: "fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
};
export default config;
