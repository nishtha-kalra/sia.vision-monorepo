# SIA Modern - Monorepo

A modern full-stack application built with Next.js, Firebase, and TypeScript, organized as a monorepo using Turborepo and pnpm.

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
│   │   ├── public/
│   │   └── package.json
│   └── functions/           # Firebase Cloud Functions
│       ├── src/
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
└── firebase.json           # Firebase configuration
```

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

### Runtime Requirements

- **Functions**: Node.js 20 (LTS)
- **Web App**: Next.js 14 with static export
- **Authentication**: Google Sign-In enabled in Firebase Console

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

## 🚀 Performance

- **Turborepo Caching**: Intelligent build caching for faster builds
- **Parallel Execution**: Run tasks across packages simultaneously
- **Incremental Builds**: Only rebuild what changed
- **pnpm**: Fast, disk space efficient package manager
- **Workspace Filtering**: Run commands on specific packages only

## 📚 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, Material-UI
- **Backend**: Firebase Cloud Functions, Node.js 20, TypeScript
- **Database**: Firestore (with email indexing)
- **Authentication**: Firebase Auth (Google Sign-In)
- **Build Tool**: Turborepo
- **Package Manager**: pnpm workspaces
- **Runtime**: Node.js 20 LTS

## 🤝 Contributing

1. Clone the repository
2. Install pnpm: `npm install -g pnpm`
3. Install dependencies: `pnpm install`
4. Create `.env.local` in `apps/web/` with Firebase config
5. Start development: `pnpm run --filter=@sia/web dev`
6. Make your changes
7. Run tests: `pnpm run lint && pnpm run type-check`
8. Submit a pull request

## 📄 License

This project is private and proprietary.

---

Built with ❤️ using Turborepo and modern web technologies.
