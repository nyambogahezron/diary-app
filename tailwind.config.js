/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./components/**/*.{js,ts,tsx}', './app/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};
