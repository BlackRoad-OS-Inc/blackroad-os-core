/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "../ui/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "br-neon": {
          dark: "#0a0f1f",
          glow: "#45ffbc",
          accent: "#7b5bff"
        }
      }
    }
  },
  plugins: []
};

export default config;
