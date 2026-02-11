/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#faf8f5',
        parchment: '#f5f0e8',
        bark: '#433422',
        'bark-light': '#6b5d4d',
        'bark-muted': '#a89880',
        saddle: '#8b7355',
        tan: '#c4a77d',
        'tan-light': '#e0d5c7',
        sage: '#4a5d44',
        'sage-light': '#f0f7ed',
        'sage-border': '#c5d4bc',
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
