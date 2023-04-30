/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "hsl(222.2 47% 11%)",
        "primary-foreground": "hsl(210 40% 98%)",

        muted: "hsl(210 40% 96.1%)",
        "muted-foreground": "hsl(215.4 16.3% 46.9%)",

        secondary: "hsl(210 40% 96.1%)",
        "secondary-foreground": "hsl(222.2 47.4% 11.2%)",

        accent: "hsl(210 40% 96.1%)",
        "accent-foreground": "hsl(222.2 47.4% 11.2%)",

        border: "#e5e7eb"
      }
    }
  },
  plugins: []
}
