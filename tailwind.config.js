/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: "#c6a46a",
        charcoal: "#2a2a2a",
        luxury: {
          primary: "#F5F2EB",
          secondary: "rgba(245, 242, 235, 0.75)",
          muted: "rgba(245, 242, 235, 0.55)",
        },
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "-apple-system", "sans-serif"],
        serif: ["var(--font-display)", "Georgia", "serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "-apple-system", "sans-serif"],
      },
      fontSize: {
        hero: ["3.5rem", { lineHeight: "1.05", fontWeight: "400" }],
        "card-title": ["1.75rem", { lineHeight: "1.15", fontWeight: "400" }],
        section: ["1.25rem", { lineHeight: "1.35", fontWeight: "500" }],
        body: ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
        nav: ["0.9375rem", { lineHeight: "1.4", fontWeight: "500" }],
        label: ["0.6875rem", { lineHeight: "1.3", fontWeight: "400" }],
        small: ["0.875rem", { lineHeight: "1.55", fontWeight: "400" }],
      },
      letterSpacing: {
        label: "0.12em",
        micro: "0.12em",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        panelIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fadeIn 1s ease-out both",
        "panel-in": "panelIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
      boxShadow: {
        launcher:
          "0 24px 64px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
        "launcher-card":
          "0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(198,164,106,0.06)",
        "launcher-card-hover":
          "0 16px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(198,164,106,0.08)",
        "glow-amber": "0 0 20px rgba(198, 164, 106, 0.15)",
      },
    },
  },
  plugins: [],
};
