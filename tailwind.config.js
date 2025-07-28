/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        white: '#edf6f9',
      },
      fontFamily: {
        display: ['DM Serif Text'],
        regular: ['Roboto', 'sans-serif'],
      },
      flexGrow: {
        1: '1',
        2: '2',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
