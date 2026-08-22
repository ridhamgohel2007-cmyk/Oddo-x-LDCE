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
        // Odoo-Inspired Enterprise Palette
        odooPurple: {
          DEFAULT: '#714B67',
          violet: '#7C3AED',
          hover: '#613E57',
        },
        odooTeal: {
          DEFAULT: '#00A09D',
          cyan: '#06B6D4',
        },
        enterpriseEmerald: {
          DEFAULT: '#10B981',
          dark: '#059669',
        },
        warmOchre: {
          DEFAULT: '#E2A03F',
          amber: '#F59E0B',
        },
        // Dark Mode Enterprise Surface Structure
        darkBg: '#0F172A',
        darkCard: '#1E293B',
        darkCardHover: '#334155',
        darkBorder: 'rgba(255, 255, 255, 0.08)',
        // Light Mode Structure
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
