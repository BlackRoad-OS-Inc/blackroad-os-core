#!/usr/bin/env bash

# 🛣️ BlackRoad HTTP Health Dashboard (Vibes Edition)

TIMEOUT=5

# ───────────────── Config: Services by Group ─────────────────

PUBLIC_SERVICES=$(cat << 'SERVICES_EOF'
api          https://api.blackroad.io/health
web          https://blackroad.io
console      https://console.blackroad.io
docs         https://docs.blackroad.io
SERVICES_EOF
)

CORE_SERVICES=$(cat << 'SERVICES_EOF'
core-api     http://localhost:8001/health
core-web     http://localhost:8000/health
gateway      http://localhost:8080/health
SERVICES_EOF
)

MESH_SERVICES=$(cat << 'SERVICES_EOF'
pi-1-agent   http://pi-1.local:9000/health
pi-2-agent   http://pi-2.local:9000/health
holo-node    http://holo.local:9100/health
SERVICES_EOF
)

# ───────────────── Helpers ─────────────────

up_count=0
warn_count=0
down_count=0

print_header() {
  local title="$1"
  local emoji="$2"
  echo
  echo "╭───────────────────────────────────────────────╮"
  printf "│  %s %s\n" "$emoji" "$title"
  echo "╰───────────────────────────────────────────────╯"
}

check_block() {
  local block="$1"

  while read -r name url; do
    [ -z "$name" ] && continue
    [[ "$name" =~ ^# ]] && continue

    status_code=$(curl -k -s -o /dev/null -m "$TIMEOUT" -w "%{http_code}" "$url" || echo "000")

    if [ "$status_code" = "200" ]; then
      echo "✅  $name → $url  (200 OK)"
      ((up_count++))
    elif [ "$status_code" = "000" ]; then
      echo "❌  $name → $url  (no response / timeout)"
      ((down_count++))
    else
      echo "⚠️   $name → $url  (HTTP $status_code)"
      ((warn_count++))
    fi
  done <<< "$block"
}

# ───────────────── Run Checks ─────────────────

clear
echo "🛣️  BlackRoad HTTP Health — $(date)"
echo
echo "Legend: ✅ up   ⚠️ partial   ❌ down"
echo

print_header "Public / External" "🛰️"
check_block "$PUBLIC_SERVICES"

print_header "Core Runtime / Local" "🧠"
check_block "$CORE_SERVICES"

print_header "Mesh / Agents" "🕸️"
check_block "$MESH_SERVICES"

# ───────────────── Summary ─────────────────

echo
echo "━━━━━━━━━━━━━━━━ Summary ━━━━━━━━━━━━━━━━"
echo "✅  Up:        $up_count"
echo "⚠️  Warnings:  $warn_count"
echo "❌  Down:      $down_count"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo

if [ "$down_count" -gt 0 ]; then
  echo "🚨 Some services are DOWN. Time to be the hero."
elif [ "$warn_count" -gt 0 ]; then
  echo "🪧 Some services are flaky, but reachable."
else
  echo "🟢 All green. BlackRoad humming like a spaceship. 🛸"
fi

echo
