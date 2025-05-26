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
        'creative-tech-primary': '#3A86FF', // Vibrant, trustworthy Blue
        'creative-tech-secondary': '#FFAB00', // Energetic, creative Orange/Mango
        'creative-tech-accent': '#48D8D0',    // Bright Teal/Mint
        'creative-tech-surface': '#F8F9FA',   // Light Grey / Off-White
        'creative-tech-on-surface': '#1c1b1f', // Dark Grey/Near Black
        // Existing orange shades for Hero section (can be migrated or kept)
        'brand-orange': {
          '300': '#EFB36D', // Example: Adjust to match your orange-300
          '400': '#EFAC64', // Your current Hero bg orange-400
          '500': '#E99F4E', // Example: Adjust to match your orange-500
          '600': '#FE6E06', // Your current Hero button orange-600
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Ensuring Inter is part of default sans
        serif: ['DM Serif Display', 'serif'], // For headings like in the image
      },
    },
  },
  plugins: [],
}; 