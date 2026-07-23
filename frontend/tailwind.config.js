/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f5ff",
          100: "#e0ecff",
          200: "#c2d9ff",
          400: "#5c8dff",
          500: "#3366ff",
          600: "#254edb",
          700: "#1a3bb3",
          900: "#111e4d",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
