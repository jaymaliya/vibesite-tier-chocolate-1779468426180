/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#8C1C1D",
        secondary: "#A67C52",
        accent: "#381E15",
        surface: "#A67C52",
      },
      fontFamily: {
        heading: ["Playfair Display", "sans-serif"],
        body: ["Source Sans 3", "sans-serif"],
      },
    },
  },
  plugins: [],
};
