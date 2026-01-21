/** @type {import('tailwindcss').Config} */
const { heroui } = require("@heroui/react");
const ACCENT_WARM = 'text-warm-DEFAULT'; // Warm amber accent
const ACCENT_WARM_BG = 'bg-warm-DEFAULT/10 border-warm-DEFAULT/20';
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Outfit"', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: 'hsla(211, 96%, 62%, 1)',
          light: 'hsla(295, 94%, 76%, 1)',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        warm: {
          DEFAULT: 'hsla(51, 89%, 61%, 1)',
          light: 'hsla(51, 89%, 71%, 1)',
          dark: 'hsla(25, 83%, 57%, 1)',
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(90deg, hsla(211, 96%, 62%, 1) 0%, hsla(295, 94%, 76%, 1) 100%)',
        'gradient-warm': 'linear-gradient(90deg, hsla(51, 89%, 61%, 1) 0%, hsla(25, 83%, 57%, 1) 100%)',
      },
      animation: {
        'float': 'float 15s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite',
      }
    },
  },
  plugins: [heroui()],
}