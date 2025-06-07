# SIA.Vision - Reimagining Stories for the New World

A modern, responsive landing page for SIA.Vision built with Next.js, React, Tailwind CSS, and Firebase. Features comprehensive storytelling platform showcase with interactive sections for creators, builders, and distributors.

## 🚀 Tech Stack

- **Framework**: Next.js 14.2.3
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4.1
- **Backend**: Firebase (Cloud Functions, Firestore, Hosting)
- **Email Service**: SendGrid (configured in Cloud Functions)
- **Package Manager**: npm
- **Code Quality**: ESLint 9 (eslint.config.mjs), Prettier 3.5.3
- **Icons**: Lucide React 0.511.0
- **Animations**: Framer Motion 12.12.2

## ✨ Latest Features

### 🎨 Sticky Navigation
- **Always Visible**: Navbar stays at top when scrolling
- **Full Width**: Spans entire viewport for desktop and mobile
- **Mobile Menu**: Fixed hamburger menu with high z-index
- **Smooth Scrolling**: Navigate between sections seamlessly

### 🔥 Firebase Integration
- **Contact Form Backend**: Cloud Functions with email notifications
- **Firestore Database**: Secure contact submission storage
- **SendGrid Emails**: Beautiful HTML email templates
- **Development Environment**: Local emulators for testing

### 📱 Mobile-First Design
- **Responsive Navigation**: Working hamburger menu on all devices
- **Touch Optimized**: Proper touch targets and interactions
- **Z-Index Management**: Menu appears above all content including hero
- **Optimized Spacing**: Reduced padding for better mobile experience

## ��️ Project Structure

```
sia-monorepo/
├── apps/
│   ├── web/                 # Next.js frontend
│   │   ├── src/
│   │   ├── public/
│   │   ├── next.config.mjs
│   │   ├── postcss.config.mjs
│   │   ├── tailwind.config.js
│   │   ├── tsconfig.json
│   │   └── package.json
│   └── functions/           # Firebase Cloud Functions
│       ├── src/
│       ├── tsconfig.json
│       └── package.json
├── firebase.json            # Firebase configuration
├── firestore.rules          # Database security
├── firestore.indexes.json   # Database indexes
├── .firebaserc              # Project settings
├── deploy.sh                # Full deployment
├── deploy-hosting-only.sh   # Hosting only
├── deploy-functions.sh      # Functions only
├── dev.sh                   # Development environment
├── eslint.config.mjs        # ESLint config
├── package.json             # Turborepo root
└── .prettierrc
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Firebase CLI: `npm install -g firebase-tools`

### Development Setup

1. **Install dependencies**:
   ```bash
   cd sia-monorepo
   npm install
   ```

2. **Start development environment**:
   ```bash
   npm run dev
   # Or use ./dev.sh to launch Firebase emulators alongside Next.js
   ```

3. **Access your app**:
   - **Next.js**: http://localhost:3000
   - **Firebase UI**: http://localhost:4000
   - **Functions**: http://localhost:5001

### Deployment

1. **Quick deployment** (hosting only):
   ```bash
   ./deploy-hosting-only.sh
   ```

2. **Full deployment** (with functions):
   ```bash
   ./deploy.sh
   ```

## 🔧 Configuration Files

### Current Config Files
- ✅ `eslint.config.mjs` - ESLint 9 flat config (not .json)
- ✅ `tailwind.config.js` - Tailwind CSS configuration
- ✅ `next.config.mjs` - Next.js configuration  
- ✅ `postcss.config.mjs` - PostCSS with Tailwind (working correctly)
- ✅ `tsconfig.json` - TypeScript configuration

### Firebase Files
- ✅ `firebase.json` - Services configuration
- ✅ `firestore.rules` - Database security
- ✅ `firestore.indexes.json` - Query optimization
- ✅ `.firebaserc` - Project ID (sia-vision)

## 🎯 Fixed Issues

### ✅ Navigation Menu
- **Fixed z-index conflicts**: Menu now appears above hero section
- **Working hamburger**: All navigation items visible on mobile/iPad
- **Sticky positioning**: Navbar stays visible while scrolling
- **Proper spacing**: Reduced padding for better mobile experience

### ✅ Favicon Implementation
- **Correct location**: Moved to `/app` directory for Next.js 13+
- **SIA branding**: Blue circle with "SIA" text
- **Multiple formats**: ICO and SVG for browser compatibility
- **Cache busting**: Proper refresh handling

### ✅ Repository Structure
- **Main directory**: Now a Turborepo at `sia-monorepo/`
- **Firebase integration**: All config files in the root directory
- **Deployment scripts**: Updated for new monorepo paths
- **Development workflow**: Streamlined setup process

## 📧 Contact Form Features

### Firebase Integration
- **Cloud Functions**: Server-side form processing
- **SendGrid**: Professional email delivery
- **Firestore**: Secure data storage
- **Validation**: Client and server-side validation
- **Email Templates**: Admin notifications and user auto-replies

### Security
- **Server-only access**: Firestore rules prevent client access
- **Input sanitization**: XSS prevention
- **Rate limiting**: Built-in Firebase protection

## 🎨 Design System

### Colors
- **Primary Blue**: #3A86FF (navigation, CTAs)
- **Accent Teal**: #48D8D0 (highlights, effects)
- **Secondary Gold**: #FFAB00 (contact form, accents)

### Typography
- **Headers**: Serif fonts for elegance
- **Body**: Sans-serif for readability
- **Navigation**: Clean, medium weight

## 📱 Mobile Experience

### Responsive Design
- **Mobile-first**: Optimized for touch devices
- **Sticky navigation**: Always accessible menu
- **Touch targets**: Minimum 44px for accessibility
- **Optimized spacing**: Reduced padding for mobile

### Performance
- **Static export**: Fast CDN delivery
- **Image optimization**: Automatic WebP conversion
- **Code splitting**: Route-based optimization

## 🔒 Security & Best Practices

### Firebase Security
- **Firestore rules**: Server-side only access
- **Function validation**: Input sanitization
- **Environment variables**: Secure API key management

### Code Quality
- **TypeScript strict**: Full type safety
- **ESLint rules**: Code quality enforcement
- **Prettier formatting**: Consistent code style

## 📊 Available Scripts

```bash
# Development
npm run dev          # Start dev server
./dev.sh            # Start dev + Firebase emulators

# Build & Deploy  
npm run build       # Build for production
./deploy.sh         # Deploy everything
./deploy-hosting-only.sh  # Deploy hosting only

# Code Quality
npm run lint        # ESLint checks
npm run type-check  # TypeScript validation
```

## 🎯 Next Steps

### Contact Form Activation
1. **Firebase upgrade**: Upgrade to Blaze plan for Cloud Functions
2. **SendGrid setup**: Configure API key and verify domains
3. **Email testing**: Test form submissions end-to-end

### Additional Features
- **Analytics**: Firebase Analytics integration
- **SEO**: Meta tags and Open Graph optimization
- **Performance**: Core Web Vitals monitoring

## 📞 Support

- **Live Site**: https://sia-vision.web.app
- **Email**: connect@sia.vision
- **Firebase Project**: sia-vision

---

**Built for the future of collaborative storytelling with Next.js 14.2.3, Firebase, and modern web technologies.**
