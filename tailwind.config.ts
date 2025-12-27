import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'], 
        mono: ['var(--font-mono)'],
      },
      colors: {
        cyber: {
          green: '#ccff00',
          black: '#050505',
          dark: '#0a0a0a',
        }
      }
    },
  },
  plugins: [],
};
export default config;