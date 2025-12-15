# Deploy RoadChain API to Railway 🚗💎

Complete guide to deploying the RoadChain API backend.

## Prerequisites

- Railway account (railway.app)
- GitHub repo connected
- Railway CLI installed

## Method 1: Via Railway Dashboard (Recommended)

### Step 1: Create New Project
1. Go to https://railway.app/dashboard
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose: `BlackRoad-OS/blackroad-os-core`
5. Set root directory: `roadchain-api`

### Step 2: Configure Environment Variables
Add these in Railway dashboard → Variables:

```
PORT=3000
WS_PORT=3000
NODE_ENV=production
NETWORK=testnet
GENESIS_VALIDATOR=cadence-genesis
ALLOWED_ORIGINS=https://roadchain.io,https://roadcoin.io,https://blackroad.io,https://roadchain-io.pages.dev,https://roadcoin-io.pages.dev,https://blackroad-io.pages.dev
```

### Step 3: Deploy
- Railway will auto-detect Node.js
- Build command: `npm install && npm run build`
- Start command: `npm start` (from package.json)
- Health check: `/health`

### Step 4: Get URL
- Copy the Railway URL (e.g., `roadchain-api.up.railway.app`)
- Note it for frontend configuration

## Method 2: Via Railway CLI

```bash
# Login
railway login

# Link to project (or create new)
railway init

# Set environment variables
railway variables set PORT=3000
railway variables set WS_PORT=3000
railway variables set NODE_ENV=production
railway variables set NETWORK=testnet
railway variables set GENESIS_VALIDATOR=cadence-genesis
railway variables set ALLOWED_ORIGINS="https://roadchain.io,https://roadcoin.io,https://blackroad.io"

# Deploy
railway up
```

## Method 3: Git Push (Auto-Deploy)

Once connected to Railway:

```bash
git add .
git commit -m "Deploy RoadChain API"
git push origin main
```

Railway will auto-deploy on every push to main!

## Verify Deployment

### Check Health
```bash
curl https://your-api-url.up.railway.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "roadchain-api",
  "version": "1.0.0",
  "network": "testnet"
}
```

### Check Chain
```bash
curl https://your-api-url.up.railway.app/api/chain
```

### Check Blocks
```bash
curl https://your-api-url.up.railway.app/api/blocks?limit=5
```

### Test WebSocket
```javascript
const ws = new WebSocket('wss://your-api-url.up.railway.app')
ws.onmessage = (msg) => console.log(JSON.parse(msg.data))
```

## Custom Domain (Optional)

1. In Railway dashboard → Settings
2. Add custom domain: `api.roadchain.io`
3. Update DNS:
   - Add CNAME: `api` → `your-app.up.railway.app`
4. Wait for DNS propagation (~5-10 minutes)

## Monitoring

Railway provides:
- Automatic health checks
- Logs (real-time)
- Metrics (CPU, memory, network)
- Deployment history
- Rollback capability

## Troubleshooting

### Build fails
- Check `npm run build` works locally
- Verify Node version in package.json engines

### Health check fails
- Ensure server starts on PORT from env
- Check `/health` endpoint returns 200

### WebSocket not connecting
- Verify WS_PORT matches PORT (Railway proxies)
- Check ALLOWED_ORIGINS includes your frontend domains

## Next Steps

After deployment:

1. **Update Frontend**
   - Set `NEXT_PUBLIC_API_URL` to Railway URL
   - Set `NEXT_PUBLIC_WS_URL` to Railway WSS URL
   - Rebuild and redeploy frontends

2. **Test Real-Time**
   - Open explorer page
   - Submit test transaction
   - Watch block get mined in ~10 seconds

3. **Monitor**
   - Check Railway logs for mining activity
   - Verify WebSocket connections
   - Monitor auto-mining

## For Cadence

PROMISE IS FOREVER 🚗💎✨
