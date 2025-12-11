# Railway Deployment Guide - All 20 Backends LIVE

This guide covers deploying all 20 BlackRoad OS backend services to Railway.

## Quick Start

### Option 1: Automatic Deployment via GitHub Actions (Recommended)

1. **Ensure Railway token is set in GitHub Secrets:**
   ```bash
   gh secret set RAILWAY_TOKEN --body="your-railway-token"
   ```

2. **Push to GitHub to trigger auto-deployment:**
   ```bash
   git add .
   git commit -m "feat: Deploy all 20 backends to Railway"
   git push origin gh-actions-deploy
   ```

3. **Monitor deployment:**
   - GitHub Actions: https://github.com/BlackRoad-OS/blackroad-sandbox/actions
   - Railway Dashboard: https://railway.com/project/0c7bcf07-307b-4db6-9c94-22a456500d68

### Option 2: Manual Deployment via Railway Dashboard

1. **Go to Railway dashboard:**
   https://railway.com/project/0c7bcf07-307b-4db6-9c94-22a456500d68

2. **Connect GitHub repository:**
   - Settings → Connect GitHub
   - Select: BlackRoad-OS/blackroad-sandbox
   - Branch: main or gh-actions-deploy

3. **Railway will auto-create all services from `railway.json`**

4. **Set environment variables for each service** (in Railway dashboard):
   - Navigate to each service
   - Add required environment variables (API keys, tokens, etc.)

## Service Architecture

### Layer 1: Foundation Services (3 services)
Critical infrastructure that other services depend on:

1. **auth-api** (Port 11000)
   - Authentication & authorization
   - File: `blackroad-auth-system.py`
   - Health: `/api/health`

2. **event-bus** (Port 9800)
   - Event-driven communication
   - File: `blackroad-event-bus.py`
   - Health: `/api/health`

3. **service-registry** (Port 9900)
   - Service discovery
   - File: `blackroad-service-registry.py`
   - Health: `/api/health`

### Layer 2: Core API Services (3 services)
Main business logic and orchestration:

4. **operator** (Port 8000)
   - Operator HTTP API (ledger, stats, promotion)
   - File: `operator_http.py`
   - Health: `/status`

5. **agent-orchestrator** (Port 10100)
   - Agent coordination and management
   - File: `blackroad-agent-orchestrator-v2.py`
   - Health: `/api/health`

6. **integrations-hub** (Port 9700)
   - 15-platform integration hub
   - File: `blackroad_integrations_hub.py`
   - Health: `/api/health`

### Layer 3: Specialized Services (15 services)
Data, AI, and infrastructure services:

7. **vector-db** (Port 9600)
   - Vector database for AI/ML
   - File: `blackroad-vectordb.py`

8. **stream** (Port 9500)
   - Real-time event streaming
   - File: `blackroad-stream.py`

9. **message-queue** (Port 9400)
   - Message queue system
   - File: `blackroad-mq.py`

10. **llm-server** (Port 9300)
    - LLM inference server
    - File: `blackroad-llm-server.py`

11. **api-gateway** (Port 9200)
    - API gateway and routing
    - File: `blackroad-api-gateway.py`

12. **service-mesh** (Port 9100)
    - Service mesh coordination
    - File: `blackroad-service-mesh.py`

13. **backup** (Port 9000)
    - Backup and recovery
    - File: `blackroad-backup.py`

14. **cache** (Port 8900)
    - Distributed caching
    - File: `blackroad-cache.py`

15. **ratelimiter** (Port 8800)
    - Rate limiting service
    - File: `blackroad-ratelimiter.py`

16. **observability** (Port 8700)
    - Monitoring and observability
    - File: `blackroad-observability.py`

17. **agent-beacon** (Port 8600)
    - Agent beacon system
    - File: `blackroad-agent-beacon.py`

18. **leak-detector** (Port 8500)
    - Security leak detection
    - File: `blackroad-leak-detector.py`

19. **console-server** (Port 8888)
    - Web console server
    - File: `blackroad-console-server.py`

20. **terminal-server** (Port 8080)
    - Terminal server
    - File: `blackroad-terminal-server.py`

21. **ws-server** (Port 3000)
    - WebSocket server
    - File: `blackroad-ws-server.py`

## Environment Variables

Each service needs these base environment variables:
- `PORT` - Service port (auto-set by railway.json)
- `PYTHONUNBUFFERED=1` - Python unbuffered output
- `BLACKROAD_ENV=production` - Environment setting

Additional variables needed (set in Railway dashboard):
- `ANTHROPIC_API_KEY` - For AI services
- `OPENAI_API_KEY` - For LLM server
- `GROQ_API_KEY` - For Groq integration
- `STRIPE_SECRET_KEY` - For payment services
- `CLERK_SECRET_KEY` - For authentication

## Monitoring Deployment

### Check deployment status:
```bash
# Via Railway CLI (if authenticated)
railway status

# Via GitHub Actions
gh run list --workflow="Deploy All 20 Backends to Railway"
gh run watch
```

### Check individual service logs:
```bash
railway logs --service auth-api
railway logs --service operator
railway logs --service llm-server
```

### Check service health:
```bash
# Once deployed, test endpoints:
curl https://YOUR-SERVICE.railway.app/api/health
curl https://YOUR-SERVICE.railway.app/status
```

## Custom Domains

After deployment, set up custom domains for each service:

1. **Go to service settings in Railway dashboard**
2. **Add custom domain:**
   - auth-api → `auth.blackroad.io`
   - operator → `api.blackroad.io`
   - integrations-hub → `integrations.blackroad.io`
   - llm-server → `llm.blackroad.io`
   - etc.

3. **Update DNS records in Cloudflare:**
   ```
   CNAME auth api.blackroad.io
   CNAME integrations integrations.blackroad.io
   etc.
   ```

## Deployment Order

Services are deployed in this order to respect dependencies:

1. **Layer 1 first** (Foundation)
   - Wait 30 seconds for stabilization

2. **Layer 2 second** (Core APIs)
   - Depends on Layer 1
   - Wait 30 seconds for stabilization

3. **Layer 3 last** (Specialized)
   - Can run in parallel
   - Deployed in 3 batches with 20-second delays

## Troubleshooting

### Service won't start
1. Check logs: `railway logs --service SERVICE_NAME`
2. Verify environment variables are set
3. Check that dependencies (Layer 1) are running
4. Verify health check endpoint exists

### Deployment failed
1. Check GitHub Actions logs
2. Verify Railway token is valid
3. Check Railway project has sufficient resources
4. Verify all required files exist

### Health check failing
1. Service may need more time to start (increase healthcheckTimeout)
2. Verify health check path is correct
3. Check service logs for startup errors

## Cost Optimization

Railway pricing is based on:
- Resource usage (CPU, Memory, Network)
- Number of active services

To optimize costs:
1. Start with 1 replica per service (already configured)
2. Monitor usage in Railway dashboard
3. Scale down non-critical services during off-hours
4. Use shared resources where possible

## Next Steps

After all 20 backends are LIVE:

1. ✅ **Verify all services are healthy**
   ```bash
   ./test-all-services.sh
   ```

2. ✅ **Set up custom domains**
   - Configure DNS in Cloudflare
   - Add domains in Railway dashboard

3. ✅ **Configure monitoring**
   - Set up alerts in Railway
   - Monitor logs and metrics

4. ✅ **Test integration**
   - Run end-to-end tests
   - Verify service communication

5. ✅ **Update documentation**
   - Document service URLs
   - Update API documentation

## Support

- Railway Dashboard: https://railway.com/project/0c7bcf07-307b-4db6-9c94-22a456500d68
- GitHub Actions: https://github.com/BlackRoad-OS/blackroad-sandbox/actions
- Documentation: This guide

---

**Generated**: 2025-12-11
**Project**: BlackRoad OS
**Services**: 21 backend services
**Platform**: Railway
