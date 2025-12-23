# ══════════════════════════════════════════════════════════════════════════════
# BlackRoad Terminal OS — OS-in-OS Commands
# Commands that make your shell feel like an operating system
# ══════════════════════════════════════════════════════════════════════════════

# ── BR OS State Management ──
export BR_SESSION_DIR="$HOME/.blackroad/sessions"
export BR_LEDGER_FILE="$BR_SESSION_DIR/current.ledger.json"
export BR_HASH_FILE="$BR_SESSION_DIR/current.hash"

# Ensure session directory exists
mkdir -p "$BR_SESSION_DIR"

# ── Initialize session on shell start ──
_br_os_init() {
  local session_id="br_session_$(date +%Y%m%d_%H%M%S)"
  local start_hash=$(echo -n "$session_id" | shasum -a 256 | cut -d' ' -f1 | head -c 8)

  if [ ! -f "$BR_LEDGER_FILE" ] || [ "$BR_OS_NEW_SESSION" = "1" ]; then
    echo "{
  \"session_id\": \"$session_id\",
  \"start_time\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",
  \"start_hash\": \"$start_hash\",
  \"current_hash\": \"$start_hash\",
  \"agents\": {},
  \"ledger\": [],
  \"checkpoints\": []
}" > "$BR_LEDGER_FILE"
    echo "$start_hash" > "$BR_HASH_FILE"
  fi
}

# Initialize on load
_br_os_init

# ── Command: br-status ──
br-status() {
  if [ ! -f "$BR_LEDGER_FILE" ]; then
    echo "❌ No active session"
    return 1
  fi

  echo ""
  echo -e "\033[38;2;255;157;0m╭────────────────────────────────────────────╮\033[0m"
  echo -e "\033[38;2;255;157;0m│\033[0m  🚗 BlackRoad OS — Session Status       \033[38;2;255;157;0m│\033[0m"
  echo -e "\033[38;2;255;157;0m╰────────────────────────────────────────────╯\033[0m"
  echo ""

  local session_id=$(jq -r '.session_id' "$BR_LEDGER_FILE" 2>/dev/null || echo "unknown")
  local current_hash=$(cat "$BR_HASH_FILE" 2>/dev/null || echo "00000000")
  local num_entries=$(jq '.ledger | length' "$BR_LEDGER_FILE" 2>/dev/null || echo "0")
  local num_checkpoints=$(jq '.checkpoints | length' "$BR_LEDGER_FILE" 2>/dev/null || echo "0")
  local num_agents=$(jq '.agents | length' "$BR_LEDGER_FILE" 2>/dev/null || echo "0")

  echo -e "\033[38;2;0;102;255m📋 Session:\033[0m $session_id"
  echo -e "\033[38;2;0;102;255m🔗 Hash:\033[0m    $current_hash"
  echo -e "\033[38;2;0;102;255m📊 Ledger:\033[0m  $num_entries entries"
  echo -e "\033[38;2;0;102;255m💾 Checkpoints:\033[0m $num_checkpoints"
  echo -e "\033[38;2;0;102;255m🤖 Agents:\033[0m  $num_agents running"
  echo ""

  if [ "$num_agents" -gt 0 ]; then
    echo -e "\033[38;2;119;0;255m🤖 Active Agents:\033[0m"
    jq -r '.agents | to_entries[] | "  • \(.key): \(.value.status)"' "$BR_LEDGER_FILE" 2>/dev/null
    echo ""
  fi
}

# ── Command: br-checkpoint ──
br-checkpoint() {
  local checkpoint_id=$(jq '.checkpoints | length + 1' "$BR_LEDGER_FILE" 2>/dev/null || echo "1")
  local current_hash=$(cat "$BR_HASH_FILE" 2>/dev/null || echo "00000000")
  local timestamp=$(date -u +%Y-%m-%dT%H:%M:%SZ)

  # Add checkpoint to ledger
  jq ".checkpoints += [{\"id\": $checkpoint_id, \"hash\": \"$current_hash\", \"timestamp\": \"$timestamp\"}]" \
    "$BR_LEDGER_FILE" > "${BR_LEDGER_FILE}.tmp" && mv "${BR_LEDGER_FILE}.tmp" "$BR_LEDGER_FILE"

  echo ""
  echo -e "\033[38;2;0;102;255m💾 CHECKPOINT created\033[0m"
  echo -e "   ID: $checkpoint_id"
  echo -e "   Hash: $current_hash"
  echo -e "   Time: $timestamp"
  echo ""
}

# ── Command: br-hash ──
br-hash() {
  local message="$*"
  if [ -z "$message" ]; then
    cat "$BR_HASH_FILE" 2>/dev/null || echo "00000000"
    return
  fi

  # Update hash using PS-SHA∞ cascade
  local prev_hash=$(cat "$BR_HASH_FILE" 2>/dev/null || echo "00000000")
  local new_hash=$(echo -n "${prev_hash}${message}" | shasum -a 256 | cut -d' ' -f1 | head -c 8)
  echo "$new_hash" > "$BR_HASH_FILE"

  # Update ledger
  jq ".current_hash = \"$new_hash\"" "$BR_LEDGER_FILE" > "${BR_LEDGER_FILE}.tmp" && \
    mv "${BR_LEDGER_FILE}.tmp" "$BR_LEDGER_FILE"

  echo "$new_hash"
}

# ── Command: br-ledger ──
br-ledger() {
  if [ ! -f "$BR_LEDGER_FILE" ]; then
    echo "❌ No ledger found"
    return 1
  fi

  echo ""
  echo -e "\033[38;2;255;157;0m╭────────────────────────────────────────────╮\033[0m"
  echo -e "\033[38;2;255;157;0m│\033[0m  🚗 BlackRoad OS — Ledger               \033[38;2;255;157;0m│\033[0m"
  echo -e "\033[38;2;255;157;0m╰────────────────────────────────────────────╯\033[0m"
  echo ""

  if command -v jq >/dev/null 2>&1; then
    jq '.' "$BR_LEDGER_FILE"
  else
    cat "$BR_LEDGER_FILE"
  fi
}

# ── Command: br-log ──
br-log() {
  local command="$1"
  local result="${2:-success}"
  local timestamp=$(date -u +%Y-%m-%dT%H:%M:%SZ)
  local hash=$(br-hash "$command $result $timestamp")

  # Add to ledger
  local entry=$(jq -n \
    --arg ts "$timestamp" \
    --arg cmd "$command" \
    --arg hash "$hash" \
    --arg result "$result" \
    '{timestamp: $ts, command: $cmd, hash: $hash, result: $result}')

  jq ".ledger += [$entry]" "$BR_LEDGER_FILE" > "${BR_LEDGER_FILE}.tmp" && \
    mv "${BR_LEDGER_FILE}.tmp" "$BR_LEDGER_FILE"

  echo -e "[\033[38;2;119;0;255m$hash\033[0m] Logged: $command → $result"
}

# ── Command: br-reset ──
br-reset() {
  echo -e "\033[38;2;255;0;102m⚠️  Reset session? This will clear all state.\033[0m"
  read -p "   Continue? (y/N) " -n 1 -r
  echo

  if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -f "$BR_LEDGER_FILE" "$BR_HASH_FILE"
    export BR_OS_NEW_SESSION=1
    _br_os_init
    unset BR_OS_NEW_SESSION
    echo -e "\033[38;2;0;102;255m✅ Session reset\033[0m"
  else
    echo -e "\033[38;2;0;102;255mℹ️  Cancelled\033[0m"
  fi
}

# ── Command: br-export ──
br-export() {
  local export_file="$BR_SESSION_DIR/export_$(date +%Y%m%d_%H%M%S).json"
  cp "$BR_LEDGER_FILE" "$export_file"
  echo ""
  echo -e "\033[38;2;0;102;255m💾 Session exported:\033[0m"
  echo -e "   $export_file"
  echo ""
}

# ── Command: next (advance state) ──
next() {
  local current_hash=$(cat "$BR_HASH_FILE" 2>/dev/null || echo "00000000")

  echo ""
  echo -e "[\033[38;2;119;0;255m$current_hash\033[0m] \033[38;2;0;102;255m⏭️  NEXT\033[0m"
  echo ""

  br-log "next" "state_advanced"
}

# ── Command: breath (show Lucidia breath status) ──
breath() {
  # Calculate breath value (simplified)
  local t=$(date +%s)
  local phi=1.618034

  # Simple sine wave approximation
  local breath_val=$(echo "scale=2; s($phi * $t)" | bc -l 2>/dev/null || echo "0.00")

  echo ""
  if (( $(echo "$breath_val > 0" | bc -l 2>/dev/null || echo 0) )); then
    echo -e "\033[38;2;0;102;255m🌊 BREATH: Expansion (φ=$breath_val)\033[0m"
    echo -e "   State: Agent spawning enabled"
  else
    echo -e "\033[38;2;119;0;255m🌊 BREATH: Contraction (φ=$breath_val)\033[0m"
    echo -e "   State: Memory consolidation"
  fi
  echo ""
}

# ── Command: br-help ──
br-help() {
  echo ""
  echo -e "\033[38;2;255;157;0m╭────────────────────────────────────────────╮\033[0m"
  echo -e "\033[38;2;255;157;0m│\033[0m  🚗 BlackRoad OS — Commands             \033[38;2;255;157;0m│\033[0m"
  echo -e "\033[38;2;255;157;0m╰────────────────────────────────────────────╯\033[0m"
  echo ""
  echo -e "\033[38;2;0;102;255mCore:\033[0m"
  echo -e "  next            Advance state machine"
  echo -e "  breath          Show Lucidia breath status"
  echo -e "  br-status       Show session status"
  echo -e "  br-help         This help message"
  echo ""
  echo -e "\033[38;2;0;102;255mState Management:\033[0m"
  echo -e "  br-checkpoint   Create state checkpoint"
  echo -e "  br-ledger       Show full ledger"
  echo -e "  br-hash [msg]   Show/update PS-SHA∞ hash"
  echo -e "  br-log <cmd>    Log command to ledger"
  echo ""
  echo -e "\033[38;2;0;102;255mSession:\033[0m"
  echo -e "  br-export       Export session to JSON"
  echo -e "  br-reset        Reset session (clear all)"
  echo ""
}

# ── Welcome message with OS banner ──
_br_os_welcome() {
  local current_hash=$(cat "$BR_HASH_FILE" 2>/dev/null || echo "00000000")
  local session_id=$(jq -r '.session_id' "$BR_LEDGER_FILE" 2>/dev/null || echo "unknown")

  echo ""
  echo -e "\033[38;2;255;157;0m╭────────────────────────────────────────────────────────────╮\033[0m"
  echo -e "\033[38;2;255;157;0m│\033[0m  BLACKROAD :: TERMINAL OPERATING SYSTEM                     \033[38;2;255;157;0m│\033[0m"
  echo -e "\033[38;2;255;157;0m│\033[0m  An OS within the OS — v0.4 Emoji Edition                   \033[38;2;255;157;0m│\033[0m"
  echo -e "\033[38;2;255;157;0m╰────────────────────────────────────────────────────────────╯\033[0m"
  echo ""
  echo -e "\033[38;2;0;102;255m💚 ONLINE\033[0m"
  echo -e "   Session: $session_id"
  echo -e "   Hash: $current_hash"
  echo ""
  echo -e "   Type '\033[38;2;119;0;255mbr-help\033[0m' or '\033[38;2;119;0;255mnext\033[0m' to begin."
  echo ""
}

# Show welcome on first load
if [ "$BR_OS_WELCOME_SHOWN" != "1" ]; then
  _br_os_welcome
  export BR_OS_WELCOME_SHOWN=1
fi

# ══════════════════════════════════════════════════════════════════════════════
# End BlackRoad OS Commands
# ══════════════════════════════════════════════════════════════════════════════
