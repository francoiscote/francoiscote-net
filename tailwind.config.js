/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: [
        "Manrope",
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "BlinkMacSystemFont",
      ],
      serif: [""],
      mono: ["monospace"],
    },
    extend: {
      colors: {
        blueskyBlue: "#0A7AFF",
        twitchPurple: "#6441a4",
      },
    },
  },
  plugins: [],
};
