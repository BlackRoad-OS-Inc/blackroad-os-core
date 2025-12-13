#!/usr/bin/env bash
# Safe network discovery for macOS Bash 3.x + Linux Bash 5.x
# No associative arrays, no bashisms

set -euo pipefail

# Output file
OUTPUT_FILE="${1:-network_inventory.txt}"
TEMP_DIR=$(mktemp -d)
trap 'rm -rf "$TEMP_DIR"' EXIT

# Detect OS
OS=$(uname)

# Get primary interface
get_primary_interface() {
  case "$OS" in
    Darwin) echo "en0" ;;
    Linux)  ip route | awk '/default/ {print $5; exit}' ;;
    *) echo "unknown" ;;
  esac
}

# Get primary IP
get_primary_ip() {
  local iface
  iface=$(get_primary_interface)
  case "$OS" in
    Darwin)
      ifconfig "$iface" 2>/dev/null | awk '/inet / && !/127.0.0/ {print $2; exit}'
      ;;
    Linux)
      ip -4 addr show "$iface" 2>/dev/null | awk '/inet / {print $2}' | cut -d/ -f1
      ;;
  esac
}

# Get subnet from IP
get_subnet() {
  local ip=$1
  echo "$ip" | awk -F. '{print $1"."$2"."$3".0/24"}'
}

# Discover devices via ARP
discover_lan() {
  local subnet=$1
  echo "# LAN Discovery: $subnet" | tee -a "$OUTPUT_FILE"

  case "$OS" in
    Darwin)
      # Ping sweep to populate ARP
      IFS='.' read -r a b c d <<< "${subnet%/*}"
      for i in $(seq 1 254); do
        ping -c 1 -W 1 "$a.$b.$c.$i" >/dev/null 2>&1 &
      done
      wait

      # Read ARP table
      arp -an | grep -v incomplete | grep "$a.$b.$c" | \
        awk '{print $2, $4}' | tr -d '()' > "$TEMP_DIR/arp.txt"
      ;;
    Linux)
      ip neigh show | grep REACHABLE | \
        awk '{print $1, $5}' > "$TEMP_DIR/arp.txt"
      ;;
  esac

  # Format output: ip,mac,hostname
  while read -r ip mac; do
    # Try to resolve hostname
    if command -v host >/dev/null 2>&1; then
      hostname=$(host "$ip" 2>/dev/null | awk '{print $NF}' | sed 's/\.$//')
    else
      hostname="unknown"
    fi

    echo "$ip,$mac,$hostname" >> "$OUTPUT_FILE"
  done < "$TEMP_DIR/arp.txt"
}

# Discover Tailscale nodes
discover_tailscale() {
  if ! command -v tailscale >/dev/null 2>&1; then
    echo "# Tailscale: not installed" >> "$OUTPUT_FILE"
    return
  fi

  echo "# Tailscale Nodes" >> "$OUTPUT_FILE"
  tailscale status 2>/dev/null | tail -n +2 | \
    awk '{print $2","$1",tailscale"}' >> "$OUTPUT_FILE" || true
}

# Discover Docker networks (Linux only)
discover_docker() {
  if ! command -v docker >/dev/null 2>&1; then
    return
  fi

  echo "# Docker Containers" >> "$OUTPUT_FILE"
  docker ps -q 2>/dev/null | while read -r cid; do
    name=$(docker inspect --format='{{.Name}}' "$cid" | tr -d '/')
    ip=$(docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' "$cid")
    if [ -n "$ip" ]; then
      echo "$ip,docker,$name" >> "$OUTPUT_FILE"
    fi
  done || true
}

# Main execution
main() {
  echo "Starting network discovery..."
  echo "# Network Inventory - $(date)" > "$OUTPUT_FILE"
  echo "# Format: ip,mac_or_type,hostname" >> "$OUTPUT_FILE"

  # Get our IP and subnet
  MY_IP=$(get_primary_ip)
  if [ -z "$MY_IP" ]; then
    echo "ERROR: Could not determine primary IP"
    exit 1
  fi

  SUBNET=$(get_subnet "$MY_IP")

  echo "Discovering LAN devices on $SUBNET..."
  discover_lan "$SUBNET"

  echo "Discovering Tailscale nodes..."
  discover_tailscale

  if [ "$OS" = "Linux" ]; then
    echo "Discovering Docker containers..."
    discover_docker
  fi

  echo ""
  echo "Discovery complete! Results in: $OUTPUT_FILE"
  echo ""
  wc -l "$OUTPUT_FILE"
}

main "$@"
