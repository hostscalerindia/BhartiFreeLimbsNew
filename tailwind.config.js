/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'manrope': ['Manrope', 'serif'],
      },
      colors: {
        // Custom Color Palette
        primary: {
          DEFAULT: '#eb5210', // Button color
          50: '#fef2f0',
          100: '#fde4e0',
          200: '#fbc8c0',
          300: '#f8a595',
          400: '#f47c5f',
          500: '#eb5210',
          600: '#d44a0e',
          700: '#b83d0c',
          800: '#9c330a',
          900: '#802a08',
        },
        body: {
          DEFAULT: '#ffffff', // Body background
        },
        section: {
          second: '#1d242e', // Second section background
          third: '#fffced', // Third section background
        },
        // Neutral colors for text and borders
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
      },
    },
  },
  plugins: [],
}
