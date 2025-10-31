const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        serif: ['Playfair Display', ...defaultTheme.fontFamily.serif],
      },
      colors: {
        dark: {
          900: '#121212',
          800: '#1E1E1E',
          700: '#2A2A2A',
          600: '#444444',
        },
        primary: {
          DEFAULT: '#F97316', // orange-500
          light: '#FB923C',   // orange-400
          dark: '#EA580C',    // orange-600
        },
        accent: {
          DEFAULT: '#FBBF24', // amber-400
          dark: '#F59E0B',    // amber-500
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #F97316, #FBBF24)',
        'hero-pattern': "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2574&auto=format&fit=crop')",
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      }
    }
  },
  plugins: [],
};
