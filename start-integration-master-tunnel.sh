#!/usr/bin/env bash
# Start integration master with Cloudflare tunnel

set -euo pipefail

echo "🔌 Starting Integration Master + Cloudflare Tunnel"
echo "=================================================="
echo ""

# Kill any existing processes
echo "Cleaning up existing processes..."
pkill -f "blackroad-integrations-master.py" 2>/dev/null || true
pkill -f "cloudflared" 2>/dev/null || true
sleep 1

# Start integration master
echo "Starting integration master on port 10000..."
PORT=10000 nohup python3 blackroad-integrations-master.py > /tmp/integration-master.log 2>&1 &
MASTER_PID=$!
echo "  PID: $MASTER_PID"

# Wait for it to start
sleep 3

# Test if it's running
if curl -sf http://localhost:10000/api/health > /dev/null 2>&1; then
  echo "  ✅ Integration master is running"
else
  echo "  ⚠️  Warning: Health check failed, but continuing..."
fi

echo ""
echo "Starting Cloudflare tunnel..."
nohup cloudflared tunnel --url http://localhost:10000 > /tmp/cloudflare-tunnel.log 2>&1 &
TUNNEL_PID=$!
echo "  PID: $TUNNEL_PID"

# Wait for tunnel to establish
echo ""
echo "Waiting for tunnel URL (this takes ~10 seconds)..."
sleep 10

# Extract tunnel URL
TUNNEL_URL=$(grep -o 'https://[a-z0-9-]*\.trycloudflare\.com' /tmp/cloudflare-tunnel.log 2>/dev/null | head -1 || echo "")

echo ""
echo "=================================================="
echo "🎉 INTEGRATION MASTER IS LIVE!"
echo "=================================================="
echo ""

if [ -n "$TUNNEL_URL" ]; then
  echo "Public URL: $TUNNEL_URL"
  echo ""
  echo "Test endpoints:"
  echo "  Health: $TUNNEL_URL/api/health"
  echo "  Status: $TUNNEL_URL/api/status"
  echo "  Registry: $TUNNEL_URL/api/registry"
else
  echo "⚠️  Tunnel URL not found yet. Check logs:"
  echo "  tail -f /tmp/cloudflare-tunnel.log"
fi

echo ""
echo "Local URL: http://localhost:10000"
echo ""
echo "Logs:"
echo "  Integration Master: /tmp/integration-master.log"
echo "  Cloudflare Tunnel: /tmp/cloudflare-tunnel.log"
echo ""
echo "Process IDs:"
echo "  Master: $MASTER_PID"
echo "  Tunnel: $TUNNEL_PID"
echo ""
echo "To stop:"
echo "  pkill -f blackroad-integrations-master.py"
echo "  pkill -f cloudflared"
echo ""
echo "=================================================="
