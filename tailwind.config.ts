import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-source-sans)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      colors: {
        'status-vigente': 'var(--status-vigente)',
        'status-in-rinnovo': 'var(--status-in-rinnovo)',
        'status-scaduto': 'var(--status-scaduto)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
