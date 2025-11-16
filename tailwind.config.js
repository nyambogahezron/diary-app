/** @type {import('tailwindcss').Config} */
const { platformSelect, hairlineWidth } = require('nativewind/theme');

module.exports = {
  content: ['./components/**/*.{js,ts,tsx}', './app/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Theme-aware colors using CSS variables
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        'primary-foreground': 'rgb(var(--color-primary-foreground) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        'secondary-foreground': 'rgb(var(--color-secondary-foreground) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        'accent-foreground': 'rgb(var(--color-accent-foreground) / <alpha-value>)',
        background: 'rgb(var(--color-background) / <alpha-value>)',
        foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
        card: 'rgb(var(--color-card) / <alpha-value>)',
        'card-foreground': 'rgb(var(--color-card-foreground) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        'muted-foreground': 'rgb(var(--color-muted-foreground) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        'mood-1': 'rgb(var(--color-mood-1) / <alpha-value>)', // Very sad
        'mood-2': 'rgb(var(--color-mood-2) / <alpha-value>)', // Sad
        'mood-3': 'rgb(var(--color-mood-3) / <alpha-value>)', // Neutral
        'mood-4': 'rgb(var(--color-mood-4) / <alpha-value>)', // Happy
        'mood-5': 'rgb(var(--color-mood-5) / <alpha-value>)', // Very happy
        // Platform specific colors
        error: platformSelect({
          ios: 'rgb(255, 59, 48)', // iOS system red
          android: 'rgb(244, 67, 54)', // Material red
          default: 'rgb(239, 68, 68)', // Tailwind red-500
        }),
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
    },
  },
  plugins: [
    // Set default values on the :root element for light theme
    ({ addBase }) =>
      addBase({
        ':root': {
          // Light theme defaults
          '--color-primary': '59 130 246', // blue-500
          '--color-primary-foreground': '255 255 255',
          '--color-secondary': '229 231 235', // gray-200
          '--color-secondary-foreground': '31 41 55', // gray-800
          '--color-accent': '139 92 246', // violet-500
          '--color-accent-foreground': '255 255 255',
          '--color-background': '255 255 255',
          '--color-foreground': '17 24 39', // gray-900
          '--color-card': '255 255 255',
          '--color-card-foreground': '31 41 55', // gray-800
          '--color-muted': '249 250 251', // gray-50
          '--color-muted-foreground': '107 114 128', // gray-500
          '--color-border': '229 231 235', // gray-200
          '--color-mood-1': '239 68 68', // red-500
          '--color-mood-2': '251 146 60', // orange-400
          '--color-mood-3': '234 179 8', // yellow-500
          '--color-mood-4': '34 197 94', // green-500
          '--color-mood-5': '16 185 129', // emerald-500
        },
      }),
  ],
};
