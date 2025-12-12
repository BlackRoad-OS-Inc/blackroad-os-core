#!/usr/bin/env bash
# Test all integrations

echo "🧪 Testing all integrations..."
echo ""

BASE_URL="${1:-http://localhost:10000}"

# Health check
echo "1. Health check..."
curl -sf "$BASE_URL/api/health" | python3 -m json.tool
echo ""

# Status
echo "2. Integration status..."
curl -sf "$BASE_URL/api/status" | python3 -m json.tool
echo ""

# Test Stripe (if enabled)
echo "3. Testing Stripe..."
curl -sf "$BASE_URL/api/stripe/customers" | python3 -m json.tool || echo "  Stripe not configured"
echo ""

# Test Asana (if enabled)
echo "4. Testing Asana..."
curl -sf "$BASE_URL/api/asana/tasks" | python3 -m json.tool || echo "  Asana not configured"
echo ""

# Test Notion (if enabled)
echo "5. Testing Notion..."
curl -sf -X POST "$BASE_URL/api/notion/search" -H "Content-Type: application/json" -d '{"query":""}' | python3 -m json.tool || echo "  Notion not configured"
echo ""

# Test GitHub (if enabled)
echo "6. Testing GitHub..."
curl -sf "$BASE_URL/api/github/orgs" | python3 -m json.tool || echo "  GitHub not configured"
echo ""

# Test Slack (if enabled)
echo "7. Testing Slack..."
curl -sf "$BASE_URL/api/slack/channels" | python3 -m json.tool || echo "  Slack not configured"
echo ""

echo "✅ Integration tests complete!"
