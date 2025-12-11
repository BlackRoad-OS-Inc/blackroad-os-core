#!/usr/bin/env bash
# ============================================================================
# BlackRoad OS - Railway Deployment Fixer
# Copyright (c) 2025 BlackRoad OS, Inc. / Alexa Louise Amundson
# All Rights Reserved.
# ============================================================================

set -euo pipefail

echo "🔧 Railway Deployment Fixer"
echo "================================"
echo ""

# Check for Railway CLI
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

echo "🔐 Checking Railway authentication..."

# Option 1: Check if Railway token is set and working
if [ -n "${RAILWAY_TOKEN:-}" ]; then
    echo "✅ RAILWAY_TOKEN environment variable is set"
    echo "   Token: ${RAILWAY_TOKEN:0:8}..."

    # Try to validate the token
    echo ""
    echo "🔍 Validating token with Railway API..."

    # Use Python to check token validity
    python3 << 'EOF'
import os
import requests
import sys

token = os.getenv('RAILWAY_TOKEN')
if not token:
    print("❌ No token found")
    sys.exit(1)

headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

# Simple query to check if token works
query = """
query {
  me {
    id
    name
    email
  }
}
"""

try:
    response = requests.post(
        "https://backboard.railway.app/graphql/v2",
        json={"query": query},
        headers=headers,
        timeout=10
    )

    if response.status_code == 200:
        data = response.json()
        if 'errors' in data:
            print(f"❌ Token validation failed: {data['errors']}")
            print("\n🔄 The token appears to be invalid or expired.")
            print("\n📝 To fix this:")
            print("   1. Go to: https://railway.app/account/tokens")
            print("   2. Create a new Project Token (not Team Token)")
            print("   3. Copy the token")
            print("   4. Update .env file: RAILWAY_TOKEN=your-new-token")
            print("   5. Update GitHub secret:")
            print("      gh secret set RAILWAY_TOKEN -b'your-new-token'")
            sys.exit(1)
        elif 'data' in data and data['data']['me']:
            user = data['data']['me']
            print(f"✅ Token is valid!")
            print(f"   User: {user.get('name', 'N/A')} ({user.get('email', 'N/A')})")
            sys.exit(0)
    else:
        print(f"❌ API request failed: {response.status_code}")
        sys.exit(1)

except Exception as e:
    print(f"❌ Error validating token: {e}")
    sys.exit(1)
EOF

    TOKEN_VALID=$?

    if [ $TOKEN_VALID -ne 0 ]; then
        echo ""
        echo "❌ Railway token validation failed"
        echo ""
        echo "🔧 Manual fix required:"
        echo "   1. Get a new token from: https://railway.app/account/tokens"
        echo "   2. Update .env: RAILWAY_TOKEN=your-new-token"
        echo "   3. Update GitHub: gh secret set RAILWAY_TOKEN -b'your-new-token'"
        echo "   4. Re-run this script"
        exit 1
    fi
else
    echo "❌ RAILWAY_TOKEN not set"
    echo ""
    echo "🔧 To fix this:"
    echo "   1. Go to: https://railway.app/account/tokens"
    echo "   2. Create a new Project Token"
    echo "   3. Add to .env: RAILWAY_TOKEN=your-token"
    echo "   4. Re-run this script"
    exit 1
fi

echo ""
echo "✅ Railway authentication is working!"
echo ""

# List Railway projects
echo "📋 Listing Railway projects..."
python3 << 'EOF'
import os
import requests
import json

token = os.getenv('RAILWAY_TOKEN')
headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

query = """
query {
  projects {
    edges {
      node {
        id
        name
        description
        createdAt
      }
    }
  }
}
"""

response = requests.post(
    "https://backboard.railway.app/graphql/v2",
    json={"query": query},
    headers=headers
)

if response.status_code == 200:
    data = response.json()
    if 'data' in data:
        projects = data['data']['projects']['edges']
        print(f"\n📊 Found {len(projects)} Railway projects:\n")
        for i, edge in enumerate(projects, 1):
            project = edge['node']
            print(f"   {i}. {project['name']}")
            print(f"      ID: {project['id']}")
            if project.get('description'):
                print(f"      Description: {project['description']}")
            print()
EOF

echo ""
echo "================================"
echo "✅ Railway setup verified!"
echo ""
echo "📝 Next steps:"
echo "   1. Update GitHub secrets if needed:"
echo "      gh secret set RAILWAY_TOKEN"
echo "   2. Re-run failed deployments:"
echo "      gh workflow run deploy-railway.yml"
echo "   3. Or deploy manually:"
echo "      railway up"
echo ""
