import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#F5F5F5",
          muted: "#8A8A8A",
          dim: "#4A4A4A",
        },
        bg: {
          DEFAULT: "#080808",
          raised: "#0F0F0F",
          panel: "#141414",
        },
        line: {
          DEFAULT: "#1A1A1A",
          hover: "#2A2A2A",
          bright: "#3A3A3A",
        },
        accent: {
          DEFAULT: "#B14EFF",
          hover: "#C26FFF",
          deep: "#6B1AB8",
          glow: "rgba(177, 78, 255, 0.35)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
        mark: ["var(--font-mark)", "Impact", "Arial Narrow", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-2xl": ["clamp(2.5rem, 7vw, 5.5rem)", { lineHeight: "1.05", letterSpacing: "-0.025em" }],
        "display-xl": ["clamp(2.25rem, 5.5vw, 4.5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(1.875rem, 4vw, 3.25rem)", { lineHeight: "1.08", letterSpacing: "-0.018em" }],
        "display-md": ["clamp(1.5rem, 3vw, 2.5rem)", { lineHeight: "1.12", letterSpacing: "-0.015em" }],
        "display-sm": ["clamp(1.25rem, 2.2vw, 1.875rem)", { lineHeight: "1.18", letterSpacing: "-0.01em" }],
        "body-lg": ["clamp(0.9375rem, 1.1vw, 1.125rem)", { lineHeight: "1.6" }],
        "body-xl": ["clamp(1.0625rem, 1.35vw, 1.3125rem)", { lineHeight: "1.5" }],
      },
      letterSpacing: {
        "tightest": "-0.045em",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "marquee": "marquee 40s linear infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "spotlight": "spotlight 2s ease 0.5s 1 forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        spotlight: {
          "0%": { opacity: "0", transform: "translate(-72%, -62%) scale(0.5)" },
          "100%": { opacity: "1", transform: "translate(-50%, -40%) scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
