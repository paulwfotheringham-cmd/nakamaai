/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
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
      },
      animation: {
        "fade-in": "fadeIn 1s ease-out both",
        alive: "alive 10s ease-in-out infinite",
        "subtitle-in":
          "subtitleReveal 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.42s forwards",
        "subtitle-out":
          "subtitleHide 0.58s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "tap-hint-in": "tapHintIn 0.85s ease-out 0.12s both",
      },
    },
  },
  plugins: [],
};
