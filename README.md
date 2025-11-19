# BlackRoad OS — Core
The primary BlackRoad OS runtime — identity, desktop environment, UI engine, and state manager.

## Overview
BlackRoad OS Core provides the foundational runtime for the entire BlackRoad ecosystem. It manages identity, global state, UI layout, deterministic rendering, session logic, multi-agent embedding hooks, and the Pocket OS environment. All system components — Prism, Operator, API, and Web — interface with Core.

## Service layout
- **Framework:** FastAPI (Python 3.11+)
- **Entrypoint:** `src/app/main.py` (served with `uvicorn app.main:app`)
- **Configuration:** `src/app/config.py` reads environment variables and centralizes typed settings.
- **Health + version:** Implemented in `src/app/routes/health.py` and `src/app/routes/version.py`.
- **Dependencies:** Managed via `pyproject.toml`/`requirements.txt`.

## API routes
- `GET /` – simple welcome message
- `GET /health` – returns `{ status: "ok", timestamp, db?, cache? }`
- `GET /version` – returns version/build metadata

## Environment variables
| Variable | Required | Description |
| --- | --- | --- |
| `NODE_ENV` | Yes | `development`, `staging`, or `production` |
| `PORT` | Yes | Port uvicorn listens on (Railway provides `PORT`) |
| `PUBLIC_BASE_URL` | Yes | Public URL for this service (used by health checks/deploy scripts) |
| `DATABASE_URL` | Yes | Postgres connection string (from Railway `core-db`) |
| `REDIS_URL` | No | Redis connection string (from Railway `core-cache`, if used) |
| `GIT_COMMIT` | No | Git SHA injected at build/deploy time |
| `BUILD_TIME` | No | Build timestamp |
| `LOG_LEVEL` | No | Python logging level (default `INFO`) |

## Running locally
```bash
python -m venv .venv && source .venv/bin/activate
pip install -e .
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
```

## Deployment (Railway)
This repository deploys to Railway project **`blackroad-core`** as the service **`core-api`**.

Expected Railway services:
- **core-db** (PostgreSQL) → provides `DATABASE_URL`
- **core-cache** (Redis, optional) → provides `REDIS_URL`

Environments and URLs:
- `dev`: internal Railway URL (configure `PUBLIC_BASE_URL` in Railway)
- `staging`: `https://staging.core.blackroad.systems`
- `prod`: `https://core.blackroad.systems`

Deployment automation:
- `railway.json` describes the `core-api` service, build/start commands, and required env keys.
- `.github/workflows/deploy-core.yml` deploys on pushes to `dev` → Railway `dev`, `staging` → Railway `staging`, `main` → Railway `prod`, then performs a `/health` check on the deployed URL.

## Structured Table

| Field | Value |
| --- | --- |
| **Purpose** | OS runtime, identity, UI, session, global state |
| **Depends On** | API Gateway, Operator Engine |
| **Used By** | Prism Console, Web Client |
| **Owner** | Alexa + Cece (Core Engineering Group) |
| **Status** | Active — foundational |

## Roadmap

Columns:
- Backlog
- In Architecture
- In Dev
- Testing
- Release Ready
- Shipped

Sample tasks:
- Deterministic UI layout engine
- Pocket OS container template
- Identity/session handshake
- Operator dispatch integration
- Agent viewport layer
