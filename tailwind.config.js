/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "lavender--600": "#8378FF",
        "lavender-light-400": "#BECAFF",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
