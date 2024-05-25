/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors :{
        bg : '#141619',
        main: '#2C2E3A',
        textD: '#E64833',
        textL: '#F0ECE5'
      },
    },
  },
  plugins: [],
}

