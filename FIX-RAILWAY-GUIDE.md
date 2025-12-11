# Railway Deployment Fix Guide

## Issues Identified

### 1. Railway API Token Invalid/Expired ❌

**Current Status:**
- Token in `.env`: `a86da7fa-e3cd-4ef8-9e32-1f1520ce8972` - **INVALID**
- Token returns "Not Authorized" error from Railway GraphQL API

### 2. GitHub Actions Failing ❌

**Root Cause:**
- Repository security policy requires all GitHub Actions to be pinned to commit SHAs
- Workflows were using tags like `@v4` instead of full commit hashes

**Status:** ✅ **FIXED**
- Updated 31 workflow files to use commit SHA pins
- Ready to commit

### 3. Railway CLI Not Authenticated ❌

**Issue:**
- `railway list` command returns "Unauthorized" error
- Cannot list or manage Railway projects via CLI

## Fix Steps

### Step 1: Get New Railway Token (REQUIRED) 🔴

You need to manually get a new Railway API token:

1. **Go to Railway Dashboard:**
   ```
   https://railway.app/account/tokens
   ```

2. **Create a New Token:**
   - Click "Create Token"
   - Choose "**Project Token**" (NOT Team Token)
   - Give it a name like "BlackRoad OS Deployments"
   - Copy the token immediately (you won't see it again)

3. **Update Local Environment:**
   ```bash
   # Edit .env file
   nano .env

   # Replace the RAILWAY_TOKEN line with your new token:
   RAILWAY_TOKEN=your-new-token-here
   ```

4. **Reload Environment:**
   ```bash
   source .env
   ```

5. **Verify Token Works:**
   ```bash
   ./fix-railway-deployments.sh
   ```

### Step 2: Update GitHub Secrets

Once you have a valid Railway token:

```bash
# Set Railway token in GitHub
gh secret set RAILWAY_TOKEN -b"your-new-railway-token"

# Set Railway project ID (if needed)
gh secret set RAILWAY_PROJECT_ID -b"0c7bcf07-307b-4db6-9c94-22a456500d68"
```

### Step 3: Commit GitHub Actions Fixes

```bash
# Add the fixed workflow files
git add .github/workflows/

# Commit
git commit -m "fix: pin GitHub Actions to commit SHAs for security compliance"

# Push
git push origin gh-actions-deploy
```

### Step 4: Deploy Services

Once the token is fixed, deploy services:

#### Option A: Deploy All Services via GitHub Actions
```bash
# Trigger Railway deployment workflow
gh workflow run deploy-railway.yml

# Trigger multi-cloud deployment
gh workflow run deploy-multi-cloud.yml
```

#### Option B: Deploy Manually via Railway CLI
```bash
# Link to Railway project
railway link 0c7bcf07-307b-4db6-9c94-22a456500d68

# Deploy current directory
railway up

# Or deploy specific service
railway up --service api-gateway
```

#### Option C: Deploy via Orchestrator
```bash
# Start orchestrator (if not running)
python3 blackroad-railway-orchestrator.py &

# Deploy all services
curl -X POST http://localhost:8500/deploy/all
```

### Step 5: Verify Deployments

```bash
# Check Railway deployment status
python3 check-railway-deployments.py

# Or check via GitHub Actions
gh run list --limit 10

# Or check via web
open https://railway.com/project/0c7bcf07-307b-4db6-9c94-22a456500d68
```

## Summary of Changes Made

### ✅ Completed
1. **Fixed 31 GitHub workflow files** - Pinned all actions to commit SHAs
2. **Created diagnostic scripts:**
   - `check-railway-deployments.py` - Check deployment status via API
   - `fix-railway-deployments.sh` - Validate Railway authentication
   - `fix-github-actions-pins.py` - Auto-fix action pinning

### ⏳ Pending (Requires Manual Action)
1. **Get new Railway API token** from https://railway.app/account/tokens
2. **Update `.env` file** with new token
3. **Update GitHub secret** with: `gh secret set RAILWAY_TOKEN`
4. **Commit and push** the GitHub Actions fixes
5. **Re-run deployments** via GitHub Actions or Railway CLI

## Railway Projects

Current project: **blackroad-os-runtime**
- Project ID: `0c7bcf07-307b-4db6-9c94-22a456500d68`
- Environment ID: `dc6e2fde-bca0-4e07-9143-646c3e61a81d`
- Live URL: https://cozy-dream-all.up.railway.app
- Dashboard: https://railway.com/project/0c7bcf07-307b-4db6-9c94-22a456500d68

## Quick Commands

```bash
# 1. Get new Railway token (manual - see Step 1 above)

# 2. Update .env
echo "RAILWAY_TOKEN=your-new-token" >> .env

# 3. Verify token
./fix-railway-deployments.sh

# 4. Update GitHub
gh secret set RAILWAY_TOKEN

# 5. Commit fixes
git add .github/workflows/ && git commit -m "fix: pin GitHub Actions to commit SHAs"

# 6. Push
git push origin gh-actions-deploy

# 7. Deploy
gh workflow run deploy-railway.yml
```

## Files Modified

- `.github/workflows/*.yml` (31 files) - Pinned actions to commit SHAs
- Created:
  - `check-railway-deployments.py`
  - `fix-railway-deployments.sh`
  - `fix-github-actions-pins.py`
  - `FIX-RAILWAY-GUIDE.md` (this file)

## Next Session

When you return:
1. Check if Railway token has been updated in `.env`
2. Run `./fix-railway-deployments.sh` to verify
3. If token is valid, proceed with deployments
4. If not, follow Step 1 to get new token
