# SIA Modern - Creative Story Platform with Web3 Identity

A comprehensive story creation and publishing platform with phone-first authentication and multi-chain wallet management. Built with Next.js, Firebase, and TypeScript, organized as a monorepo using Turborepo and pnpm.

## 🌟 Key Features

### **🎨 Story Creation Platform**
- **AI-Powered Storyworld Creation**: Google Genkit integration with Gemini 1.5 Flash for intelligent story generation ✨ NEW
- **Smart Confirmation System**: User-editable AI suggestions with confidence scoring and complete provenance ✨ NEW
- **Notion-Style Canvas**: Clean, intuitive writing interface with slash commands and inline formatting
- **Collections Library**: Organize and publish story collections with beautiful card-based interface
- **Publishing Workflow**: One-click publishing with draft management and community sharing
- **Asset Management**: Create and manage characters, lore, artifacts, and storyworlds

### **📱 Web3 Identity & Authentication**
- **Phone-First Authentication**: Secure phone verification with invisible reCAPTCHA
- **🔗 Multi-Chain Wallets**: Automatic creation of Ethereum and Solana wallets
- **📖 Story Protocol Integration**: Native support for Story Protocol using Ethereum addresses
- **⚡ Async Wallet Creation**: Fast authentication with background wallet provisioning

### **🎯 Modern User Experience**
- **AI-Enhanced Dashboard**: Natural language story creation with intelligent suggestions ✨ NEW
- **Dashboard-Centric Design**: Single-page app experience with sidebar navigation
- **Responsive Design**: Beautiful, modern UI with Tailwind CSS
- **Real-time Interactions**: Smooth animations and instant feedback

## 🏗️ Architecture

This monorepo contains:

- **`apps/web`** - Next.js 14 frontend with modern dashboard interface
- **`apps/functions`** - Firebase Cloud Functions for auth, wallets, and story management
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
3. **Dashboard access** - Modern creative workspace with AI-powered tools
4. **AI Story creation** - Type natural language prompts to generate complete storyworlds ✨ NEW
5. **Confirmation & editing** - Review and customize AI suggestions before creation ✨ NEW
6. **Collection management** - Organize and publish your creative collections

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
│   ├── web/                    # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/            # App Router pages
│   │   │   │   ├── about/      # About page
│   │   │   │   ├── join/       # Authentication flow
│   │   │   │   ├── dashboard/  # Main creative workspace
│   │   │   │   └── profile/    # User profile (redirects to dashboard)
│   │   │   ├── components/     # React components
│   │   │   │   ├── auth/       # Authentication components
│   │   │   │   ├── dashboard/  # Dashboard & story creation components
│   │   │   │   │   ├── Canvas.tsx           # Notion-style unified editor
│   │   │   │   │   ├── DashboardContainer.tsx # Main dashboard orchestrator
│   │   │   │   │   ├── Dashboard.tsx        # Home dashboard with AI prompts
│   │   │   │   │   ├── Explore.tsx          # Community discovery hub
│   │   │   │   │   ├── Library.tsx          # Asset management interface
│   │   │   │   │   ├── OnboardingFlow.tsx   # First-time user guidance
│   │   │   │   │   ├── Profile.tsx          # User profile management
│   │   │   │   │   ├── Sidebar.tsx          # Navigation sidebar
│   │   │   │   │   ├── StoryworldHub.tsx    # Individual project workspace
│   │   │   │   │   ├── StoryPromptInput.tsx # AI prompt interface
│   │   │   │   │   ├── TypingIndicator.tsx  # Loading animation
│   │   │   │   │   └── types.ts             # TypeScript definitions
│   │   │   │   ├── hero/       # Landing page sections
│   │   │   │   └── navigation/ # Navigation components
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   ├── lib/            # Utilities and configurations
│   │   │   └── types/          # TypeScript type definitions
│   │   ├── public/             # Static assets
│   │   │   └── story-protocol.svg # Official Story Protocol logo
│   │   └── package.json
│   └── functions/              # Firebase Cloud Functions
│       ├── src/
│       │   └── index.ts        # Cloud Functions (auth, wallets, stories)
│       ├── lib/
│       └── package.json
├── packages/
│   └── shared/                 # Shared code
│       ├── src/
│       │   ├── types.ts        # Common TypeScript types
│       │   ├── utils.ts        # Utility functions
│       │   └── firebase.ts     # Firebase configuration
│       └── package.json
├── ARCHITECTURE.md             # System architecture documentation
├── STORYWORLD_API.md          # Story & asset management API docs
├── turbo.json                 # Turborepo configuration
├── package.json               # Root package.json with workspaces
├── firebase.json              # Firebase configuration
├── firestore.indexes.json     # Firestore database indexes
├── firestore.rules           # Firestore security rules
├── deploy.sh                 # Full deployment script
├── deploy-hosting-only.sh    # Frontend-only deployment
└── deploy-functions.sh       # Backend-only deployment
```

## 🤖 AI-Powered Story Creation

### Google Genkit Integration ✨ NEW

SIA Modern now features full AI capabilities powered by Google's Genkit framework:

- **🧠 Gemini 1.5 Flash Model**: Advanced language model for creative story generation
- **🎯 Intent Detection**: AI analyzes user prompts to understand creative goals
- **📊 Confidence Scoring**: Intelligent routing based on AI confidence levels
- **✏️ User Confirmation**: Editable AI suggestions before storyworld creation
- **💾 Complete Provenance**: Full AI context stored for transparency and future improvements

### AI Creation Flow

1. **Natural Language Input**: Users type creative prompts in plain English
2. **AI Processing**: System generates complete storyworld concepts with names, descriptions, genres, and themes
3. **Smart Routing**: High-confidence results (>80%) show confirmation modal, lower confidence provides manual suggestions
4. **User Control**: Edit all AI-generated details before confirming creation
5. **Context Preservation**: Original prompts, AI analysis, and confidence scores stored in database

## 🎨 Story Creation Platform

### Dashboard Interface

The main dashboard provides a modern, AI-enhanced interface for story creation:

- **🤖 AI Story Prompt**: Large text input with intelligent processing and suggestion pills
- **⚡ Quick Actions**: Character Creator, World Builder, Story Architect, Dialogue Writer
- **📚 Collections Library**: Beautiful card-based interface for organizing story collections
- **👤 Profile Integration**: Seamless access to user profile and wallet information

### Collections Management

- **📝 Draft Management**: Create and iterate on story collections before publishing
- **🚀 One-Click Publishing**: Simple publishing workflow with confirmation modals
- **📊 Analytics**: View counts, connections, and engagement metrics
- **🔍 Search & Filter**: Find collections by type, status, or content
- **🏷️ Collection Types**: Characters, Lore, Artifacts, Storyworlds, Mixed collections

### Asset Types

- **👤 Characters**: Detailed character profiles with traits and backstories
- **📚 Lore**: World-building elements and historical events
- **⚔️ Artifacts**: Unique items with special properties and histories
- **🌍 Storyworlds**: Complete universes with interconnected elements
- **📖 Chapters**: Story segments and narrative content

## 🔐 Authentication & Wallet System

### Phone-First Authentication Flow

1. **Social Sign-In**: Users authenticate with Google OAuth
2. **Phone Verification**: Mandatory phone number verification for security
3. **Dashboard Redirect**: Direct access to creative workspace
4. **Wallet Creation**: Automatic creation of blockchain wallets in background

### Supported Wallets

- **Ethereum**: Primary EVM wallet for Ethereum mainnet and Layer 2s
- **Solana**: Native Solana wallet for SPL tokens and NFTs  
- **Story Protocol**: Integrated using Ethereum address (IP & licensing ready)

### Backend Functions

#### Authentication & Wallets
- `onUserCreate`: Creates user profile (no wallets during social sign-in)
- `onPhoneVerified`: Fast phone verification with async wallet creation
- `checkPhoneNumber`: Validates phone number availability
- `provisionUserWallet`: Creates individual wallets on demand
- `provisionAllWallets`: Bulk wallet creation for existing users

#### AI & Story Management ✨ NEW
- `processCreativePrompt`: AI-powered storyworld generation using Gemini 1.5 Flash
- `enhanceStoryworld`: AI enhancement of existing storyworlds with additional content
- `createStoryworld`: Creates new story containers with optional AI context
- `getUserStoryworlds`: Retrieves user's story collections
- `saveAsset`: Creates/updates story assets (characters, lore, etc.)
- `getAssetById`: Retrieves specific story assets
- `getStoryworldAssets`: Gets all assets for a storyworld with filtering

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

### Quick Deployment
```bash
# Deploy web app only (fastest)
./deploy-hosting-only.sh

# Deploy backend functions only
./deploy-functions.sh

# Full deployment (functions + hosting)
./deploy.sh
```

### Manual Deployment
```bash
# Frontend only
cd apps/web && pnpm build && firebase deploy --only hosting

# Backend only
cd apps/functions && pnpm build && firebase deploy --only functions

# Database rules and indexes
firebase deploy --only firestore
```

## 🔒 Security

- **Firebase Security Rules**: Protect user data and story collections
- **Authentication Required**: All story creation features require authentication
- **Owner-Based Access**: Users can only access their own stories and assets
- **Rate Limiting**: Contact forms and API calls are rate-limited
- **Input Validation**: All user inputs are sanitized and validated

## 📊 Database Structure

### Firestore Collections

- **`users`**: User profiles and metadata
- **`wallets`**: Blockchain wallet addresses by chain type
- **`storyworlds`**: Top-level story containers
- **`assets`**: Story elements (characters, lore, artifacts)
- **`enquiries`**: Contact form submissions

### Firestore Indexes

Optimized indexes for:
- User story queries by ownership and update time
- Asset filtering by type, status, and IP registration
- Cross-collection story asset relationships

## 📝 API Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)**: Complete system architecture
- **[STORYWORLD_API.md](./STORYWORLD_API.md)**: Story & asset management API
- **[SECURITY.md](./SECURITY.md)**: Security implementation details
- **[SETUP_FIREBASE.md](./SETUP_FIREBASE.md)**: Firebase configuration guide

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🚀 Built With

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Firebase Functions, Firestore, Firebase Auth
- **External APIs**: Privy (wallet creation), SendGrid (email)
- **Build Tools**: Turborepo, pnpm, ESLint, TypeScript
- **Deployment**: Firebase Hosting, Firebase Functions
