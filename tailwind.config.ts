import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./src/**/*.{html,tsx,ts}"],
  theme: {
    extend: {
      colors: {
        carleton: {
          red: "#E91C24",
          "red-hover": "#C41820",
          "red-dark": "#A01218",
          accent: "#E91C24",
          black: "#000000",
          white: "#FFFFFF",
        },
        theme: {
          page: "var(--color-page)",
          surface: "var(--color-surface)",
          elevated: "var(--color-elevated)",
          border: "var(--color-border)",
          text: "var(--color-text)",
          muted: "var(--color-text-muted)",
          subtle: "var(--color-text-subtle)",
          input: "var(--color-input)",
          segment: "var(--color-segment)",
        },
        status: {
          "loading-bg": "var(--status-loading-bg)",
          "loading-text": "var(--status-loading-text)",
          "processing-bg": "var(--status-processing-bg)",
          "processing-border": "var(--status-processing-border)",
          "processing-text": "var(--status-processing-text)",
          "error-bg": "var(--status-error-bg)",
          "error-border": "var(--status-error-border)",
          "error-text": "var(--status-error-text)",
          "success-bg": "var(--status-success-bg)",
          "success-border": "var(--status-success-border)",
          "success-text": "var(--status-success-text)",
          "success-icon": "var(--status-success-icon)",
        },
      },
      fontFamily: {
        sans: [
          "Helvetica Neue",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        "glass-red": "0 4px 16px var(--glass-red-shadow)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(-2px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.15s ease-out",
      },
    },
  },
  plugins: [],
} satisfies Config;
