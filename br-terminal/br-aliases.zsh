# ══════════════════════════════════════════════════════════════════════════════
# BlackRoad Terminal OS — Aliases & Functions
# ══════════════════════════════════════════════════════════════════════════════

# ── Navigation ──
alias ..="cd .."
alias ...="cd ../.."
alias ....="cd ../../.."
alias ~="cd ~"
alias br="cd ~/blackroad-sandbox"
alias bro="cd ~/blackroad-os-operator"
alias brd="cd ~/blackroad-os-docs"

# ── Git (BlackRoad style) ──
alias gs="git status"
alias ga="git add"
alias gc="git commit -m"
alias gp="git push"
alias gl="git log --oneline --graph --all --decorate -10"
alias gd="git diff"
alias gco="git checkout"
alias gb="git branch"
alias gpl="git pull"

# ── Listing ──
alias ls="ls -G"  # macOS colored output
alias ll="ls -lah"
alias la="ls -A"
alias l="ls -CF"

# ── Quick Shortcuts ──
alias c="clear"
alias h="history"
alias j="jobs"
alias v="vim"
alias nv="nvim"

# ── Python ──
alias py="python3"
alias pip="python3 -m pip"
alias venv="python3 -m venv"
alias activate="source venv/bin/activate"

# ── Node / pnpm ──
alias pn="pnpm"
alias pni="pnpm install"
alias pnd="pnpm dev"
alias pnb="pnpm build"
alias pnt="pnpm test"

# ── Railway ──
alias rl="railway login"
alias rs="railway status"
alias rlk="railway link"
alias rd="railway up"
alias rlogs="railway logs"

# ── Cloudflare ──
alias cfl="npx wrangler login"
alias cfd="npx wrangler pages deploy"
alias cfp="npx wrangler pages project list"

# ── Docker ──
alias d="docker"
alias dc="docker-compose"
alias dps="docker ps"
alias dimg="docker images"
alias dex="docker exec -it"
alias dlog="docker logs -f"

# ── System ──
alias reload="source ~/.zshrc"
alias edit-zsh="$EDITOR ~/.zshrc"
alias path='echo $PATH | tr ":" "\n"'

# ── BlackRoad Specific ──
alias br-health="curl -s http://localhost:8000/health | jq"
alias br-version="curl -s http://localhost:8000/version | jq"
alias br-services="pnpm --filter=@blackroad/core run dev"
alias br-test="pnpm test"

# ── Function: Quick HTTP Server ──
serve() {
  local port="${1:-8000}"
  echo "🌐 Serving ${PWD} at http://localhost:${port}"
  python3 -m http.server "$port" --bind 127.0.0.1
}

# ── Function: Make directory and cd into it ──
mkcd() {
  mkdir -p "$1" && cd "$1"
}

# ── Function: Find process by port ──
port() {
  lsof -ti:"$1"
}

# ── Function: Kill process on port ──
killport() {
  local pid=$(lsof -ti:"$1")
  if [[ -n "$pid" ]]; then
    kill -9 "$pid"
    echo "🔪 Killed process $pid on port $1"
  else
    echo "❌ No process found on port $1"
  fi
}

# ── Function: Git commit with emoji prefix ──
gcm() {
  local emoji="$1"
  shift
  git commit -m "${emoji} $*"
}

# ── Function: Quick git add + commit + push ──
gacp() {
  git add .
  git commit -m "$1"
  git push
}

# ── Function: Create new branch and switch to it ──
gnb() {
  git checkout -b "$1"
}

# ── Function: Show top processes by CPU ──
topcpu() {
  ps aux | sort -rk 3,3 | head -n "${1:-10}"
}

# ── Function: Show top processes by memory ──
topmem() {
  ps aux | sort -rk 4,4 | head -n "${1:-10}"
}

# ── Function: Extract any archive ──
extract() {
  if [ -f "$1" ]; then
    case "$1" in
      *.tar.bz2)   tar xjf "$1"    ;;
      *.tar.gz)    tar xzf "$1"    ;;
      *.bz2)       bunzip2 "$1"    ;;
      *.rar)       unrar x "$1"    ;;
      *.gz)        gunzip "$1"     ;;
      *.tar)       tar xf "$1"     ;;
      *.tbz2)      tar xjf "$1"    ;;
      *.tgz)       tar xzf "$1"    ;;
      *.zip)       unzip "$1"      ;;
      *.Z)         uncompress "$1" ;;
      *.7z)        7z x "$1"       ;;
      *)           echo "'$1' cannot be extracted via extract()" ;;
    esac
  else
    echo "'$1' is not a valid file"
  fi
}

# ══════════════════════════════════════════════════════════════════════════════
# End BlackRoad Aliases & Functions
# ══════════════════════════════════════════════════════════════════════════════
