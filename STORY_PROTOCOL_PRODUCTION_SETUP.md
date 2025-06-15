# Story Protocol Production Setup Guide

This guide walks you through setting up Story Protocol integration for **production use on Story Aeneid testnet** with Pimlico paymaster for gasless transactions.

## 🎯 Overview

Your SIA application now has a complete backend Story Protocol integration that:

- ✅ **Registers IP assets** on Story Protocol Aeneid testnet (Chain ID: 1315)
- ✅ **Sponsors gas fees** via Pimlico paymaster (configured via Firebase config)
- ✅ **Manages smart wallets** through Firebase Functions
- ✅ **Generates enhanced metadata** with AI-powered storyworld context
- ✅ **Supports all PIL templates** (Non-Commercial, Commercial Use, etc.)

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   SIA Frontend  │───▶│ Firebase Funcs  │───▶│ Story Protocol  │
│                 │    │                 │    │ Aeneid Testnet  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │ Pimlico Paymaster│
                       │ (Gas Sponsorship)│
                       └─────────────────┘
```

## 🔧 Setup Instructions

### Step 1: Configure Firebase Functions

Run the configuration script to set up environment variables:

```bash
./setup-story-protocol-config.sh
```

This will prompt you for:
- **Privy App ID**: Your Privy application ID
- **Privy App Secret**: Your Privy application secret
- **Pimlico API Key**: Configured via Firebase Functions config

### Step 2: Configure Privy Dashboard

In your [Privy Dashboard](https://dashboard.privy.io):

1. **Enable Smart Wallets**
   - Go to Wallet Infrastructure → Smart Wallets
   - Enable smart wallets toggle
   - Select **Kernel** as smart wallet type

2. **Add Story Aeneid Testnet**
   - Chain ID: `1315`
   - Chain Name: `Story Aeneid Testnet`
   - RPC URL: `https://aeneid.storyrpc.io`
   - Native Currency: `IP` (18 decimals)

3. **Configure Bundler & Paymaster**
   - Bundler URL: `https://api.pimlico.io/v2/1315/rpc?apikey=YOUR_API_KEY`
- Paymaster URL: `https://api.pimlico.io/v2/1315/rpc?apikey=YOUR_API_KEY`

### Step 3: Generate Story Protocol Private Key

You need a private key for the service account that will interact with Story Protocol:

```bash
# Generate a new private key (save this securely!)
node -e "console.log('0x' + require('crypto').randomBytes(32).toString('hex'))"
```

**Important**: Fund this address with IP tokens on Story Aeneid testnet for contract interactions.

### Step 4: Set Story Protocol Private Key

```bash
firebase functions:config:set story.private_key="YOUR_GENERATED_PRIVATE_KEY"
```

### Step 5: Deploy Functions

```bash
npm run deploy:functions
```

## 🚀 Available Functions

Your Firebase Functions now include these Story Protocol endpoints:

### `registerAssetAsIP`
Registers an asset as IP on Story Protocol with PIL template.

```typescript
const result = await firebase.functions().httpsCallable('registerAssetAsIP')({
  assetId: 'asset-123',
  pilTemplate: 'non-commercial-social-remixing',
  customMetadata: { /* optional */ }
});
```

### `generateIPMetadata`
AI-powered metadata generation with storyworld context.

```typescript
const metadata = await firebase.functions().httpsCallable('generateIPMetadata')({
  assetId: 'asset-123',
  storyworldId: 'storyworld-456'
});
```

### `getIPAssetInfo`
Retrieve information about registered IP assets.

```typescript
const info = await firebase.functions().httpsCallable('getIPAssetInfo')({
  ipId: '0x...'
});
```

### `attachLicenseTerms`
Attach license terms to IP assets.

```typescript
const result = await firebase.functions().httpsCallable('attachLicenseTerms')({
  ipId: '0x...',
  licenseTermsId: '1'
});
```

## 📋 PIL Templates Available

1. **Non-Commercial Social Remixing** (`non-commercial-social-remixing`)
   - Free to use for non-commercial purposes
   - Allows remixing and derivatives
   - Attribution required

2. **Commercial Use** (`commercial-use`)
   - Allows commercial usage
   - Revenue sharing terms
   - Attribution required

3. **Commercial Remix** (`commercial-remix`)
   - Commercial use + remixing allowed
   - Revenue sharing on derivatives
   - Attribution required

4. **Creative Commons Attribution** (`creative-commons-attribution`)
   - Open license with attribution
   - Commercial and non-commercial use
   - Remixing allowed

## 🔍 Testing Your Integration

### 1. Test IP Registration

```typescript
// In your frontend
const registerIP = async (assetId: string) => {
  try {
    const result = await firebase.functions().httpsCallable('registerAssetAsIP')({
      assetId,
      pilTemplate: 'non-commercial-social-remixing'
    });
    
    console.log('IP registered:', result.data);
    return result.data;
  } catch (error) {
    console.error('Registration failed:', error);
  }
};
```

### 2. Monitor Transactions

Check your transactions on [StoryScan](https://aeneid.storyscan.io/address/0x0a347d0af8213e3f1d4b89e79b675dfd308f28c1?tab=txs).

### 3. Verify Gas Sponsorship

All transactions should be sponsored by Pimlico paymaster - users won't need IP tokens for gas.

## 🛡️ Security Considerations

1. **Private Key Management**
   - Store Story Protocol private key securely in Firebase Functions config
   - Never expose private keys in frontend code
   - Consider using Firebase Secret Manager for production

2. **Access Control**
   - All functions require user authentication
   - Implement rate limiting for production
   - Add input validation and sanitization

3. **Paymaster Budget**
   - Monitor Pimlico paymaster usage
   - Set up alerts for budget limits
   - Consider implementing user-based gas limits

## 🔧 Troubleshooting

### Common Issues

1. **"Story Protocol private key not configured"**
   - Run: `firebase functions:config:set story.private_key="YOUR_KEY"`
   - Redeploy functions

2. **"Insufficient funds for gas"**
   - Fund your service account address with IP tokens
   - Check Pimlico paymaster balance

3. **"Chain not supported"**
   - Verify Story Aeneid testnet configuration in Privy dashboard
   - Check RPC URL accessibility

### Debug Logs

Check Firebase Functions logs:
```bash
firebase functions:log --only registerAssetAsIP
```

## 📊 Monitoring & Analytics

Track your Story Protocol integration:

1. **Firebase Functions Metrics**
   - Function invocations
   - Error rates
   - Execution duration

2. **Story Protocol Analytics**
   - IP registrations
   - License attachments
   - Revenue tracking

3. **Pimlico Usage**
   - Gas sponsorship costs
   - Transaction success rates
   - User operation metrics

## 🎉 You're Ready!

Your Story Protocol integration is now production-ready on Aeneid testnet with:

- ✅ Gasless transactions via Pimlico
- ✅ Complete IP registration flow
- ✅ AI-enhanced metadata generation
- ✅ Comprehensive PIL template support
- ✅ Secure backend architecture

Start protecting your creative assets with Story Protocol! 🚀

---

**Need Help?** 
- Check the [Story Protocol Documentation](https://docs.story.foundation/)
- Review [Pimlico Integration Guides](https://docs.pimlico.io/)
- Monitor your setup on [StoryScan](https://aeneid.storyscan.io/) 