import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          main: "#06090e",
          surface: "#0a0f18",
          card: "rgba(13, 19, 28, 0.85)",
          cardHover: "rgba(19, 27, 38, 0.9)",
        },
        border: {
          DEFAULT: "rgba(255, 255, 255, 0.08)",
        },
        text: {
          primary: "#f1f5f9",
          secondary: "#94a3b8",
          muted: "#64748b",
        },
        primary: {
          DEFAULT: "#00ff88",
          hover: "#33ffa2",
        },
        secondary: {
          DEFAULT: "#ff5e00",
        },
        cyan: {
          DEFAULT: "#00f2fe",
        },
        warn: "#f59e0b",
        danger: "#ef4444",
        success: "#10b981",
      },
      fontFamily: {
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
      borderRadius: {
        chunky: "16px",
      },
      boxShadow: {
        "glow-primary": "0 0 20px rgba(0,255,136,0.3), inset 0 0 10px rgba(0,255,136,0.15)",
        "glow-orange": "0 0 20px rgba(255,94,0,0.4), inset 0 0 10px rgba(255,94,0,0.15)",
        "glow-cyan": "0 0 15px rgba(0,242,254,0.3)",
      },
      backgroundImage: {
        grid: "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "32px 32px",
      },
      keyframes: {
        pingDot: {
          "75%, 100%": { transform: "scale(2)", opacity: "0" },
        },
        blockPulse: {
          "0%, 100%": { opacity: "0.9" },
          "50%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "ping-dot": "pingDot 1.5s cubic-bezier(0,0,0.2,1) infinite",
        "block-pulse": "blockPulse 2s infinite ease-in-out",
        float: "float 4s ease-in-out infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
