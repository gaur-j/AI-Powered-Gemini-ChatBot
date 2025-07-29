/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {},
    screens: { sm: "480px", md: "768px", lg: "1024px" },
    darkMode: "class",
  },
  plugins: [],
};
