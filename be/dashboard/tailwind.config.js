/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f2b2b6",
          100: "#e56c74",
          200: "#d6373d",
          300: "#c20029",
          400: "#b10026",
          500: "#b10015",
          600: "#9e0012",
          700: "#8a000f",
          800: "#77000c",
          900: "#640009",
          950: "#520007"
        },
        secondary: {
          50: "#99c2e6",
          100: "#80b3d9",
          200: "#6699cc",
          300: "#4d80b3",
          400: "#336699",
          500: "#003366",
          600: "#002c53",
          700: "#002147",
          800: "#001a3d",
          900: "#001133",
          950: "#000d29"
        }
      }
    },
  },
  plugins: [],
}

