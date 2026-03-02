import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        institution: {
          dark: "#0b1f3a",
          primary: "#1c3f72",
          light: "#f5f7fa",
          accent: "#2f5fa5"
        }
      }
    }
  },
  plugins: []
};

export default config;
