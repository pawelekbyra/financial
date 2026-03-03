import type { Config } from "tailwindcss"

const config = {
  content: [
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        sepia: {
          DEFAULT: '#704214',
          light: '#9e7e56',
        },
        parchment: {
          DEFAULT: '#fcfaf2',
          warm: '#f7f3e9',
        },
        ink: {
          DEFAULT: '#1a1a1a',
          medium: '#4a4a4a',
          light: '#7a7a7a',
        },
        wine: {
          DEFAULT: '#800020',
        },
        amber: {
          DEFAULT: '#d97706',
        },
      },
      fontFamily: {
        unifraktur: ['var(--font-unifraktur)', 'serif'],
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
        sans: ['var(--font-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
} satisfies Config

export default config
