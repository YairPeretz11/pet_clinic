/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      mono: ["Roboto", "monospace"],
      sans: ["Roboto", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      serif: ["Roboto", "Georgia", "serif"],
      display: ["Roboto", "sans-serif"],
      body: ["Roboto", "sans-serif"],
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4D4DFE",
          50: "#EEF0FF",
          100: "#E0E2FF",
          200: "#C0C4FF",
          300: "#A1A6FE",
          400: "#8188FE",
          500: "#626AFE",
          600: "#4D4DFE",
          700: "#3E3ED6",
          800: "#3030A3",
          900: "#212169",
        },
        muted: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1f2937",
          900: "#0f172a",
        },
      },
      gridTemplateRows: {
        "auto-1fr": "auto 1fr",
      },
      boxShadow: {
        soft: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        card: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        glow: "0 0 0 2px rgba(77,77,254,0.15), 0 8px 30px rgba(77,77,254,0.25)",
      },
      animation: {
        fade: "fade 200ms ease-out",
      },
      keyframes: {
        fade: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
      borderRadius: {
        xl: "1rem",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1rem",
          md: "2rem",
          lg: "2.5rem",
          xl: "3rem",
        },
      },
    },
  },
  plugins: [],
};
