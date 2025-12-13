/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lato', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji'],
        pacifico: ['Pacifico', 'cursive'],
        federokaone: ['Federoka One', 'cursive'],
        signika: ['Signika Negative', 'sans-serif'],
      },
      colors: {
        brand: '#f08b2d',
        choco: '#3d231d',
        coffee: '#4a261f',
      },
      boxShadow: {
        soft: '0 8px 20px rgba(0,0,0,0.06)',
      },
      borderRadius: {
        xl: '1rem',
      },
    },
  },
  plugins: [],
}