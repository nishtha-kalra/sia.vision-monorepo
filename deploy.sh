#!/bin/bash

echo "🚀 Starting deployment process..."

# Exit on any error
set -e

# Build the Next.js app 
echo "📦 Building Next.js app..."
npm run build

# Deploy functions and hosting
echo "🔥 Deploying to Firebase..."
firebase deploy

echo "✅ Deployment complete!"
echo "🌐 Your site is live at: https://sia-vision.web.app" 