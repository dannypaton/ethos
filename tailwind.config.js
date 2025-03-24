/** @type {import('tailwindcss').Config} */
module.exports = {
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
        // Primary font families
        'cirka': ["var(--font-cirka-variable)", "var(--font-cirka-light)", "serif"],
        'cirka-light': ["var(--font-cirka-light)", "serif"],
        'cirka-bold': ["var(--font-cirka-bold)", "serif"],
        
        // Secondary font families
        'owners': ["var(--font-owners-regular)", "sans-serif"],
        'owners-light': ["var(--font-owners-light)", "sans-serif"],
        'owners-italic': ["var(--font-owners-italic)", "sans-serif"],
        
        // Set default font families
        'sans': ["var(--font-owners-regular)", "sans-serif"],
        'serif': ["var(--font-cirka-variable)", "serif"],
      },
      backgroundImage: {
        'hero-pattern': "url('/images/home-1.webp')",
      },
    },
  },
  plugins: [],
}; 