# SIA Modern - Advanced Web3 Identity Platform

A modern full-stack Web3 application with phone-first authentication and multi-chain wallet management. Built with Next.js, Firebase, and TypeScript, organized as a monorepo using Turborepo and pnpm.

## 🌟 Key Features

- **📱 Phone-First Authentication**: Secure phone verification with invisible reCAPTCHA
- **🔗 Multi-Chain Wallets**: Automatic creation of Ethereum and Solana wallets
- **📖 Story Protocol Integration**: Native support for Story Protocol using Ethereum addresses
- **⚡ Async Wallet Creation**: Fast authentication with background wallet provisioning
- **🎨 Modern UI/UX**: Beautiful, responsive design with Tailwind CSS
- **🏗️ Monorepo Architecture**: Organized codebase with shared types and utilities

## 🏗️ Architecture

This monorepo contains:

- **`apps/web`** - Next.js 14 frontend application with static export
- **`apps/functions`** - Firebase Cloud Functions backend (Node.js 20)
- **`packages/shared`** - Shared types, utilities, and configurations

## ⚡ Quick Start

```bash
# Install pnpm globally (if not already installed)
npm install -g pnpm

# Install dependencies
pnpm install

# Start development - Web app only (fastest)
pnpm run --filter=@sia/web dev

# Start all development servers
pnpm run dev

# Build all packages
pnpm run build

# Run linting across all packages
pnpm run lint

# Type check all packages
pnpm run type-check
```

## 🚀 Live Demo

**Website**: [https://sia-vision.web.app](https://sia-vision.web.app)

### User Journey
1. **Sign up with Google** - Fast social authentication
2. **Phone verification** - Secure SMS-based verification (2-3 seconds)
3. **Wallet creation** - Automatic Ethereum & Solana wallets (background process)
4. **Profile access** - View wallets including Story Protocol integration

## 🖥️ Local Development (Web Only)

For quick frontend development:

```bash
# Navigate to web app and start dev server
cd apps/web && pnpm dev

# Or use the workspace filter (from root)
pnpm run --filter=@sia/web dev
```

This starts the Next.js dev server at `http://localhost:3000`

## 📁 Project Structure

```
sia-modern/
├── apps/
│   ├── web/                 # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/         # App Router pages
│   │   │   │   ├── about/   # About page
│   │   │   │   ├── join/    # Authentication flow
│   │   │   │   └── profile/ # User dashboard
│   │   │   ├── components/  # React components
│   │   │   │   ├── auth/    # Authentication components
│   │   │   │   ├── hero/    # Landing page sections
│   │   │   │   └── navigation/ # Navigation components
│   │   │   ├── hooks/       # Custom React hooks
│   │   │   ├── lib/         # Utilities and configurations
│   │   │   └── types/       # TypeScript type definitions
│   │   ├── public/          # Static assets
│   │   │   └── story-protocol.svg # Official Story Protocol logo
│   │   └── package.json
│   └── functions/           # Firebase Cloud Functions
│       ├── src/
│       │   └── index.ts     # Cloud Functions (phone auth, wallet creation)
│       ├── lib/
│       └── package.json
├── packages/
│   └── shared/              # Shared code
│       ├── src/
│       │   ├── types.ts     # Common TypeScript types
│       │   ├── utils.ts     # Utility functions
│       │   └── firebase.ts  # Firebase configuration
│       └── package.json
├── turbo.json              # Turborepo configuration
├── package.json            # Root package.json with workspaces
├── firebase.json           # Firebase configuration
├── deploy.sh               # Full deployment script
├── deploy-hosting-only.sh  # Frontend-only deployment
└── deploy-functions.sh     # Backend-only deployment
```

## 🔐 Authentication & Wallet System

### Phone-First Authentication Flow

1. **Social Sign-In**: Users authenticate with Google, Apple, or Facebook
2. **Phone Verification**: Mandatory phone number verification for security
3. **Wallet Creation**: Automatic creation of blockchain wallets after verification

### Supported Wallets

- **Ethereum**: Primary EVM wallet for Ethereum mainnet and Layer 2s
- **Solana**: Native Solana wallet for SPL tokens and NFTs  
- **Story Protocol**: Integrated using Ethereum address (no separate wallet needed)

### Backend Functions

- `onUserCreate`: Creates user profile (no wallets during social sign-in)
- `onPhoneVerified`: Fast phone verification with async wallet creation
- `checkPhoneNumber`: Validates phone number availability
- `provisionUserWallet`: Creates individual wallets on demand
- `provisionAllWallets`: Bulk wallet creation for existing users

## 🛠️ Development

### Frontend (Web App)
```bash
# From root directory
pnpm run --filter=@sia/web dev    # Start development server
pnpm run --filter=@sia/web build  # Build for production
pnpm run --filter=@sia/web lint   # Run ESLint

# Or navigate to directory
cd apps/web
pnpm dev           # Start development server
pnpm build         # Build for production  
pnpm lint          # Run ESLint
```

### Backend (Functions)
```bash
# From root directory
pnpm run --filter=@sia/functions dev    # TypeScript compiler watch mode
pnpm run --filter=@sia/functions build  # Build functions
pnpm run --filter=@sia/functions deploy # Deploy to Firebase

# Or navigate to directory
cd apps/functions
pnpm dev           # Start TypeScript compiler in watch mode
pnpm serve         # Start Firebase emulator
pnpm deploy        # Deploy to Firebase
```

### Shared Package
```bash
# From root directory
pnpm run --filter=@sia/shared build  # Build TypeScript
pnpm run --filter=@sia/shared dev    # Build in watch mode

# Or navigate to directory
cd packages/shared
pnpm build         # Build TypeScript
pnpm dev           # Build in watch mode
```

## 🔧 Turborepo Commands

Turborepo with pnpm allows you to run commands across all packages efficiently:

```bash
# Run dev for all packages in parallel
pnpm run dev --parallel

# Build all packages (respects dependencies)
pnpm run build

# Run linting across all packages
pnpm run lint

# Type check all packages
pnpm run type-check
```

## 🌐 Deployment

### Frontend Deployment
```bash
./deploy-hosting-only.sh    # Deploy only the web app
```

### Backend Deployment
```bash
./deploy-functions.sh       # Deploy only Firebase functions
```

### Full Deployment
```bash
./deploy.sh                 # Deploy both frontend and backend
```

All deployment scripts include automatic building and optimization.

## 🔥 Firebase Setup

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init`
4. Create `.env.local` in `apps/web/` directory
5. Add your Firebase configuration to `.env.local`

### Required Environment Variables

Create `apps/web/.env.local`:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**Note**: The `.env.local` file is ignored by Git for security. Get your Firebase config from Firebase Console → Project Settings → General → Your apps.

### Configure Privy Secrets for Functions

Set your Privy credentials using the Firebase CLI:

```bash
firebase functions:config:set privy.app_secret="YOUR_PRIVY_APP_SECRET"
firebase functions:config:set privy.app_id="YOUR_PRIVY_APP_ID"
```

### Firebase Services Configuration

- **Authentication**: Enable Google, Apple, and Facebook providers
- **Firestore**: Set up user and phone number collections with proper indexing
- **Phone Auth**: Configure reCAPTCHA for phone verification
- **Functions**: Deploy Cloud Functions for wallet management

### Runtime Requirements

- **Functions**: Node.js 20 (LTS)
- **Web App**: Next.js 14 with static export
- **Authentication**: Google Sign-In enabled in Firebase Console
- **Phone Auth**: SMS verification with reCAPTCHA

## 🎨 UI/UX Features

### Design System
- **Tailwind CSS**: Utility-first CSS framework
- **Custom Theme**: Creative tech color palette
- **Responsive Design**: Mobile-first approach
- **Smooth Animations**: Framer Motion for interactions

### Key UX Improvements
- **Invisible reCAPTCHA**: Completely hidden during phone verification
- **Fast Authentication**: 2-3 second phone verification
- **Async Wallet Creation**: Background wallet provisioning
- **Loading States**: Clear feedback during operations
- **Error Handling**: User-friendly error messages

### Accessibility
- **Semantic HTML**: Proper heading structure and landmarks
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: ARIA labels and descriptions
- **Color Contrast**: WCAG AA compliant color scheme

## 📦 Package Management

This monorepo uses **pnpm workspaces**. Dependencies are managed at the workspace level:

```bash
# Add dependency to web app
pnpm add package-name --filter=@sia/web

# Add dependency to functions
pnpm add package-name --filter=@sia/functions  

# Add dependency to shared package
pnpm add package-name --filter=@sia/shared

# Add dev dependency to root
pnpm add -D package-name

# Add dev dependency to specific workspace
pnpm add -D package-name --filter=@sia/web
```

## 🎯 Benefits of Monorepo Structure

1. **Code Sharing**: Common types and utilities in `packages/shared`
2. **Coordinated Deployments**: Deploy frontend and backend together
3. **Unified Development**: Single command to start all services
4. **Consistent Dependencies**: Shared package versions across apps
5. **Better Developer Experience**: Single repository for entire application

## 🔍 Scripts Overview

| Script | Description |
|--------|-------------|
| `pnpm run dev` | Start all development servers |
| `pnpm run --filter=@sia/web dev` | Start web app only (fastest for frontend dev) |  
| `pnpm run build` | Build all packages |
| `pnpm run lint` | Lint all packages |
| `pnpm run type-check` | Type check all packages |
| `./deploy.sh` | Deploy frontend and backend |
| `./deploy-hosting-only.sh` | Deploy frontend only |
| `./deploy-functions.sh` | Deploy backend only |

## 🚀 Performance Optimizations

### Frontend
- **Next.js 14**: Latest App Router with React Server Components
- **Static Export**: Pre-rendered pages for fast loading
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Components loaded on demand

### Backend
- **Async Processing**: Non-blocking wallet creation
- **Firestore Indexing**: Optimized database queries
- **Cloud Functions**: Serverless auto-scaling
- **Rate Limiting**: Prevents abuse and ensures reliability

### Build System
- **Turborepo Caching**: Intelligent build caching for faster builds
- **Parallel Execution**: Run tasks across packages simultaneously
- **Incremental Builds**: Only rebuild what changed
- **pnpm**: Fast, disk space efficient package manager
- **Workspace Filtering**: Run commands on specific packages only

## 📚 Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **React 18**: Latest React with concurrent features
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Web3 Icons**: Blockchain and cryptocurrency icons
- **Firebase SDK**: Authentication and Firestore integration

### Backend
- **Firebase Cloud Functions**: Serverless functions
- **Node.js 20**: Latest LTS runtime
- **TypeScript**: Type-safe server code
- **Privy API**: Wallet creation and management
- **Firestore**: NoSQL document database

### Development Tools
- **Turborepo**: Monorepo build system
- **pnpm workspaces**: Package management
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Firebase CLI**: Deployment and emulation

### Blockchain Integration
- **Ethereum**: Primary blockchain for DeFi and NFTs
- **Solana**: High-performance blockchain for trading
- **Story Protocol**: IP and content ownership protocol
- **Privy**: Enterprise wallet infrastructure

## 🔧 Configuration Files

### Important Configuration Files
- `.gitignore`: Includes proper Next.js and functions build exclusions
- `turbo.json`: Turborepo pipeline configuration
- `firebase.json`: Firebase hosting and functions setup
- `pnpm-workspace.yaml`: Workspace configuration
- `eslint.config.mjs`: Shared linting rules

### Environment Setup
- Development: Local Firebase emulators supported
- Staging: Firebase preview channels
- Production: Firebase hosting with custom domain support

## 🤝 Contributing

1. Clone the repository
2. Install pnpm: `npm install -g pnpm`
3. Install dependencies: `pnpm install`
4. Create `.env.local` in `apps/web/` with Firebase config
5. Start development: `pnpm run --filter=@sia/web dev`
6. Make your changes
7. Run tests: `pnpm run lint && pnpm run type-check`
8. Submit a pull request

### Development Guidelines
- Use TypeScript for all new code
- Follow the existing component structure
- Add proper error handling and loading states
- Test authentication flows thoroughly
- Ensure mobile responsiveness

## 📞 Phone Verification System

### Features
- **SMS Verification**: Secure phone number verification
- **International Support**: Global phone number formats
- **Rate Limiting**: Prevents spam and abuse
- **Error Handling**: Clear error messages for users
- **Invisible reCAPTCHA**: Hidden from user interface

### Implementation Details
- Firebase Phone Auth for SMS sending
- Custom Firebase Functions for phone indexing
- Phone number used as primary user identifier
- Account merging prevention for security

## 💰 Wallet Management

### Wallet Types
- **Ethereum**: EVM-compatible wallet for Ethereum and Layer 2s
- **Solana**: Native Solana wallet for SPL ecosystem
- **Story Protocol**: Uses Ethereum address for IP transactions

### Features
- **Automatic Creation**: Wallets created after phone verification
- **Background Processing**: Non-blocking wallet generation
- **Status Tracking**: Real-time wallet creation status
- **Error Recovery**: Graceful handling of creation failures

### Security
- **Privy Integration**: Enterprise-grade wallet infrastructure
- **Phone Verification**: Wallets linked to verified phone numbers
- **No Private Key Exposure**: Secure key management through Privy

## 📄 License

This project is private and proprietary.

---

Built with ❤️ using modern Web3 technologies and best practices.
