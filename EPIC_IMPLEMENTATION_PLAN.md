# SIA Epic Implementation Plan

## Research Findings

### 1. Tiptap Custom Nodes
- Tiptap supports React node views for creating custom structured content
- Use `ReactNodeViewRenderer` for custom components within the editor
- Supports collaborative editing with Y.js integration

### 2. AI Text Generation APIs
- Google's Gemini API (already integrated)
- Can enhance with specialized creative writing models
- Support for text expansion, image description generation

### 3. Story Protocol Transaction Signing
- Privy supports transaction signing with custody wallets
- Use "prepare on backend, sign on frontend" pattern
- Support for both Ethereum and Solana transactions

## Epic 1: Intelligent Workspace & Project Creation

### User Story 1.1: Natural Language Storyworld Creation
**Status**: Partially Complete ✅
- `processCreativePrompt` function exists
- `createStoryworld` function exists
- Frontend has StoryPromptInput and Dashboard integration

**Remaining Tasks**:
1. Enhance AI prompt analysis with better entity extraction
2. Add confidence scoring for auto-creation threshold
3. Implement story template suggestions

### User Story 1.2: Standalone Asset Creation
**Status**: Not Implemented ❌

**Required Implementation**:
1. Create `createStandaloneAsset` Firebase Function
2. Update Canvas to handle assets without storyworlds
3. Add asset-to-storyworld assignment flow

## Epic 2: Collaborative & AI-Powered Canvas

### User Story 2.1: Tiptap Editor with Custom Nodes
**Status**: Not Implemented ❌
- Current Canvas uses basic textarea

**Required Implementation**:
1. Install and configure Tiptap
2. Create custom nodes:
   - CharacterProfileNode
   - LoreEntryNode
   - StorylineNode
   - ImageNode
3. Implement auto-save with debouncing

### User Story 2.2: AI Co-pilot Features
**Status**: Not Implemented ❌

**Required Implementation**:
1. Create AI Gateway Functions:
   - `generateTextExpansion`
   - `generateImageFromDescription`
   - `suggestPlotPoints`
2. Build AI panel UI in Canvas
3. Implement contextual BubbleMenu

## Epic 3: Asset Protection & Programmable IP

### User Story 3.1: Story Protocol Registration
**Status**: Partially Complete ✅
- `registerAssetAsIP` function exists
- Basic Story Protocol integration complete

**Remaining Tasks**:
1. Implement proper transaction signing flow with Privy
2. Add registration status tracking
3. Create confirmation modals

### User Story 3.2: License Terms Management
**Status**: Basic Implementation ✅
- `attachLicenseTerms` function exists

**Remaining Tasks**:
1. Create license terms UI
2. Implement PIL template selection
3. Add royalty configuration

### User Story 3.3: Derivative Creation
**Status**: Not Implemented ❌

**Required Implementation**:
1. Create `createDerivativeAsset` function
2. Build derivative relationship UI
3. Implement royalty inheritance logic

## Implementation Priority

### Phase 1 (Week 1-2)
1. Standalone asset creation (Epic 1.2)
2. Tiptap integration with basic custom nodes (Epic 2.1)
3. Story Protocol transaction signing flow (Epic 3.1)

### Phase 2 (Week 3-4)
1. AI text expansion and image generation (Epic 2.2)
2. Complete custom nodes for all asset types
3. License terms UI (Epic 3.2)

### Phase 3 (Week 5-6)
1. Derivative creation workflow (Epic 3.3)
2. Advanced AI features (plot suggestions, character development)
3. Performance optimization and testing

## Technical Dependencies
- Tiptap v2 with React integration
- @tiptap/extension-bubble-menu
- @tiptap/extension-collaboration
- Enhanced Gemini API prompts
- Privy transaction signing
- Story Protocol SDK v1.1.0

## Risk Mitigation
1. **AI Reliability**: Implement fallback patterns for AI failures
2. **Transaction Failures**: Add retry logic and clear error messaging
3. **Performance**: Implement virtual scrolling for large documents
4. **Data Loss**: Add offline support with local storage backup