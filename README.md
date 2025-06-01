# Sia.Vision Landing Page

A modern, animated landing page for Sia.Vision built with Next.js, React, Tailwind CSS, and featuring comprehensive storytelling platform showcase with interactive sections for creators, builders, and distributors.

## 🚀 Tech Stack

- **Framework**: Next.js 15.3.2
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Package Manager**: npm
- **Code Quality**: ESLint, Prettier
- **Icons**: Lucide React
- **Media**: Next.js Image optimization, HTML5 Video

## ✨ Features

- **Modern Design**: Clean, professional design with Creative Tech color scheme and consistent branding
- **Responsive**: Fully responsive design optimized for desktop, tablet, and mobile devices
- **Interactive Videos**: Hover-to-unmute video functionality with seamless playback
- **Accessible**: Built with accessibility in mind including ARIA labels and semantic HTML
- **Performance**: Optimized for fast loading and smooth interactions with proper image/video optimization
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
│   ├── stakeholder-benefits/
│   │   ├── StakeholderBenefitsSection.tsx  # Main benefits section
│   │   └── StakeholderCard.tsx            # Individual benefit cards
│   ├── meet-sia/
│   │   └── MeetSiaSection.tsx       # Genesis IP showcase section
│   ├── contact-form/
│   │   └── ContactFormSection.tsx   # Contact form with inquiry types
│   ├── Footer.tsx           # Footer with social media and contact
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

### Stakeholder Benefits Section ("For You")
- Three stakeholder categories: Visionaries, Co-Creators, Developers
- Light cards on dark background for optimal contrast
- Interactive hover effects and smooth animations
- SVG illustrations for each stakeholder type
- Call-to-action buttons with engaging copy
- Responsive three-column grid (desktop) to single-column stack (mobile)

### Meet Sia Section (Genesis IP Showcase)
- **Rich Character Lore**: Three-card introduction covering Character, Genesis, and Vision
- **Interactive Video Experience**: 
  - Two videos showcasing SIA's universe and journey
  - Vertical stacking to avoid attention division
  - Hover-to-unmute functionality for seamless audio control
  - Auto-playing, looping videos with sound indicators
- **Immersive Design**: 
  - Terracotta/ochre gradient background matching reference design
  - Decorative dotted patterns and large circular elements
  - Proper video spacing with connecting star element
- **Genesis IP Storytelling**: 
  - Detailed character background (mystical visualization bracelet)
  - Story origins in Varanasi's sacred ghats
  - Vision for collaborative, evolving "Living Storyworld"
  - Indian heritage bridging to global adventures

### Contact Form Section
- **Professional Contact Experience**:
  - Headline: "Let's Build the Future of Story, Together."
  - Form fields: Name, Email, Inquiry Type dropdown, Message
  - Six inquiry type options for targeted communication
  - Gold container design using creative-tech-secondary color
- **Form Functionality**:
  - Client-side validation with required field handling
  - Submit status messages (success/error states)
  - Form reset after successful submission
  - Placeholder for backend integration
  - Responsive grid layout for name/email fields
- **User Experience**:
  - Encouraging copy emphasizing collaboration
  - Clear call-to-action with "Send Message" button
  - Professional styling with focus states
  - Error handling with fallback contact email

### Footer
- **Contact Information**:
  - Primary contact email: connect@sia.vision with mailto link
  - Branded SIA logo with circular icon design
  - "Get in touch" and "Follow us" sections
- **Social Media Integration**:
  - X (Twitter) icon with hover effects
  - Instagram icon with standard design
  - Discord icon (hidden for future activation)
  - Placeholder URLs ready for real social media accounts
- **Brand Elements**:
  - Creative Tech color scheme consistency
  - Copyright notice with year and brand message
  - "Powered by Story Protocol" attribution
  - Responsive layout with proper mobile stacking

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
- Accessibility-first design principles

## 🔧 Customization

### Colors
The Creative Tech brand colors are defined in `tailwind.config.js`:
```typescript
colors: {
  'creative-tech-primary': '#3A86FF',     // Vibrant, trustworthy Blue
  'creative-tech-secondary': '#FFAB00',   // Energetic, creative Orange/Mango
  'creative-tech-accent': '#48D8D0',      // Bright Teal/Mint
  'creative-tech-surface': '#F8F9FA',     // Light Grey / Off-White
  'creative-tech-on-surface': '#1c1b1f',  // Dark Grey/Near Black
  'brand-orange': {
    '300': '#EFB36D',
    '400': '#EFAC64', 
    '500': '#E99F4E',
    '600': '#FE6E06',
  },
}
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

// StakeholderBenefitsSection.tsx
const STAKEHOLDER_CARDS = [
  // Add or modify stakeholder types
];
```

### Navigation
Add new navigation items in `Navbar.tsx`:
```typescript
const navigationItems: NavigationItem[] = [
  { label: "Home", href: "#", isActive: true },
  { label: "How it works", href: "#how-it-works" },
  { label: "Flywheel", href: "#flywheel" },
  { label: "For You", href: "#for-you" },
  { label: "Genesis IP", href: "#meet-sia" },
  { label: "Contact", href: "#join-ecosystem" },
];
```

## 🖼️ Assets

The project uses optimized local assets for performance:

### SVG Illustrations
- `/for-you-1.svg` - Visionaries & IP Originators
- `/for-you-2.svg` - Co-Creators & Builders  
- `/for-you-3.svg` - Developers & Distributors
- `/create-flywheel.svg` - Create stage illustration
- `/build-flywheel.svg` - Build stage illustration  
- `/distribute-flywheel.svg` - Distribute stage illustration
- Various feature illustrations for How It Works section

### Video Content
- `/sia-a-universe-reimagined.mp4` - SIA Universe Teaser
- `/sia-journey_begins.mp4` - SIA Journey Origins

## 🎬 Video Implementation

### Best Practices Used
- **Performance**: Videos only auto-play when in viewport
- **User Control**: Hover-to-unmute functionality
- **Accessibility**: Proper video controls and fallback content
- **Mobile Optimization**: `playsInline` attribute for iOS compatibility
- **SEO**: Semantic HTML structure with descriptive content

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
- Next.js team for the excellent framework
- Tailwind CSS for responsive design utilities
- Indian cultural heritage for SIA's rich narrative foundation
