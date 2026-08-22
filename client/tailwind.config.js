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
        // Palette Mapping
        darkBg: '#0B1320',
        darkCard: '#111E2E',
        darkCardHover: '#162235',
        lightBg: '#F8FAFC',
        lightCard: '#FFFFFF',
        lightBorder: '#E2E8F0',
        darkBorder: '#1E2D42',
        emeraldAccent: {
          DEFAULT: '#10B981',
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
      },
      boxShadow: {
        'card-light': '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        'card-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
}
