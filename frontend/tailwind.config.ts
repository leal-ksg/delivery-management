import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--color-primary), 1)",
        secondary: "rgb(var(--color-secondary), 1)",
        selection: "rgb(var(--color-selection), 1)",
      },
      fontFamily: {
        sans: ["var(--font-raleway)", "sans-serif"],
      },
    },
  },
};

export default config;
