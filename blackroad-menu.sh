#!/usr/bin/env bash

# 🎛️ BlackRoad Mini Dashboard

while true; do
  clear
  echo "🎛️  BlackRoad Operator Panel"
  echo "──────────────────────────────────────"
  echo "1) 🛰️  HTTP health (services view)"
  echo "2) 🌐  Network (ping + ports view)"
  echo "3) 🧬  System (local machine view)"
  echo "q) 🚪 Quit"
  echo "──────────────────────────────────────"
  read -rp "Choose an option: " choice

  case "$choice" in
    1)
      echo
      ./blackroad-health.sh || echo "⚠️  blackroad-health.sh failed or not found"
      read -rp $'\nPress Enter to return to menu...'
      ;;
    2)
      echo
      ./blackroad-netcheck.sh || echo "⚠️  blackroad-netcheck.sh failed or not found"
      read -rp $'\nPress Enter to return to menu...'
      ;;
    3)
      echo
      ./blackroad-system.sh || echo "⚠️  blackroad-system.sh failed or not found"
      read -rp $'\nPress Enter to return to menu...'
      ;;
    q|Q)
      echo "Bye 👋"
      exit 0
      ;;
    *)
      echo "Invalid choice."
      sleep 1
      ;;
  esac
done
