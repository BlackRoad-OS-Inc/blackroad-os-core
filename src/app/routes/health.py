"""Health check endpoint."""
from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter

from .. import cache, db

router = APIRouter(tags=["meta"])


@router.get("/health")
async def health() -> dict:
    db_status = await db.check_health()
    cache_status = await cache.check_health()

    payload = {
        "status": "ok",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

    if db_status is not None:
        payload["db"] = "ok" if db_status else "error"

    if cache_status is not None:
        payload["cache"] = "ok" if cache_status else "error"

    return payload
