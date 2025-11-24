# BlackRoad OS · Core Desktop UI (Gen-0)

Ultra-thin desktop/web shell scaffold for BlackRoad OS agents.

## Quickstart

```bash
pnpm i
pnpm dev --filter=web              # http://localhost:3000
pnpm dev --filter=desktop          # launches Tauri window
```

### Docker (web)

```bash
docker build -t blackroad/core-web:0.0.1 -f infra/Dockerfile .
docker run -e PORT=3000 -p 3000:3000 blackroad/core-web:0.0.1
```
