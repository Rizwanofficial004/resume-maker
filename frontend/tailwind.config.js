/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#d9e6ff',
          200: '#bcd3ff',
          300: '#8eb7ff',
          400: '#5990ff',
          500: '#3369fc',
          600: '#1d47f1',
          700: '#1535de',
          800: '#182db4',
          900: '#1a2c8e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(15,23,42,0.06), 0 8px 24px rgba(15,23,42,0.06)',
        lift: '0 4px 12px rgba(15,23,42,0.10), 0 16px 40px rgba(15,23,42,0.12)',
      },
    },
  },
  plugins: [],
};
