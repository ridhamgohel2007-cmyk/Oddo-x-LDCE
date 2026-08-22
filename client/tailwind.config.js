/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Primary & Brand Colors
        emeraldTeal: {
          DEFAULT: '#10B981',
          dark: '#0D9488',
          light: '#059669',
        },
        electricCyan: {
          DEFAULT: '#06B6D4',
          sky: '#38BDF8',
        },
        sunsetAmber: {
          DEFAULT: '#F59E0B',
        },
        coralRed: {
          DEFAULT: '#EF4444',
        },
        travelBlue: {
          DEFAULT: '#3B82F6',
        },
        // Dark Mode Palette
        darkBg: '#080E18',
        darkSurface: '#0B1320',
        darkCard: '#111C2E',
        darkCardHover: '#16243A',
        darkBorder: '#1E293B',
        // Light Mode Palette
        lightBg: '#F8FAFC',
        lightCard: '#FFFFFF',
        lightBorder: '#E2E8F0',
      },
      boxShadow: {
        'card-light': '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        'card-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
}
