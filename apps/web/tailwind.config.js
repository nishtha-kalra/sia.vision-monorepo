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
        // Creative Tech Theme - Consistent color system
        'creative-tech': {
          // Primary Blue Scale
          'primary': '#3A86FF',           // Main brand blue
          'primary-light': '#5A9BFF',     // Lighter variant
          'primary-dark': '#2563EB',      // Darker variant
          
          // Secondary Orange Scale  
          'secondary': '#FFAB00',         // Orange/Mango accent
          'secondary-light': '#FFD54F',   // Lighter orange
          'secondary-dark': '#F57F17',    // Darker orange
          
          // Accent Teal Scale
          'accent': '#48D8D0',            // Teal/Mint highlights
          'accent-light': '#80E5DE',      // Lighter teal
          'accent-dark': '#00BCD4',       // Darker teal
          
          // Neutral Scale
          'surface': '#F8F9FA',           // Light backgrounds
          'surface-dark': '#1c1b1f',      // Dark backgrounds
          'on-surface': '#1c1b1f',        // Text on light surfaces
          'on-surface-dark': '#F8F9FA',   // Text on dark surfaces
          'on-surface-muted': '#6B7280',  // Muted text
        },
        
        // Hero section blues (aligned with primary)
        'hero-blue': {
          '50': '#EFF6FF',
          '100': '#DBEAFE', 
          '200': '#BFDBFE',
          '300': '#93C5FD',
          '400': '#60A5FA',
          '500': '#3A86FF',      // Matches creative-tech-primary
          '600': '#2563EB',      // Matches creative-tech-primary-dark
          '700': '#1D4ED8',
          '800': '#1E3A8A',
          '900': '#0A1628',
        },
      },
      fontFamily: {
        // Enhanced font stacks with better fallbacks
        sans: [
          'Inter', 
          'system-ui', 
          '-apple-system', 
          'BlinkMacSystemFont', 
          'Segoe UI', 
          'Roboto', 
          'Helvetica Neue', 
          'Arial', 
          'sans-serif'
        ],
        serif: [
          'DM Serif Display', 
          'Playfair Display',
          'Georgia', 
          'Times New Roman', 
          'serif'
        ],
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'Consolas',
          'Monaco',
          'monospace'
        ],
        display: [
          'Inter',
          'system-ui',
          'sans-serif'
        ],
      },
      fontWeight: {
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
        'black': '900',
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
        'hero': ['clamp(3rem, 8vw, 8rem)', { lineHeight: '1' }],
      },
      backgroundImage: {
        // Updated gradients using consistent color system
        'creative-gradient': 'linear-gradient(135deg, #F8F9FA 0%, #EFF6FF 50%, #F1F8E9 100%)',
        'blue-gradient': 'linear-gradient(135deg, #0A1628 0%, #1E3A8A 50%, #3A86FF 100%)',
        'creative-glow': 'radial-gradient(circle at center, rgba(58, 134, 255, 0.1) 0%, transparent 70%)',
        'blue-glow': 'radial-gradient(circle at center, rgba(58, 134, 255, 0.15) 0%, transparent 70%)',
        'accent-glow': 'radial-gradient(circle at center, rgba(72, 216, 208, 0.1) 0%, transparent 70%)',
        'secondary-glow': 'radial-gradient(circle at center, rgba(255, 171, 0, 0.1) 0%, transparent 70%)',
      },
      letterSpacing: {
        'tighter': '-0.05em',
        'tight': '-0.025em',
        'normal': '0em',
        'wide': '0.025em',
        'wider': '0.05em',
        'widest': '0.1em',
      },
    },
  },
  plugins: [],
}; 