import type { Config } from "tailwindcss";

// Tailwind is used sparingly in BrandonOS — primarily for layout utilities
// (flex/grid/spacing). Visual styling comes from 98.css and globals.css so the
// app keeps its classic desktop look rather than a modern SaaS feel.
const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Classic Windows desktop palette
        desktop: "#008080", // teal
        silver: "#c0c0c0",
        face: "#dfdfdf",
      },
      fontFamily: {
        sans: ["'Pixelated MS Sans Serif'", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
