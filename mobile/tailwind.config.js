/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        dia: {
          background: "#F6F3EE",
          card: "#F8F5F0",
          ink: "#1F1E1C",
          muted: "#7C726A",
          border: "#E9E3D8",
          primary: "#4E5FA3",
          calm: "#E8F5EE",
          "calm-text": "#4E7C6A",
          "calm-border": "#B8DEC9",
          alert: "#FCE7E3",
          "alert-text": "#A95A4E",
          "alert-border": "#F0B5AF",
          warning: "#FFF8F0",
          "warning-border": "#F5E4CB",
          "warning-text": "#8A6830",
        },
      },
    },
  },
  plugins: [],
};
