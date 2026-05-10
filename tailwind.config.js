/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./features/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg: "#0B0B0D",
        surface: "#15161A",
        card: "#1D1F24",
        online: "#3B82F6",
        offline: "#F97316",
        primary: "#FFFFFF",
        secondary: "#B0B3BD",
        success: "#22C55E",
        error: "#EF4444"
      }
    }
  },
  plugins: []
};
