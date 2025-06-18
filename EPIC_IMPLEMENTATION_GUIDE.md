# SIA Epic Implementation Guide

## Overview
This guide provides step-by-step instructions for implementing the three major epics for SIA's intelligent workspace.

## Installation Requirements

### Frontend Dependencies
```bash
cd apps/web
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder @tiptap/extension-character-count @tiptap/extension-bubble-menu @tiptap/extension-floating-menu @tiptap/extension-collaboration @tiptap/extension-collaboration-cursor
```

### Backend Dependencies
The Firebase Functions already have the necessary dependencies installed.

## Epic 1: Intelligent Workspace & Project Creation

### 1.1 Natural Language Storyworld Creation (✅ Complete)
- Already implemented in `processCreativePrompt` function
- Frontend integration exists in Dashboard component

### 1.2 Standalone Asset Creation (✅ Implemented)
**Backend Functions Added:**
- `createStandaloneAsset` - Creates assets without storyworld association
- `assignAssetToStoryworld` - Links standalone assets to storyworlds

**Frontend Integration:**
```typescript
// In Dashboard component
const { createStandaloneAsset } = useFirebaseFunctions();

const handleCreateAsset = async (assetType: Asset['type']) => {
  const result = await createStandaloneAsset({
    assetType,
    aiAssisted: true,
  });
  // Navigate to Canvas with new asset
};
```

## Epic 2: Collaborative & AI-Powered Canvas

### 2.1 Tiptap Editor Integration
**Components Created:**
- `TiptapCanvas.tsx` - Main editor component with Tiptap
- `CharacterProfileNode.tsx` - Custom node for character profiles
- `LoreEntryNode.tsx` - Custom node for lore entries

**Features Implemented:**
- Slash commands (/) for quick formatting
- Bubble menu for text selection
- Auto-save with debouncing
- Custom nodes for structured content

### 2.2 AI Co-pilot Features (✅ Implemented)
**Backend Functions Added:**
- `generateTextExpansion` - Expands selected text with AI
- `generateImageFromDescription` - Creates images from text descriptions
- `suggestPlotPoints` - Suggests plot developments

**Frontend Integration:**
- AI panel with quick actions
- Contextual text expansion in bubble menu
- Image generation from descriptions

## Epic 3: Asset Protection & Programmable IP

### 3.1 Story Protocol Registration (✅ Enhanced)
**Current Implementation:**
- Basic registration exists in `registerAssetAsIP`
- Need to implement proper Privy transaction signing

**Privy Transaction Signing Pattern:**
```typescript
// Backend prepares transaction
const preparedTx = await storyClient.ipa.register.prepare({...});

// Frontend signs with Privy
const { sendTransaction } = useSendTransaction();
const { hash } = await sendTransaction(preparedTx);

// Backend confirms registration
await confirmRegistration(assetId, hash);
```

### 3.2 License Terms Management (✅ Basic Implementation)
**Current Functions:**
- `attachLicenseTerms` exists
- Need UI for license configuration

**License UI Component:**
```typescript
<LicenseTermsModal
  ipId={asset.ipId}
  onSave={async (terms) => {
    await attachLicenseTerms({
      ipId: asset.ipId,
      terms
    });
  }}
/>
```

### 3.3 Derivative Creation (✅ Implemented)
**Backend Functions Added:**
- `createDerivativeAsset` - Creates derivative with parent relationship
- `registerDerivativeAsIP` - Registers derivative on Story Protocol

**Frontend Workflow:**
1. User views registered asset
2. Clicks "Create Remix"
3. System creates derivative asset
4. User edits in Canvas
5. User registers derivative

## Implementation Checklist

### Phase 1 (Current Status)
- [x] Standalone asset creation backend
- [x] AI text expansion function
- [x] AI image generation function
- [x] Derivative asset creation
- [ ] Tiptap editor integration in Canvas
- [ ] Custom node components

### Phase 2 (Next Steps)
- [ ] Replace textarea Canvas with TiptapCanvas
- [ ] Add useDebounce hook for auto-save
- [ ] Implement Privy transaction signing flow
- [ ] Create license terms UI component
- [ ] Add derivative relationship visualization

### Phase 3 (Polish)
- [ ] Collaborative editing with Y.js
- [ ] Advanced AI features (style transfer, character consistency)
- [ ] Performance optimization for large documents
- [ ] Offline support with IndexedDB

## Testing Considerations

### Unit Tests
- Test custom Tiptap nodes
- Test AI function fallbacks
- Test derivative permission logic

### Integration Tests
- Test full storyworld creation flow
- Test asset registration with mock Story Protocol
- Test derivative creation workflow

### E2E Tests
- Test prompt to storyworld creation
- Test Canvas editing and auto-save
- Test IP registration flow

## Performance Optimizations

### Frontend
- Lazy load Tiptap extensions
- Virtual scrolling for long documents
- Debounced auto-save (already implemented)

### Backend
- Cache AI responses for similar prompts
- Batch asset updates
- Optimize MongoDB queries with indexes

## Security Considerations

1. **Input Validation**: All user inputs sanitized
2. **Rate Limiting**: AI functions have usage limits
3. **Access Control**: Ownership checks on all mutations
4. **Transaction Safety**: Retry logic for blockchain operations

## Deployment Steps

1. Deploy Firebase Functions:
   ```bash
   ./deploy-functions.sh
   ```

2. Update frontend dependencies:
   ```bash
   cd apps/web && npm install
   ```

3. Build and deploy frontend:
   ```bash
   ./deploy.sh
   ```

## Monitoring & Analytics

Track these key metrics:
- AI function success rates
- Asset creation funnel
- Registration completion rates
- Editor performance (save times, content size)

## Future Enhancements

1. **Real-time Collaboration**: Multiple users editing simultaneously
2. **Version History**: Track changes over time
3. **AI Model Fine-tuning**: Custom models for specific genres
4. **Advanced Licensing**: Complex royalty splitting
5. **Cross-chain Support**: Beyond Story Protocol

## Support & Documentation

- Internal docs: `/docs` folder
- API reference: Auto-generated from TypeScript
- User guides: In-app tutorials
- Support: Discord community

---

This implementation guide will be updated as features are completed and new requirements emerge.