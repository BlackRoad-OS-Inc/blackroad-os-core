# 🚂 Railway Deployment - Integration Master

## FASTEST Way to Deploy (Manual via Dashboard)

**Go here NOW:** https://railway.app/project/0c7bcf07-307b-4db6-9c94-22a456500d68

### Step 1: Create Service
1. Click "+ New Service"
2. Select "Empty Service"
3. Name it: `integration-master`

### Step 2: Add Files
Upload these 3 files:
- `blackroad-integrations-master.py`
- `INTEGRATION-REGISTRY.json`
- Create `requirements.txt` with:
  ```
  flask==3.0.0
  flask-cors==4.0.0
  requests==2.31.0
  ```

### Step 3: Configure
- Start Command: `python3 blackroad-integrations-master.py`
- Add environment variables (at minimum):
  ```
  PORT=10000
  PYTHONUNBUFFERED=1
  STRIPE_SECRET_KEY=<your-key>
  CLERK_SECRET_KEY=<your-key>
  GITHUB_TOKEN=<your-token>
  ```

### Step 4: Deploy
Click "Deploy" and wait ~2 minutes!

## Test Deployment

```bash
# Get your Railway URL
RAILWAY_URL="https://integration-master.up.railway.app"

# Test it
curl $RAILWAY_URL/api/health
curl $RAILWAY_URL/api/status
```

## All Environment Variables

Copy/paste these into Railway (set the values you have):

```
PORT=10000
PYTHONUNBUFFERED=1
STRIPE_SECRET_KEY=
CLERK_SECRET_KEY=
ASANA_TOKEN=
NOTION_TOKEN=
JIRA_TOKEN=
LINEAR_TOKEN=
SLACK_TOKEN=
DISCORD_TOKEN=
GITHUB_TOKEN=
GMAIL_TOKEN=
OUTLOOK_TOKEN=
RESEND_API_KEY=
GOOGLE_DRIVE_TOKEN=
DROPBOX_TOKEN=
FIGMA_TOKEN=
CANVA_TOKEN=
AIRTABLE_API_KEY=
CLOUDFLARE_API_TOKEN=
VERCEL_TOKEN=
DIGITALOCEAN_TOKEN=
```

Done! 🎉
