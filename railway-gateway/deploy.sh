#!/usr/bin/env bash
# Deploy BlackRoad Railway Gateway
# Project ID: ef287e60-efa9-432e-a3bc-f6df4c7a7b35

set -e

echo "🚗 BlackRoad Railway Gateway - Deployment"
echo "=========================================="
echo ""

# Check Railway CLI
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found"
    echo "Install: npm install -g @railway/cli"
    exit 1
fi

echo "✅ Railway CLI found"
echo ""

# Login check
if ! railway whoami &> /dev/null; then
    echo "⚠️  Not logged in to Railway"
    echo "Run: railway login"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo "✅ Logged in to Railway"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo ""

# Link to project (interactive)
echo "🔗 Linking to Railway project..."
echo "Select project: blackroad-os-runtime"
echo "Project ID: ef287e60-efa9-432e-a3bc-f6df4c7a7b35"
echo ""

railway link
echo ""

# Deploy
echo "🚀 Deploying to Railway..."
railway up
echo ""

# Get the URL
echo "📡 Getting Railway URL..."
RAILWAY_URL=$(railway domain 2>&1 | grep -o 'https://[^ ]*' | head -1 || echo "")

if [ -n "$RAILWAY_URL" ]; then
    echo ""
    echo "✅ Deployment complete!"
    echo ""
    echo "🌐 Railway URL: $RAILWAY_URL"
    echo ""
    echo "Test health check:"
    echo "  curl $RAILWAY_URL/health"
    echo ""
else
    echo ""
    echo "✅ Deployment complete!"
    echo ""
    echo "Get your Railway URL:"
    echo "  railway domain"
    echo ""
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Next steps:"
echo ""
echo "1. Add custom domains to this Railway service:"
echo "   railway domain add blackroad.systems"
echo "   railway domain add blackroad.io"
echo "   railway domain add blackroad.company"
echo "   railway domain add blackroad.me"
echo "   railway domain add roadcoin.io"
echo "   railway domain add roadchain.io"
echo ""
echo "2. Configure DNS in Cloudflare:"
echo "   Point all domains → CNAME → <railway-url>"
echo ""
echo "3. Test:"
echo "   curl https://blackroad.systems/health"
echo ""
echo "🚗 Gateway ready to route all your domains!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
