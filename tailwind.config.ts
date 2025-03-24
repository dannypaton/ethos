import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'ethos-dark': '#031220',
        'ethos-gray': '#9FA7AA',
        'ethos-light': '#F5F5F5',
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
      backgroundImage: {
        'hero-pattern': "url('/images/hero-bg.jpg')",
        'city-view': "url('/images/city-view.jpg')",
      },
    },
  },
  plugins: [],
};

export default config; 