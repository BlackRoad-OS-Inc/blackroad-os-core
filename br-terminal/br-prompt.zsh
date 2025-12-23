# ══════════════════════════════════════════════════════════════════════════════
# BlackRoad λ-Prompt v0.4 "Emoji Edition"
# An OS within the OS – Neon-branded shell prompt for BlackRoad OS
# ══════════════════════════════════════════════════════════════════════════════

# ── Neon Palette ──
BR_ORANGE="#FF9D00"
BR_ORANGE_LIGHT="#FF6B00"
BR_PINK="#FF0066"
BR_PINK_ALT="#FF006B"
BR_PURPLE_DARK="#D600AA"
BR_PURPLE="#7700FF"
BR_BLUE="#0066FF"
BR_RESET="\e[0m"

# ── Helper: 24-bit RGB color ──
_br_rgb() {
  printf '\e[38;2;%d;%d;%dm' "$(($1>>16))" "$((($1>>8)&255))" "$(($1&255))"
}

# ── Exit Code Indicator (💚 success / 🔥 failure) ──
_br_prompt_status() {
  local code="$?"
  if [[ $code -eq 0 ]]; then
    printf "%s💚%s" "$(_br_rgb 0x${BR_BLUE#\#})" "$BR_RESET"
  else
    printf "%s🔥%s" "$(_br_rgb 0x${BR_PINK#\#})" "$BR_RESET"
  fi
}

# ── Git Branch (🌿 branch-name) ──
_br_git_branch() {
  command -v git >/dev/null || return
  local branch
  branch=$(git symbolic-ref --short HEAD 2>/dev/null) || return
  printf " %s🌿 %s%s" "$(_br_rgb 0x${BR_PURPLE#\#})" "$branch" "$BR_RESET"
}

# ── Timestamp (🕒 HH:MM) ──
_br_timestamp() {
  printf "%s🕒 %s%s" "\e[2m" "$(date +%H:%M)" "$BR_RESET"
}

# ── Current Directory (with ~ shortening) ──
_br_cwd() {
  local cwd="${PWD/#$HOME/\~}"
  printf "%s%s%s" "$(_br_rgb 0x${BR_ORANGE_LIGHT#\#})" "$cwd" "$BR_RESET"
}

# ── Python Virtual Env ──
_br_venv() {
  [[ -n "$VIRTUAL_ENV" ]] || return
  local venv_name=$(basename "$VIRTUAL_ENV")
  printf " %s(venv:%s)%s" "$(_br_rgb 0x${BR_PURPLE_DARK#\#})" "$venv_name" "$BR_RESET"
}

# ── Trinary Sigil (optional) ──
_br_trinary() {
  # Uncomment to show "-1 0 1" instead of λ
  # printf "%s-1 0 1%s" "$(_br_rgb 0x${BR_ORANGE#\#})" "$BR_RESET"
  printf "%sλ%s" "$(_br_rgb 0x${BR_ORANGE#\#})" "$BR_RESET"
}

# ── Build PS1 ──
_blackroad_ps1() {
  # Top line: status | trinary | time | git | venv | cwd
  local line1="$(_br_prompt_status)  $(_br_trinary) $(_br_timestamp)$(_br_git_branch)$(_br_venv) $(_br_cwd)"

  # Bottom line: bold prompt
  local line2="\e[1m❯%s" "$BR_RESET"

  PS1="\n${line1}\n${line2} "
}

# ── Hook into Zsh prompt ──
precmd_functions+=(_blackroad_ps1)

# ── Welcome Message ──
echo ""
echo "$(_br_rgb 0x${BR_ORANGE#\#})╔════════════════════════════════════════════╗${BR_RESET}"
echo "$(_br_rgb 0x${BR_ORANGE#\#})║${BR_RESET}  🚗 BlackRoad Terminal OS v0.4          $(_br_rgb 0x${BR_ORANGE#\#})║${BR_RESET}"
echo "$(_br_rgb 0x${BR_ORANGE#\#})║${BR_RESET}  OS within the OS — Neon Edition        $(_br_rgb 0x${BR_ORANGE#\#})║${BR_RESET}"
echo "$(_br_rgb 0x${BR_ORANGE#\#})╚════════════════════════════════════════════╝${BR_RESET}"
echo ""

# ══════════════════════════════════════════════════════════════════════════════
# End BlackRoad λ-Prompt v0.4
# ══════════════════════════════════════════════════════════════════════════════
