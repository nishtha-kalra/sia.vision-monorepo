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
        // Neo-Futuristic Theme - Sophisticated and striking
        'creative-tech-primary': '#00F5FF',   // Electric Cyan - vibrant and futuristic
        'creative-tech-secondary': '#1A0B2E', // Deep Purple - rich background
        'creative-tech-accent': '#FF1744',    // Bright Red - matches video's glow
        'creative-tech-surface': '#0F0A1A',   // Deep Space Black - main surface
        'creative-tech-on-surface': '#E8F4FD', // Cool White - text
        
        // Dark Vibrant Blue Theme for Hero
        'hero-blue': {
          '900': '#0A1628',      // Deepest blue
          '800': '#1E3A8A',      // Deep vibrant blue
          '700': '#1D4ED8',      // Vibrant blue
          '600': '#2563EB',      // Bright blue
          '500': '#3B82F6',      // Standard blue
        },
        
        // Additional neo-futuristic shades
        'neo-purple': {
          '900': '#0A051A',      // Deepest purple
          '800': '#1A0B2E',      // Deep purple
          '700': '#2D1B4E',      // Medium purple
          '600': '#4A2C7A',      // Lighter purple
        },
        'neo-cyan': {
          '500': '#00F5FF',      // Electric cyan
          '400': '#33F7FF',      // Lighter cyan
          '300': '#66F9FF',      // Even lighter
        },
        'neo-red': {
          '500': '#FF1744',      // Bright red
          '400': '#FF4569',      // Lighter red
        },
        
        // Existing orange shades for Hero section (can be migrated or kept)
        'brand-orange': {
          '300': '#EFB36D',
          '400': '#EFAC64',
          '500': '#E99F4E',
          '600': '#FE6E06',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['DM Serif Display', 'serif'],
      },
      backgroundImage: {
        'neo-gradient': 'linear-gradient(135deg, #0F0A1A 0%, #1A0B2E 50%, #2D1B4E 100%)',
        'blue-gradient': 'linear-gradient(135deg, #0A1628 0%, #1E3A8A 50%, #1D4ED8 100%)',
        'cyber-glow': 'radial-gradient(circle at center, rgba(0, 245, 255, 0.1) 0%, transparent 70%)',
        'blue-glow': 'radial-gradient(circle at center, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
      },
    },
  },
  plugins: [],
}; 