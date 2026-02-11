#!/bin/bash
# Clean installation script

echo "🧹 Cleaning npm cache..."
npm cache clean --force

echo "🗑️  Removing node_modules and lock files..."
rm -rf node_modules package-lock.json

echo "📦 Installing fresh dependencies..."
npm install

echo "✅ Installation complete!"
echo "Run: npm run build"
echo "Run: npm run start"
