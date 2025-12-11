#!/usr/bin/env bash
# ============================================================================
# BlackRoad OS - Deploy All 20 Backends to Railway
# Copyright (c) 2025 BlackRoad OS, Inc. / Alexa Louise Amundson
# All Rights Reserved.
# ============================================================================

set -euo pipefail

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
RESET='\033[0m'
BOLD='\033[1m'

PROJECT_ID="0c7bcf07-307b-4db6-9c94-22a456500d68"
ENV_ID="dc6e2fde-bca0-4e07-9143-646c3e61a81d"

echo -e "${CYAN}${BOLD}"
echo "╔═══════════════════════════════════════════════════════════════════╗"
echo "║     BlackRoad OS - Deploy All 20 Backends to Railway             ║"
echo "╚═══════════════════════════════════════════════════════════════════╝"
echo -e "${RESET}"

# Check Railway CLI
if ! command -v railway &> /dev/null; then
    echo -e "${RED}❌ Railway CLI not installed${RESET}"
    echo "Install with: npm install -g @railway/cli"
    exit 1
fi

# Check Railway token
if [ -z "${RAILWAY_TOKEN:-}" ]; then
    echo -e "${YELLOW}⚠️  RAILWAY_TOKEN not set${RESET}"
    echo "Please set RAILWAY_TOKEN environment variable"
    exit 1
fi

echo -e "${GREEN}✓${RESET} Railway CLI ready"
echo -e "${GREEN}✓${RESET} Railway token configured"
echo ""

# Define service layers with dependencies
declare -a LAYER_1=(
    "blackroad-auth-system.py:11000:auth-api"
    "blackroad-event-bus.py:9800:event-bus"
    "blackroad-service-registry.py:9900:service-registry"
)

declare -a LAYER_2=(
    "operator_http.py:8000:operator"
    "blackroad-agent-orchestrator-v2.py:10100:agent-orchestrator"
    "blackroad_integrations_hub.py:9700:integrations-hub"
)

declare -a LAYER_3=(
    "blackroad-vectordb.py:9600:vector-db"
    "blackroad-stream.py:9500:stream"
    "blackroad-mq.py:9400:message-queue"
    "blackroad-llm-server.py:9300:llm-server"
    "blackroad-api-gateway.py:9200:api-gateway"
    "blackroad-service-mesh.py:9100:service-mesh"
    "blackroad-backup.py:9000:backup"
    "blackroad-cache.py:8900:cache"
    "blackroad-ratelimiter.py:8800:ratelimiter"
    "blackroad-observability.py:8700:observability"
    "blackroad-agent-beacon.py:8600:agent-beacon"
    "blackroad-leak-detector.py:8500:leak-detector"
    "blackroad-console-server.py:8888:console-server"
    "blackroad-terminal-server.py:8080:terminal-server"
    "blackroad-ws-server.py:3000:ws-server"
)

TOTAL_SERVICES=$((${#LAYER_1[@]} + ${#LAYER_2[@]} + ${#LAYER_3[@]}))
CURRENT=0
SUCCESSFUL=0
FAILED=0

deploy_service() {
    local service_info="$1"
    local layer="$2"

    IFS=':' read -r script port service_name <<< "$service_info"

    CURRENT=$((CURRENT + 1))

    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
    echo -e "${BOLD}[$CURRENT/$TOTAL_SERVICES] Deploying: $service_name (Layer $layer)${RESET}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
    echo -e "  Script: ${BLUE}$script${RESET}"
    echo -e "  Port: ${BLUE}$port${RESET}"
    echo -e "  Service: ${BLUE}$service_name${RESET}"
    echo ""

    # Check if script exists
    if [ ! -f "$script" ]; then
        echo -e "${RED}  ❌ Script not found: $script${RESET}"
        FAILED=$((FAILED + 1))
        echo ""
        return 1
    fi

    # Check if corresponding Railway config exists
    local railway_config="railway-${service_name}.toml"
    if [ -f "$railway_config" ]; then
        echo -e "${GREEN}  ✓${RESET} Found Railway config: $railway_config"
    else
        echo -e "${YELLOW}  ⚠️  No Railway config found: $railway_config${RESET}"
        echo -e "${BLUE}  → Using default configuration${RESET}"
    fi

    # Deploy using Railway CLI
    echo -e "${BLUE}  🚀 Deploying to Railway...${RESET}"

    # Create a temporary Nixpacks config if needed
    if [ ! -f "$railway_config" ]; then
        cat > "railway-${service_name}.toml" <<EOF
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "python3 $script"
healthcheckPath = "/api/health"
healthcheckTimeout = 300
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10

[[services]]
name = "$service_name"

[services.env]
PORT = "$port"
PYTHONUNBUFFERED = "1"
EOF
        echo -e "${GREEN}  ✓${RESET} Created Railway config: railway-${service_name}.toml"
    fi

    # Deploy (using railway up with service name)
    if railway up --detach --service "$service_name" 2>&1 | tee "/tmp/railway-deploy-$service_name.log"; then
        echo -e "${GREEN}  ✅ Deployment triggered successfully${RESET}"
        SUCCESSFUL=$((SUCCESSFUL + 1))

        # Wait a moment for deployment to start
        sleep 2
    else
        echo -e "${RED}  ❌ Deployment failed${RESET}"
        echo -e "${YELLOW}  → Check logs: railway logs --service $service_name${RESET}"
        FAILED=$((FAILED + 1))
    fi

    echo ""
}

# Link to project
echo -e "${BLUE}Linking to Railway project...${RESET}"
if railway link -p "$PROJECT_ID" 2>&1; then
    echo -e "${GREEN}✓${RESET} Linked to project: $PROJECT_ID"
else
    echo -e "${YELLOW}⚠️  Already linked or link failed (continuing...)${RESET}"
fi
echo ""

# Deploy Layer 1 (Foundation)
echo -e "${CYAN}${BOLD}"
echo "╔═══════════════════════════════════════════════════════════════════╗"
echo "║  Layer 1: Foundation Services (Auth, Events, Registry)           ║"
echo "╚═══════════════════════════════════════════════════════════════════╝"
echo -e "${RESET}"
echo ""

for service in "${LAYER_1[@]}"; do
    deploy_service "$service" "1"
    sleep 3  # Wait between deployments
done

echo -e "${GREEN}✓${RESET} Layer 1 deployment complete"
echo -e "${BLUE}⏳ Waiting 10 seconds for services to stabilize...${RESET}"
sleep 10
echo ""

# Deploy Layer 2 (Core APIs)
echo -e "${CYAN}${BOLD}"
echo "╔═══════════════════════════════════════════════════════════════════╗"
echo "║  Layer 2: Core API Services (Operator, Agents, Integrations)     ║"
echo "╚═══════════════════════════════════════════════════════════════════╝"
echo -e "${RESET}"
echo ""

for service in "${LAYER_2[@]}"; do
    deploy_service "$service" "2"
    sleep 3
done

echo -e "${GREEN}✓${RESET} Layer 2 deployment complete"
echo -e "${BLUE}⏳ Waiting 10 seconds for services to stabilize...${RESET}"
sleep 10
echo ""

# Deploy Layer 3 (Specialized Services)
echo -e "${CYAN}${BOLD}"
echo "╔═══════════════════════════════════════════════════════════════════╗"
echo "║  Layer 3: Specialized Services (Data, AI, Infrastructure)        ║"
echo "╚═══════════════════════════════════════════════════════════════════╝"
echo -e "${RESET}"
echo ""

for service in "${LAYER_3[@]}"; do
    deploy_service "$service" "3"
    sleep 2
done

echo -e "${GREEN}✓${RESET} Layer 3 deployment complete"
echo ""

# Deployment Summary
echo -e "${CYAN}${BOLD}"
echo "╔═══════════════════════════════════════════════════════════════════╗"
echo "║  Deployment Summary                                               ║"
echo "╚═══════════════════════════════════════════════════════════════════╝"
echo -e "${RESET}"
echo ""
echo -e "  Total Services: ${BOLD}$TOTAL_SERVICES${RESET}"
echo -e "  ${GREEN}✅ Successful: $SUCCESSFUL${RESET}"
echo -e "  ${RED}❌ Failed: $FAILED${RESET}"
echo ""

if [ $SUCCESSFUL -eq $TOTAL_SERVICES ]; then
    echo -e "${GREEN}${BOLD}🎉 All backends deployed successfully!${RESET}"
elif [ $SUCCESSFUL -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Partial deployment completed${RESET}"
else
    echo -e "${RED}💥 Deployment failed${RESET}"
fi

echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "${BOLD}Next Steps:${RESET}"
echo ""
echo "  • Check deployment status:"
echo "    ${BLUE}railway status${RESET}"
echo ""
echo "  • View logs for a service:"
echo "    ${BLUE}railway logs --service SERVICE_NAME${RESET}"
echo ""
echo "  • Open Railway dashboard:"
echo "    ${BLUE}railway open${RESET}"
echo "    Or visit: https://railway.com/project/$PROJECT_ID"
echo ""
echo "  • View all domains:"
echo "    ${BLUE}railway domain${RESET}"
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo ""

# Save deployment report
REPORT_FILE="RAILWAY_DEPLOYMENT_LIVE_$(date +%Y%m%d_%H%M%S).md"
cat > "$REPORT_FILE" <<EOF
# Railway Deployment Report - All 20 Backends LIVE
**Date**: $(date '+%Y-%m-%d %H:%M:%S')
**Project ID**: $PROJECT_ID
**Environment**: production

## Deployment Summary
- Total Services: $TOTAL_SERVICES
- ✅ Successful: $SUCCESSFUL
- ❌ Failed: $FAILED
- Success Rate: $(( SUCCESSFUL * 100 / TOTAL_SERVICES ))%

## Services Deployed

### Layer 1: Foundation Services
$(for service in "${LAYER_1[@]}"; do
    IFS=':' read -r script port service_name <<< "$service"
    echo "- \`$service_name\` - Port $port - $script"
done)

### Layer 2: Core API Services
$(for service in "${LAYER_2[@]}"; do
    IFS=':' read -r script port service_name <<< "$service"
    echo "- \`$service_name\` - Port $port - $script"
done)

### Layer 3: Specialized Services
$(for service in "${LAYER_3[@]}"; do
    IFS=':' read -r script port service_name <<< "$service"
    echo "- \`$service_name\` - Port $port - $script"
done)

## Access Information

**Railway Dashboard**: https://railway.com/project/$PROJECT_ID

**Live Domain**: https://cozy-dream-all.up.railway.app

## Next Steps
1. Verify all services are healthy
2. Configure custom domains for each service
3. Set up monitoring and alerts
4. Test all API endpoints
5. Configure DNS records

---
Generated by BlackRoad OS Deployment System
EOF

echo -e "${GREEN}✓${RESET} Deployment report saved to: ${BOLD}$REPORT_FILE${RESET}"
echo ""
