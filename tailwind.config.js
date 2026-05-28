/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        gold: "#c6a46a",
        charcoal: "#2a2a2a",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        alive: {
          "0%, 100%": {
            transform: "scale(1) translateY(0px) rotate(-0.35deg)",
          },
          "33%": {
            transform: "scale(1.016) translateY(-7px) rotate(0.42deg)",
          },
          "66%": {
            transform: "scale(1.024) translateY(5px) rotate(-0.28deg)",
          },
        },
        subtitleReveal: {
          "0%": { opacity: "0", filter: "blur(12px)" },
          "100%": { opacity: "1", filter: "blur(0px)" },
        },
        subtitleHide: {
          "0%": { opacity: "1", filter: "blur(0px)" },
          "100%": { opacity: "0", filter: "blur(10px)" },
        },
        tapHintIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        panelIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        cardGlow: {
          "0%, 100%": { boxShadow: "0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(198,164,106,0.08)" },
          "50%": { boxShadow: "0 16px 48px rgba(0,0,0,0.55), 0 0 24px rgba(198,164,106,0.12)" },
        },
      },
      animation: {
        "fade-in": "fadeIn 1s ease-out both",
        alive: "alive 10s ease-in-out infinite",
        "subtitle-in":
          "subtitleReveal 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.42s forwards",
        "subtitle-out":
          "subtitleHide 0.58s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "tap-hint-in": "tapHintIn 0.85s ease-out 0.12s both",
        "panel-in": "panelIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
        "card-glow": "cardGlow 4s ease-in-out infinite",
      },
      boxShadow: {
        "launcher": "0 24px 64px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
        "launcher-card": "0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(198,164,106,0.06)",
        "launcher-card-hover": "0 20px 56px rgba(0,0,0,0.6), 0 0 32px rgba(198,164,106,0.14)",
        "glow-amber": "0 0 24px rgba(198,164,106,0.2)",
      },
    },
  },
  plugins: [],
};
