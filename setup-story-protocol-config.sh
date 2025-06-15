#!/bin/bash

# Setup Firebase Functions configuration for Story Protocol integration
# Run this script to configure the necessary environment variables

echo "🔧 Setting up Story Protocol configuration for Firebase Functions..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed. Please install it first:"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in
if ! firebase projects:list &> /dev/null; then
    echo "❌ Please login to Firebase first:"
    echo "firebase login"
    exit 1
fi

echo "📝 Please provide the following configuration values:"

# Privy Configuration
read -p "Enter your Privy App ID: " PRIVY_APP_ID
read -s -p "Enter your Privy App Secret: " PRIVY_APP_SECRET
echo

# Pimlico Configuration  
read -s -p "Enter your Pimlico API Key (or press Enter to use default): " PIMLICO_API_KEY_INPUT
echo
if [ -z "$PIMLICO_API_KEY_INPUT" ]; then
    PIMLICO_API_KEY=""
    echo "Using default Pimlico API key: ${PIMLICO_API_KEY:0:10}..."
else
    PIMLICO_API_KEY="$PIMLICO_API_KEY_INPUT"
    echo "Using provided Pimlico API key: ${PIMLICO_API_KEY:0:10}..."
fi

# Pimlico RPC URL for Story Aeneid testnet
PIMLICO_RPC_URL="https://api.pimlico.io/v2/1315/rpc?apikey=${PIMLICO_API_KEY}"
echo "Pimlico RPC URL: ${PIMLICO_RPC_URL}"

# Validate inputs
if [[ -z "$PRIVY_APP_ID" || -z "$PRIVY_APP_SECRET" || -z "$PIMLICO_API_KEY" ]]; then
    echo "❌ All configuration values are required!"
    exit 1
fi

echo "🚀 Setting Firebase Functions configuration..."

# Set Privy configuration
firebase functions:config:set privy.app_id="$PRIVY_APP_ID"
firebase functions:config:set privy.app_secret="$PRIVY_APP_SECRET"

# Set Pimlico configuration
firebase functions:config:set pimlico.api_key="$PIMLICO_API_KEY"
firebase functions:config:set pimlico.rpc_url="$PIMLICO_RPC_URL"

echo "✅ Configuration set successfully!"
echo ""
echo "📋 Current configuration:"
firebase functions:config:get

echo ""
echo "🔄 Next steps:"
echo "1. Deploy your functions: npm run deploy:functions"
echo "2. Test the Story Protocol integration in your app"
echo ""
echo "📚 Make sure you have configured your Privy dashboard with:"
echo "   - Smart Wallets enabled (Kernel)"
echo "   - Custom chain: Story Aeneid Testnet (ID: 1315)"
echo "   - RPC URL: https://aeneid.storyrpc.io"
echo "   - Bundler URL: https://api.pimlico.io/v2/1315/rpc?apikey=YOUR_API_KEY"
echo "   - Paymaster URL: https://api.pimlico.io/v2/1315/rpc?apikey=YOUR_API_KEY"
echo ""
echo "🎉 Story Protocol backend integration is ready!" 