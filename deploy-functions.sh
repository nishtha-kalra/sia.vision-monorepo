#!/bin/bash

# Deploy Firebase Functions Only
# This script builds and deploys only the Firebase functions

echo "🚀 Deploying Firebase Functions..."

# Check if we're in the right directory
if [ ! -f "firebase.json" ]; then
    echo "❌ Error: firebase.json not found. Make sure you're in the project root directory."
    exit 1
fi

# Check if functions directory exists
if [ ! -d "apps/functions" ]; then
    echo "❌ Error: functions directory not found."
    exit 1
fi

# Navigate to functions directory and install dependencies
echo "📦 Installing function dependencies..."
cd apps/functions
npm install

# Build the functions
echo "🔨 Building functions..."
npm run build

# Go back to project root
cd ..

# Deploy only functions
echo "🚀 Deploying functions to Firebase..."
firebase deploy --only functions

echo "✅ Functions deployment complete!"
echo "📝 Check Firebase Console for function URLs and logs." 