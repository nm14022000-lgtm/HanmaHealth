import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          main: "#0b0c10",
          surface: "#0f1117",
          card: "rgba(15, 18, 24, 0.75)",
          cardHover: "rgba(20, 24, 32, 0.88)",
        },
        border: {
          DEFAULT: "rgba(255, 255, 255, 0.07)",
          strong: "rgba(255, 255, 255, 0.12)",
        },
        text: {
          primary: "#f1f5f9",
          secondary: "#94a3b8",
          muted: "#4b5675",
        },
        primary: {
          DEFAULT: "#22c55e",
          hover: "#16a34a",
          light: "rgba(34, 197, 94, 0.12)",
        },
        secondary: {
          DEFAULT: "#3b82f6",
        },
        accent: {
          purple: "#a855f7",
          amber: "#f59e0b",
          rose: "#f43f5e",
        },
        warn: "#f59e0b",
        danger: "#ef4444",
        success: "#22c55e",
      },
      fontFamily: {
        sans: [
          "DM Sans",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
        display: ["DM Sans", "Inter", "sans-serif"],
      },
      borderRadius: {
        chunky: "14px",
        xl: "12px",
        "2xl": "16px",
      },
      boxShadow: {
        "glow-primary": "0 0 24px rgba(34,197,94,0.2), 0 0 8px rgba(34,197,94,0.1)",
        "glow-primary-sm": "0 0 12px rgba(34,197,94,0.15)",
        "glass": "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
        "glass-sm": "0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
        "card-hover": "0 12px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
      },
      backgroundImage: {
        grid: "linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)",
        "emerald-radial": "radial-gradient(ellipse at top left, rgba(34,197,94,0.08) 0%, transparent 60%)",
        "hero-gradient": "linear-gradient(160deg, #0e1a14 0%, #0b0c10 55%, #08090d 100%)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-12px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
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
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 12px rgba(34,197,94,0.15)" },
          "50%": { boxShadow: "0 0 24px rgba(34,197,94,0.3)" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease forwards",
        "slide-in-left": "slideInLeft 0.4s ease forwards",
        shimmer: "shimmer 2s linear infinite",
        "ping-dot": "pingDot 1.5s cubic-bezier(0,0,0.2,1) infinite",
        "block-pulse": "blockPulse 2s infinite ease-in-out",
        float: "float 4s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
