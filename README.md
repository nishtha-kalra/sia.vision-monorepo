# Sia.Vision Landing Page

A modern, animated landing page for Sia.Vision built with Next.js, React, Tailwind CSS, and Framer Motion.

## 🚀 Tech Stack

- **Framework**: Next.js 15.3.2
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **UI Components**: Material-UI (MUI)
- **Language**: TypeScript
- **Package Manager**: npm
- **Code Quality**: ESLint, Prettier
- **Icons**: Lucide React, Material-UI Icons

## ✨ Features

- **Modern Design**: Clean, professional design with Material Design principles
- **Responsive**: Fully responsive design that works on all devices
- **Animated**: Smooth animations and transitions using Framer Motion
- **Accessible**: Built with accessibility in mind
- **Performance**: Optimized for fast loading and smooth interactions
- **Type Safe**: Full TypeScript support for better development experience

## 🏗️ Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles and custom CSS
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Home page
├── components/
│   ├── navigation/
│   │   └── Navbar.tsx       # Navigation bar component
│   ├── hero/
│   │   ├── HeroSection.tsx  # Main hero section
│   │   ├── AnimatedStar.tsx # Animated star decoration
│   │   └── FloatingElements.tsx # Background floating elements
│   ├── LandingPage.tsx      # Main landing page component
│   └── index.ts             # Component exports
├── lib/
│   └── utils.ts             # Utility functions
└── types/
    └── index.ts             # TypeScript type definitions
```

## 🎨 Design Features

### Navigation Bar
- Sticky navigation with backdrop blur effect
- Smooth animations on scroll
- Mobile-responsive hamburger menu
- Active state indicators with smooth transitions

### Hero Section
- Gradient background with floating elements
- Animated text reveals
- Interactive star decorations
- Material-UI button with hover effects
- Responsive typography and layout

### Animations
- Page load animations
- Hover effects and micro-interactions
- Smooth transitions between states
- Floating background elements

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

## 📱 Responsive Design

The landing page is fully responsive and optimized for:
- **Desktop**: Full-width layout with side-by-side content
- **Tablet**: Adjusted spacing and typography
- **Mobile**: Stacked layout with optimized touch targets

## 🎯 Component Architecture

### Modular Design
- Each component is self-contained and reusable
- Props-based configuration for flexibility
- TypeScript interfaces for type safety

### Theme System
- Custom Material-UI theme with brand colors
- Consistent spacing and typography
- Dark mode support ready

## 🔧 Customization

### Colors
The primary brand colors can be customized in `src/components/LandingPage.tsx`:
```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '#ea580c', // Orange
      light: '#fb923c',
      dark: '#c2410c',
    },
    // ...
  },
});
```

### Content
Update the hero content by modifying the props in `HeroSection`:
```typescript
<HeroSection 
  title="Your Custom Title"
  subtitle="Your custom subtitle"
  ctaText="Your CTA"
  onCtaClick={handleCustomAction}
/>
```

## 🚀 Deployment

### Build for production:
```bash
npm run build
```

### Start production server:
```bash
npm start
```

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Design inspiration from modern web design trends
- Material Design principles
- Framer Motion for smooth animations
- Next.js team for the excellent framework
