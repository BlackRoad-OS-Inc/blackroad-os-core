import baseConfig from "@blackroad/config/tailwind.config.mjs";

/** @type {import('tailwindcss').Config} */
const config = {
  ...baseConfig,
  content: ["./app/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"]
};

export default config;
