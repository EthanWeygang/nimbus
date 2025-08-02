/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          50: '#F0FDF4',
          100: '#94E8B4',
          200: '#72BDA3',
          300: '#5E8C61',
          400: '#4E6151',
          500: '#3B322C',
        },
        'mint': '#94E8B4',
        'sage': '#72BDA3',
        'forest': '#5E8C61',
        'darkSage': '#4E6151',
        'charcoal': '#3B322C',
      }
    },
  },
  plugins: [],
}

