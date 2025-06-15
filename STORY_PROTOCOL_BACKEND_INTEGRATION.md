# Story Protocol Backend Integration

This document outlines the comprehensive backend integration for Story Protocol IP protection using Firebase Functions, Privy smart wallets, and Pimlico paymaster services.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   SIA Frontend  │───▶│ Firebase Funcs  │───▶│ Story Protocol  │
│                 │    │                 │    │   Testnet       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │ Privy + Pimlico │
                       │ Smart Wallets   │
                       └─────────────────┘
```

## 🔧 Components

### 1. Story Protocol Service (`storyProtocolService.ts`)
- **Purpose**: Core service for Story Protocol interactions
- **Status**: Mock implementation for development/testing
- **Features**:
  - Enhanced IP metadata generation with storyworld context
  - PIL (Programmable IP License) template management
  - Firebase Storage integration for metadata
  - Comprehensive validation and error handling

### 2. Story Protocol Functions (`storyProtocolFunctions.ts`)
- **Purpose**: Firebase Cloud Functions for Story Protocol operations
- **Functions**:
  - `registerAssetAsIP`: Register assets as IP with PIL templates
  - `generateIPMetadata`: AI-powered metadata generation
  - `getPILTemplates`: Get available PIL license templates
  - `getIPAssetInfo`: Retrieve IP registration status
  - `batchRegisterAssetsAsIP`: Bulk IP registration

### 3. PIL Templates
Four official Story Protocol license templates:

#### Non-Commercial Social Remixing
- **ID**: `non-commercial-social-remixing`
- **Fee**: Free (0 ETH)
- **Use Case**: Social media, fan art, educational content
- **Features**: ✅ Derivatives, ❌ Commercial use

#### Commercial Use
- **ID**: `commercial-use`
- **Fee**: 1 ETH
- **Use Case**: Stock photography, brand assets
- **Features**: ✅ Commercial use, ❌ Derivatives

#### Commercial Remix
- **ID**: `commercial-remix`
- **Fee**: 1 ETH + 10% revenue share
- **Use Case**: Music sampling, character licensing
- **Features**: ✅ Commercial use, ✅ Derivatives, ✅ Revenue sharing

#### Creative Commons Attribution
- **ID**: `creative-commons-attribution`
- **Fee**: Free (0 ETH)
- **Use Case**: Open source, research materials
- **Features**: ✅ Commercial use, ✅ Derivatives, ❌ Revenue sharing

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
cd apps/functions
pnpm add @story-protocol/core-sdk permissionless viem
```

### 2. Configure Environment
Run the setup script with your Pimlico API key already included:
```bash
./setup-story-protocol-config.sh
```

This will configure:
- Privy App ID and Secret (you'll need to provide these)


### 3. Privy Dashboard Configuration
Configure your Privy dashboard with:
- **Smart Wallets**: Enabled (Kernel)
- **Custom Chain**: Story Aeneid Testnet
  - Chain ID: `1315`
  - RPC URL: `https://aeneid.storyrpc.io`
  - Native Currency: IP (18 decimals)
### 4. Deploy Functions
```bash
npm run deploy:functions
```

## 📋 API Reference

### Register Asset as IP
```typescript
const result = await registerAssetAsIP({
  assetId: "asset_123",
  pilTemplate: "non-commercial-social-remixing",
  customMetadata: {
    title: "My Amazing Character",
    description: "A unique character for my story",
    attributes: [
      { trait_type: "Style", value: "Anime" },
      { trait_type: "Mood", value: "Heroic" }
    ]
  }
});
```

### Generate AI Metadata
```typescript
const metadata = await generateIPMetadata({
  assetName: "Dragon Character",
  assetType: "CHARACTER",
  storyworldId: "storyworld_456",
  customPrompt: "Focus on fantasy elements and commercial potential"
});
```

### Get PIL Templates
```typescript
const templates = await getPILTemplates();
// Returns array of available license templates with features and pricing
```

## 🔄 Development vs Production

### Current Status: Development Mode
- All Story Protocol calls are **mocked**
- Metadata is stored in Firebase Storage
- IP registration returns simulated results
- No actual blockchain transactions

### Production Readiness Checklist
- [ ] Uncomment Story Protocol client initialization
- [ ] Configure private keys for wallet signing
- [ ] Test on Story Protocol testnet
- [ ] Implement proper error handling for blockchain failures
- [ ] Add transaction monitoring and retry logic
- [ ] Configure gas estimation and limits

## 🎯 Integration with Your IP Address

Your provided IP address `0x0a347d0af8213e3f1d4b89e79b675dfd308f28c1` on Story Aeneid testnet can be used as:

1. **Reference Implementation**: Study the existing IP structure
2. **Template Source**: Use metadata patterns from successful registrations
3. **Testing Target**: Validate integration against known working IP

### Viewing Your IP
- **StoryScan**: https://aeneid.storyscan.io/address/0x0a347d0af8213e3f1d4b89e79b675dfd308f28c1?tab=txs
- **Transaction History**: Available for analysis and pattern matching

## 🛡️ Security Considerations

### Backend-First Approach Benefits
- **Private Key Security**: Keys never exposed to frontend
- **Centralized Control**: All IP operations managed server-side
- **Audit Trail**: Complete logging of all IP registrations
- **Rate Limiting**: Built-in protection against abuse

### Wallet Management
- Privy handles wallet creation and management
- Pimlico provides gasless transactions via paymaster
- Smart wallets enable advanced features like batching and recovery

## 📊 Monitoring and Analytics

### Firebase Functions Logs
- IP registration attempts and results
- Metadata generation success/failure rates
- PIL template usage statistics
- Error tracking and debugging information

### Recommended Monitoring
- Set up alerts for failed IP registrations
- Track metadata generation performance
- Monitor Pimlico paymaster usage and costs
- Analyze PIL template preferences by users

## 🔮 Future Enhancements

### Phase 1: Production Deployment
- Enable actual Story Protocol transactions
- Implement wallet signing with Privy
- Add comprehensive error handling

### Phase 2: Advanced Features
- Batch IP registration optimization
- Custom PIL template creation
- Revenue sharing automation
- Cross-chain IP bridging

### Phase 3: Analytics & Insights
- IP performance tracking
- Revenue analytics dashboard
- Community engagement metrics
- Licensing opportunity recommendations

## 🆘 Troubleshooting

### Common Issues
1. **Configuration Missing**: Run setup script to configure environment variables
2. **Privy Integration**: Ensure smart wallets are enabled in Privy dashboard
3. **Pimlico Errors**: Verify API key and network configuration
4. **Metadata Failures**: Check Firebase Storage permissions and quotas

### Debug Mode
Enable detailed logging by setting `FUNCTIONS_DEBUG=true` in your environment.

## 📚 Resources

- [Story Protocol Documentation](https://docs.story.foundation/)
- [Privy Smart Wallets Guide](https://docs.privy.io/guide/react/wallets/smart-wallets)
- [Pimlico Paymaster Documentation](https://docs.pimlico.io/)
- [Story Protocol Testnet Explorer](https://aeneid.storyscan.io/)

---

**Status**: ✅ Backend infrastructure ready for development and testing
**Next Step**: Configure Privy dashboard and test IP registration flow 