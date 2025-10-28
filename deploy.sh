#!/bin/bash

# 🚀 Vercel Deployment Script for MarkTools
# Photo Profile Generator with Happy Hues Theme

echo "🎨 MarkTools - Photo Profile Generator Deployment"
echo "=================================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check git status
echo "📋 Checking git status..."
if [[ -n $(git status --porcelain) ]]; then
    echo "📝 Found uncommitted changes. Committing..."
    git add .
    git commit -m "🚀 Ready for Vercel deployment - Photo Profile Generator with Happy Hues theme"
    git push
else
    echo "✅ No uncommitted changes found."
fi

# Run build test
echo "🔨 Testing build locally..."
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo ""
echo "🎉 Deployment completed!"
echo ""
echo "📱 Your Photo Profile Generator is now live!"
echo "🔗 Tool URL: https://your-app.vercel.app/tools/photo-gen"
echo ""
echo "✨ Features included:"
echo "   • Photo Profile Generator with Happy Hues theme"
echo "   • Gender selection (Cewe/Cowo)"
echo "   • Count control (4, 8, 12, 16 photos)"
echo "   • Batch download with JSZip"
echo "   • Backend proxy architecture"
echo "   • Responsive design"
echo "   • Production-ready"
echo ""
echo "📊 Monitor your deployment at: https://vercel.com/dashboard"