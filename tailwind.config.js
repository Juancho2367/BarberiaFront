/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fefbf1',
          100: '#fdf4d3',
          200: '#fae8a7',
          300: '#f6d470',
          400: '#f1be37',
          500: '#DAA520',
          600: '#C0901A',
          700: '#a07114',
          800: '#825a14',
          900: '#6d4a16',
        },
        barberia: {
          dark: '#1A1A1A',
          darker: '#121212',
          card: '#222222',
          border: '#333333',
          text: '#F5F5F5',
          'text-secondary': '#B0B0B0',
          gold: '#DAA520',
          'gold-hover': '#C0901A',
        },
      },
      fontFamily: {
        'title': ['Oswald', 'sans-serif'],
        'body': ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 