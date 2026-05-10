/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8a5100',
        surface: '#f9f9f9',
      },
      fontFamily: {
        sans: ['"Inter"', '"Public Sans"', 'sans-serif'],
      },
      boxShadow: {
        ambient: '0 12px 32px rgba(26, 28, 28, 0.06)',
      }
    },
  },
  plugins: [],
}
