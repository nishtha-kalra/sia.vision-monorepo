#!/bin/bash

echo "🔧 Starting development environment..."

# Function to handle cleanup
cleanup() {
    echo "🛑 Shutting down development servers..."
    kill $(jobs -p) 2>/dev/null
    exit 0
}

# Trap Ctrl+C
trap cleanup SIGINT

# Start Firebase emulators in background
echo "🔥 Starting Firebase emulators..."
firebase emulators:start &

# Wait a moment for emulators to start
sleep 3

# Start Next.js dev server
echo "⚡ Starting Next.js development server..."
npm --workspace apps/web run dev &

echo "🎉 Development environment ready!"
echo "📱 Next.js: http://localhost:3000"
echo "🔥 Firebase UI: http://localhost:4000"
echo "📧 Functions: http://localhost:5001"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for all background processes
wait 