# Storyworld & Asset Management API

This document describes the Firebase Cloud Functions for managing Storyworlds and Assets in the Sia.vision platform.

## Overview

The Storyworld & Asset Management system enables creators to:
- Create and manage **Storyworlds** (top-level containers for creative projects)
- Create and manage **Assets** (characters, lore, artifacts, locations, chapters)
- Track the on-chain status of assets for Programmable IP
- Filter and search their creative library

## Data Models

### Storyworld
```typescript
interface Storyworld {
  id: string;
  ownerId: string;         // User ID who owns this storyworld
  name: string;            // Display name
  description: string;     // Optional description
  coverImageUrl?: string;  // Optional cover image URL
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Asset
```typescript
interface Asset {
  id: string;
  ownerId: string;          // User ID who owns this asset
  storyworldId: string;     // ID of the parent storyworld
  name: string;             // Display name
  type: 'CHARACTER' | 'LORE' | 'ARTIFACT' | 'LOCATION' | 'CHAPTER';
  content: object;          // Tiptap JSON content
  status: 'DRAFT' | 'PUBLISHED';
  ipStatus: 'UNREGISTERED' | 'PENDING' | 'REGISTERED';
  onChainId?: string;       // Story Protocol ID or transaction hash
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## Functions

### 1. createStoryworld

Creates a new storyworld for the authenticated user.

**Input:**
```typescript
{
  name: string;              // Required: Display name
  description?: string;      // Optional: Description
  coverImageUrl?: string;    // Optional: Cover image URL
}
```

**Output:**
```typescript
{
  storyworldId: string;
}
```

**Usage Example:**
```typescript
const createStoryworld = httpsCallable(functions, 'createStoryworld');
const result = await createStoryworld({
  name: "Cyber-Norse Chronicles",
  description: "A saga of Vikings in a neon-drenched future."
});
console.log(result.data.storyworldId);
```

### 2. getUserStoryworlds

Retrieves all storyworlds owned by the authenticated user.

**Input:** None

**Output:**
```typescript
{
  storyworlds: Storyworld[];
}
```

**Usage Example:**
```typescript
const getUserStoryworlds = httpsCallable(functions, 'getUserStoryworlds');
const result = await getUserStoryworlds();
console.log(result.data.storyworlds);
```

### 3. deleteStoryworld

Deletes a storyworld and all its associated assets.

**Input:**
```typescript
{
  storyworldId: string;
}
```

**Output:**
```typescript
{
  success: boolean;
}
```

**Usage Example:**
```typescript
const deleteStoryworld = httpsCallable(functions, 'deleteStoryworld');
const result = await deleteStoryworld({
  storyworldId: "abc123"
});
```

### 4. saveAsset

Creates a new asset or updates an existing one.

**Input:**
```typescript
{
  assetId?: string;          // Optional: If provided, updates existing asset
  storyworldId: string;      // Required: Parent storyworld ID
  name: string;              // Required: Display name
  type: string;              // Required: Asset type
  content: object;           // Required: Tiptap JSON content
}
```

**Output:**
```typescript
{
  assetId: string;
}
```

**Usage Example:**
```typescript
const saveAsset = httpsCallable(functions, 'saveAsset');

// Create new asset
const result = await saveAsset({
  storyworldId: "abc123",
  name: "Jörmungandr, the World-Eater AI",
  type: "CHARACTER",
  content: { /* Tiptap JSON */ }
});

// Update existing asset
const updateResult = await saveAsset({
  assetId: "def456",
  storyworldId: "abc123",
  name: "Updated Character Name",
  type: "CHARACTER",
  content: { /* Updated Tiptap JSON */ }
});
```

### 5. getAssetById

Retrieves a specific asset by ID.

**Input:**
```typescript
{
  assetId: string;
}
```

**Output:**
```typescript
{
  asset: Asset;
}
```

**Usage Example:**
```typescript
const getAssetById = httpsCallable(functions, 'getAssetById');
const result = await getAssetById({
  assetId: "def456"
});
console.log(result.data.asset);
```

### 6. getStoryworldAssets

Retrieves all assets for a specific storyworld with optional filtering.

**Input:**
```typescript
{
  storyworldId: string;           // Required: Storyworld ID
  filterByType?: string;          // Optional: Filter by asset type
  filterByIpStatus?: string;      // Optional: Filter by IP status
  sortBy?: string;                // Optional: Sort field (default: 'createdAt')
}
```

**Output:**
```typescript
{
  assets: Asset[];  // Note: content field is excluded for performance
}
```

**Usage Examples:**
```typescript
const getStoryworldAssets = httpsCallable(functions, 'getStoryworldAssets');

// Get all assets
const allAssets = await getStoryworldAssets({
  storyworldId: "abc123"
});

// Get only characters
const characters = await getStoryworldAssets({
  storyworldId: "abc123",
  filterByType: "CHARACTER"
});

// Get unregistered assets (ready for IP registration)
const unregistered = await getStoryworldAssets({
  storyworldId: "abc123",
  filterByIpStatus: "UNREGISTERED"
});

// Get registered assets (already on-chain)
const registered = await getStoryworldAssets({
  storyworldId: "abc123",
  filterByIpStatus: "REGISTERED"
});
```

### 7. deleteAsset

Deletes a specific asset.

**Input:**
```typescript
{
  assetId: string;
}
```

**Output:**
```typescript
{
  success: boolean;
}
```

**Usage Example:**
```typescript
const deleteAsset = httpsCallable(functions, 'deleteAsset');
const result = await deleteAsset({
  assetId: "def456"
});
```

### 8. confirmAssetRegistration

Updates an asset's status after successful on-chain registration.

**Input:**
```typescript
{
  assetId: string;     // Asset to update
  onChainId: string;   // Story Protocol ID or transaction hash
}
```

**Output:**
```typescript
{
  success: boolean;
}
```

**Usage Example:**
```typescript
const confirmAssetRegistration = httpsCallable(functions, 'confirmAssetRegistration');
const result = await confirmAssetRegistration({
  assetId: "def456",
  onChainId: "0xabc123..."
});
```

## Security

All functions require authentication. Each function validates:
- User is authenticated (`context.auth.uid`)
- User owns the resources they're trying to access (`ownerId` checks)
- Required parameters are provided

## Firestore Indexes

The following composite indexes have been deployed for optimal performance:

- `storyworlds`: `ownerId` + `updatedAt` (desc)
- `assets`: `ownerId` + `storyworldId` + `createdAt` (desc)
- `assets`: `ownerId` + `storyworldId` + `type` + `createdAt` (desc)
- `assets`: `ownerId` + `storyworldId` + `ipStatus` + `createdAt` (desc)
- `assets`: `ownerId` + `storyworldId` + `type` + `ipStatus` + `createdAt` (desc)

## Error Handling

All functions use Firebase Functions error types:
- `unauthenticated`: User not logged in
- `invalid-argument`: Missing or invalid parameters
- `permission-denied`: User doesn't own the resource
- `internal`: Server error

## Asset Types

Supported asset types:
- `CHARACTER`: Character profiles and descriptions
- `LORE`: World-building and background information
- `ARTIFACT`: Important items, weapons, tools
- `LOCATION`: Places, settings, environments
- `CHAPTER`: Story chapters or narrative segments

## IP Status Flow

1. **UNREGISTERED**: Asset is created but not on-chain
2. **PENDING**: Registration transaction is in progress (future use)
3. **REGISTERED**: Asset is successfully registered on-chain with Story Protocol

## Next Steps

For the frontend implementation, you'll want to:
1. Create TypeScript interfaces matching these data models
2. Set up Firebase Functions SDK in your web app
3. Implement authentication before calling these functions
4. Build UI components for the Creator Library using these APIs
5. Integrate with Tiptap editor for the `content` field
6. Add wallet integration for the IP registration flow 