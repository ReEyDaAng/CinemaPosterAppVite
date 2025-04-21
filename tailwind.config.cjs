/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,html}'
  ],
  theme: {
    extend: {
      boxShadow: {
        // назва класу: значення CSS box-shadow
        'white-2xl': '0 30px 60px -15px rgba(255, 255, 255, 0.3)',
      }
    },
  },
  darkMode: 'class',
  plugins: [],
}
