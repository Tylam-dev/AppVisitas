/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FAE1C0',
        secondary: '#85725F',
        tertiary: '#E30224',
        quaternary: '#8A0015',
        quinary: '#332D27'
      }
    },
  },
  plugins: [],
}