#!/usr/bin/env bash

# 🧬 BlackRoad System View (Local Mac)

clear
echo "🧬 BlackRoad System Snapshot — $(date)"
echo

echo "╭──────── Identity / OS ────────╮"
echo "👤 User:      $(whoami)"
echo "💻 Hostname:  $(hostname)"
echo "🧱 OS:        $(uname -sr)"
echo "╰───────────────────────────────╯"
echo

echo "╭──────── Uptime / Load ────────╮"
uptime
echo "╰───────────────────────────────╯"
echo

echo "╭──────── Disk (/) ─────────────╮"
df -h / | sed '1s/^/📦 /;2,$s/^/   /'
echo "╰───────────────────────────────╯"
echo

echo "╭──────── Active Network ───────╮"
echo "🌍 Primary IPs:"
ipconfig getifaddr en0 2>/dev/null && echo "   (Wi-Fi en0)" || true
ipconfig getifaddr en1 2>/dev/null && echo "   (Alt  en1)" || true
echo "╰───────────────────────────────╯"
echo

echo "╭──────── Top Processes (CPU) ──╮"
ps -Ao pid,pcpu,pmem,comm | head -n 6 | sed '1s/^/📊 /;2,$s/^/   /'
echo "╰───────────────────────────────╯"
echo

echo "Done. 🧠"
