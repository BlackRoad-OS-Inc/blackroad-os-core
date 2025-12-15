# BlackRoad Railway Gateway

**Railway Project ID:** `ef287e60-efa9-432e-a3bc-f6df4c7a7b35`

Main entry point for ALL BlackRoad domains and subdomains.

## Purpose

This service acts as a reverse proxy/API gateway that routes incoming requests to the appropriate backend service based on the domain/subdomain.

## Domains Handled

- **blackroad.systems** → Internal portals, agents, tools
- **blackroad.io** → Public products
- **blackroad.company** → Company operations
- **blackroad.me** → Personal portals
- **roadcoin.io** → Financial platform
- **roadchain.io** → Blockchain platform

## Architecture

```
User Request
    ↓
Railway Gateway (this service)
    ↓
Routes to Cloudflare Pages:
    ├── blackroad.systems → https://blackroad-systems.pages.dev
    ├── blackroad.io → https://blackroad-io.pages.dev
    ├── blackroad.company → https://blackroad-company.pages.dev
    ├── blackroad.me → https://blackroad-me.pages.dev
    ├── roadcoin.io → https://roadcoin-io.pages.dev
    └── roadchain.io → https://roadchain-io.pages.dev
```

## Deployment

### 1. Link to Railway Project

```bash
cd railway-gateway
railway link ef287e60-efa9-432e-a3bc-f6df4c7a7b35
```

### 2. Deploy

```bash
npm install
railway up
```

### 3. Add Custom Domains

```bash
# Add all domains to this Railway service
railway domain add blackroad.systems
railway domain add blackroad.io
railway domain add blackroad.company
railway domain add blackroad.me
railway domain add roadcoin.io
railway domain add roadchain.io

# Add key subdomains
railway domain add portal.blackroad.systems
railway domain add app.blackroad.io
railway domain add wallet.roadcoin.io
railway domain add explorer.roadchain.io
```

### 4. Configure DNS

Point all domains to the Railway URL:

```
# In Cloudflare DNS:
blackroad.systems → CNAME → <railway-url>
*.blackroad.systems → CNAME → <railway-url>
blackroad.io → CNAME → <railway-url>
*.blackroad.io → CNAME → <railway-url>
# ... etc for all domains
```

## Environment Variables

Set in Railway:

```env
NODE_ENV=production
PORT=3000

# Optional: Override service URLs
INTERNAL_SERVICES_URL=https://blackroad-systems.pages.dev
PRODUCT_SERVICES_URL=https://blackroad-io.pages.dev
COMPANY_SERVICES_URL=https://blackroad-company.pages.dev
PERSONAL_PORTAL_URL=https://blackroad-me.pages.dev
FINANCIAL_SERVICES_URL=https://roadcoin-io.pages.dev
BLOCKCHAIN_SERVICES_URL=https://roadchain-io.pages.dev
```

## Health Check

```bash
curl https://your-railway-url/health
```

Returns:
```json
{
  "status": "healthy",
  "service": "blackroad-railway-gateway",
  "project_id": "ef287e60-efa9-432e-a3bc-f6df4c7a7b35",
  "timestamp": "2025-12-14T...",
  "domains": [...],
  "services": {...}
}
```

## Local Development

```bash
npm install
npm start
```

Then test with curl:
```bash
curl http://localhost:3000/health
```

## Production Features TODO

- [ ] Replace redirects with proper HTTP proxy
- [ ] Add caching layer
- [ ] Add rate limiting
- [ ] Add request logging/analytics
- [ ] Add authentication for internal routes
- [ ] Add WebSocket support
- [ ] Add SSL/TLS termination

---

**Built by:** Cece 🚗
**Purpose:** Unified entry point for all BlackRoad infrastructure
