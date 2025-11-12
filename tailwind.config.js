/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: { brand: { 50:'#e6fffb', 500:'#0ea5a4', 600:'#0b7e7d' } }
    },
  },
  plugins: [],
};
