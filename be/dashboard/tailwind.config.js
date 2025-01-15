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
        light: "#f2f2f2",
        dark: "#333333",
        primary: {
          50: "#f9c1c5",
          100: "#f59b9f",
          200: "#f27779",
          300: "#f04e51",
          400: "#b10015",
          500: "#9a0012",
          600: "#8b0010",
          700: "#7c000e",
          800: "#6d000c",
          900: "#5e000a",
          950: "#4f0008"
        },
        secondary: {
          50: "#99b3cc",
          100: "#6699cc",
          200: "#4d80b3",
          300: "#3366b3",
          400: "#003399",
          500: "#002a7f",
          600: "#002466",
          700: "#001d4c",
          800: "#001533",
          900: "#001022",
          950: "#000d1a"
        },
        department : {
          bg: "#e4f0fe",
          text: "#328af1"
        },
        service: {
          bg: "#e3f4eb",
          text: "#20a45f"
        },
        office: {
          bg: "#fdf1dd",
          text: "#f0a020"
        }
      }
    },
  },
  plugins: [],
}

