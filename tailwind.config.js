/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      fontFamily: { sans: ['Plus Jakarta Sans', 'sans-serif'] },
      colors: {
        narmadaGreen: {
          DEFAULT: '#059669',
          light: '#34D399',
          dark: '#047857'
        },
        narmadaBlue: {
          DEFAULT: '#0EA5E9',
          light: '#38BDF8',
          dark: '#0284C7'
        }
      }
    },
  },
  plugins: [],
}
