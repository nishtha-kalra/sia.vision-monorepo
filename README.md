# Sia.Vision Landing Page

A modern, animated landing page for Sia.Vision built with Next.js, React, Tailwind CSS, and Framer Motion. Features a comprehensive storytelling platform showcase with interactive sections for creators, builders, and distributors.

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

- **Modern Design**: Clean, professional design with Material Design principles and Story Protocol branding
- **Responsive**: Fully responsive design optimized for desktop, tablet, and mobile devices
- **Animated**: Smooth animations and transitions using Framer Motion with hover effects
- **Accessible**: Built with accessibility in mind including ARIA labels and semantic HTML
- **Performance**: Optimized for fast loading and smooth interactions
- **Type Safe**: Full TypeScript support for better development experience
- **Smooth Navigation**: Smooth scrolling navigation between sections with active state management

## 🏗️ Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles and custom CSS
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Home page
├── components/
│   ├── navigation/
│   │   └── Navbar.tsx       # Navigation bar with smooth scrolling
│   ├── hero/
│   │   └── HeroSection.tsx  # Main hero section
│   ├── how-it-works/
│   │   ├── HowItWorksSection.tsx    # How it works main section
│   │   ├── HowItWorksCard.tsx       # Feature cards component
│   │   ├── WavePattern.tsx          # Decorative wave SVG patterns
│   │   ├── CircularText.tsx         # Animated circular text elements
│   │   └── index.ts                 # How it works exports
│   ├── flywheel/
│   │   ├── FlywheelSection.tsx      # Main flywheel section
│   │   ├── StoryCard.tsx            # Story card components
│   │   ├── StoryCardImage.tsx       # Card image component
│   │   ├── StoryCardContent.tsx     # Card content component
│   │   ├── DecorativeShapes.tsx     # SVG decorative elements
│   │   └── index.ts                 # Flywheel exports
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
- Smooth scrolling to section anchors
- Mobile-responsive hamburger menu with slide-out panel
- Active state indicators with Creative Tech color scheme
- Auto-closing mobile menu after navigation

### Hero Section
- Gradient background with floating elements
- Animated text reveals
- Interactive elements with hover effects
- Material-UI button with smooth transitions
- Responsive typography and layout

### How It Works Section
- Four feature cards showcasing Story Protocol capabilities
- Decorative wave patterns and circular text elements
- Responsive grid layout (2x2 desktop, stacked mobile)
- Hover animations and interactive states
- SVG image support with fallback handling

### Flywheel Section
- Three-stage storytelling process: Create, Build, Distribute
- Diagonal card positioning on desktop with decorative shapes
- Responsive layouts:
  - **Desktop (xl+)**: Diagonal positioning with decorative elements
  - **Tablet (md-xl)**: Grid layout with Create on top, Build/Distribute side-by-side
  - **Mobile (<md)**: Stacked vertical cards
- Smooth hover animations and transitions
- Story Protocol integration messaging

### Animations
- Page load animations with staggered reveals
- Card hover effects and micro-interactions
- Smooth transitions between responsive breakpoints
- Floating background elements and decorative shapes

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
- **Desktop (xl+)**: Full diagonal layout with decorative elements
- **Tablet (md-xl)**: Grid-based layouts with centered content
- **Mobile (<md)**: Stacked layouts with optimized touch targets and spacing

### Breakpoint Strategy
- Uses Tailwind CSS breakpoints: `sm`, `md`, `lg`, `xl`
- Custom responsive utilities for complex layouts
- Conditional rendering of decorative elements
- Optimized touch targets for mobile interactions

## 🎯 Component Architecture

### Modular Design
- Each section is self-contained and reusable
- Shared components for cards, decorative elements, and patterns
- Props-based configuration for flexibility
- TypeScript interfaces for type safety

### Theme System
- Creative Tech color palette throughout
- Consistent spacing and typography scales
- Hover states and interactive feedback
- Material Design principles for accessibility

## 🔧 Customization

### Colors
The Creative Tech brand colors are defined throughout the components:
```typescript
// Primary colors used
- creative-tech-primary: Orange accent (#ea580c)
- creative-tech-surface: Light background
- creative-tech-on-surface: Dark text
- creative-tech-secondary: Secondary accent
```

### Content
Update section content by modifying the data arrays in each section:
```typescript
// HowItWorksSection.tsx
const FEATURE_CARDS = [
  // Add or modify feature cards
];

// FlywheelSection.tsx  
const FLYWHEEL_CARDS = [
  // Add or modify flywheel stages
];
```

### Navigation
Add new navigation items in `Navbar.tsx`:
```typescript
const navigationItems: NavigationItem[] = [
  { label: "New Section", href: "#new-section" },
  // ...
];
```

## 🖼️ Assets

The project uses local SVG assets for optimal performance:
- `/create-flywheel.svg` - Create stage illustration
- `/build-flywheel.svg` - Build stage illustration  
- `/distribute-flywheel.svg` - Distribute stage illustration
- `/beyond-islolated-narratives.svg` - Feature illustration
- `/empowering-creators.svg` - Feature illustration
- `/adapt.svg` - Feature illustration
- `/reimagined-narratives.svg` - Feature illustration

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

- Story Protocol for blockchain-based IP ownership concepts
- Material Design principles for accessibility guidelines
- Framer Motion for smooth animations
- Next.js team for the excellent framework
- Tailwind CSS for responsive design utilities
