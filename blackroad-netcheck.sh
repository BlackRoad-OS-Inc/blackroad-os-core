#!/usr/bin/env bash

# 🌐 BlackRoad Network View (Ping + Ports)

PING_COUNT=2
PING_TIMEOUT=2
NC_TIMEOUT=3

HOST_GROUPS=$(cat << 'HOSTS_EOF'
# label         host                  ports
# ───── Public / Edge
cloudflare     1.1.1.1               53,80,443

# ───── Core / Infra
codex          codex-infinity        22,80,443
mac-local      127.0.0.1             22,8000,8001

# ───── Mesh / Nodes
pi-1           pi-1.local            22,9000
pi-2           pi-2.local            22,9000
holo           holo.local            22,9100
HOSTS_EOF
)

clear
echo "🌐 BlackRoad Network Health — $(date)"
echo
echo "Legend:"
echo "  ✅ ping ok / port open"
echo "  ⚠️ ping ok / port closed or filtered"
echo "  ❌ ping failed"
echo

current_section=""

while read -r label host ports; do
  [ -z "$label" ] && continue

  if [[ "$label" == "#"* ]]; then
    # section/comment
    section_text="${label#\#}"
    section_text="$(echo "$section_text" | sed 's/^ *//')"
    echo
    echo "╭───────────────────────────────────────────────╮"
    printf "│ %s\n" "$section_text"
    echo "╰───────────────────────────────────────────────╯"
    continue
  fi

  # ── Ping check ──
  if ping -c "$PING_COUNT" -W "$PING_TIMEOUT" "$host" >/dev/null 2>&1; then
    echo "✅  $label ($host) reachable (ping)"
  else
    echo "❌  $label ($host) unreachable (ping failed)"
    echo
    continue
  fi

  # ── Ports check ──
  IFS=',' read -r -a port_array <<< "$ports"
  for port in "${port_array[@]}"; do
    if nc -z -w "$NC_TIMEOUT" "$host" "$port" >/dev/null 2>&1; then
      echo "    ✅ port $port open"
    else
      echo "    ⚠️  port $port closed or filtered"
    fi
  done

  echo
done <<< "$HOST_GROUPS"

echo "Done. 🧭"
echo
