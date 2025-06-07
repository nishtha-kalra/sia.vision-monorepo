#!/bin/bash

echo "🚀 Starting hosting-only deployment..."

# Exit on any error
set -e

# Build the Next.js app 
echo "📦 Building Next.js app..."
npm --workspace apps/web run build

# Deploy only hosting (no functions)
echo "🔥 Deploying hosting to Firebase..."
firebase deploy --only hosting

echo "✅ Deployment complete!"
echo "🌐 Your site is live at: https://sia-vision.web.app"
echo "📝 Note: Contact form will use placeholder (no backend functions)" 