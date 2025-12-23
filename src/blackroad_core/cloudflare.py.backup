"""
BlackRoad OS - Cloudflare Infrastructure Integration
====================================================

Connects BlackRoad OS with Cloudflare services:
- Workers KV: Agent state persistence
- D1 Database: Relational data storage
- Pages: Static site hosting
- Workers: Edge compute
- Tunnels: Secure device connections

This module provides a unified interface to Cloudflare infrastructure,
enabling the 30K-agent system to leverage edge computing and global distribution.
"""

import os
import asyncio
import logging
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from enum import Enum
import httpx
import json

logger = logging.getLogger(__name__)


class CloudflareServiceType(str, Enum):
    """Types of Cloudflare services"""
    KV = "kv"
    D1 = "d1"
    PAGES = "pages"
    WORKERS = "workers"
    TUNNEL = "tunnel"


@dataclass
class CloudflareConfig:
    """Cloudflare configuration"""
    account_id: str
    api_token: str
    api_base_url: str = "https://api.cloudflare.com/client/v4"


@dataclass
class KVNamespace:
    """KV namespace metadata"""
    id: str
    title: str
    supports_url_encoding: bool = True


@dataclass
class D1Database:
    """D1 database metadata"""
    uuid: str
    name: str
    version: str
    created_at: str


class CloudflareClient:
    """
    Client for Cloudflare API operations.

    Provides methods to interact with KV, D1, Pages, and other services.
    """

    def __init__(self, config: CloudflareConfig):
        self.config = config
        self.client = httpx.AsyncClient(
            base_url=config.api_base_url,
            headers={
                "Authorization": f"Bearer {config.api_token}",
                "Content-Type": "application/json",
            },
            timeout=30.0
        )

    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose()

    # ========================================================================
    # Workers KV Operations
    # ========================================================================

    async def list_kv_namespaces(self) -> List[KVNamespace]:
        """List all KV namespaces"""
        try:
            response = await self.client.get(
                f"/accounts/{self.config.account_id}/storage/kv/namespaces"
            )
            response.raise_for_status()

            data = response.json()
            if not data.get("success"):
                raise Exception(f"KV list failed: {data.get('errors')}")

            return [
                KVNamespace(
                    id=ns["id"],
                    title=ns["title"],
                    supports_url_encoding=ns.get("supports_url_encoding", True)
                )
                for ns in data.get("result", [])
            ]
        except Exception as e:
            logger.error(f"Failed to list KV namespaces: {e}")
            return []

    async def create_kv_namespace(self, title: str) -> Optional[KVNamespace]:
        """Create a new KV namespace"""
        try:
            response = await self.client.post(
                f"/accounts/{self.config.account_id}/storage/kv/namespaces",
                json={"title": title}
            )
            response.raise_for_status()

            data = response.json()
            if not data.get("success"):
                raise Exception(f"KV creation failed: {data.get('errors')}")

            result = data["result"]
            return KVNamespace(
                id=result["id"],
                title=result["title"]
            )
        except Exception as e:
            logger.error(f"Failed to create KV namespace '{title}': {e}")
            return None

    async def kv_get(self, namespace_id: str, key: str) -> Optional[str]:
        """Get value from KV"""
        try:
            response = await self.client.get(
                f"/accounts/{self.config.account_id}/storage/kv/namespaces/{namespace_id}/values/{key}"
            )

            if response.status_code == 404:
                return None

            response.raise_for_status()
            return response.text
        except Exception as e:
            logger.error(f"Failed to get KV key '{key}': {e}")
            return None

    async def kv_put(
        self,
        namespace_id: str,
        key: str,
        value: str,
        expiration_ttl: Optional[int] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> bool:
        """Put value into KV"""
        try:
            data = {"value": value}

            if expiration_ttl:
                data["expiration_ttl"] = expiration_ttl

            if metadata:
                data["metadata"] = json.dumps(metadata)

            response = await self.client.put(
                f"/accounts/{self.config.account_id}/storage/kv/namespaces/{namespace_id}/values/{key}",
                json=data
            )
            response.raise_for_status()

            return response.json().get("success", False)
        except Exception as e:
            logger.error(f"Failed to put KV key '{key}': {e}")
            return False

    async def kv_delete(self, namespace_id: str, key: str) -> bool:
        """Delete key from KV"""
        try:
            response = await self.client.delete(
                f"/accounts/{self.config.account_id}/storage/kv/namespaces/{namespace_id}/values/{key}"
            )
            response.raise_for_status()
            return True
        except Exception as e:
            logger.error(f"Failed to delete KV key '{key}': {e}")
            return False

    async def kv_list_keys(
        self,
        namespace_id: str,
        prefix: Optional[str] = None,
        limit: int = 1000
    ) -> List[Dict[str, Any]]:
        """List keys in KV namespace"""
        try:
            params = {"limit": limit}
            if prefix:
                params["prefix"] = prefix

            response = await self.client.get(
                f"/accounts/{self.config.account_id}/storage/kv/namespaces/{namespace_id}/keys",
                params=params
            )
            response.raise_for_status()

            data = response.json()
            return data.get("result", [])
        except Exception as e:
            logger.error(f"Failed to list KV keys: {e}")
            return []

    # ========================================================================
    # D1 Database Operations
    # ========================================================================

    async def list_d1_databases(self) -> List[D1Database]:
        """List all D1 databases"""
        try:
            response = await self.client.get(
                f"/accounts/{self.config.account_id}/d1/database"
            )
            response.raise_for_status()

            data = response.json()
            if not data.get("success"):
                raise Exception(f"D1 list failed: {data.get('errors')}")

            return [
                D1Database(
                    uuid=db["uuid"],
                    name=db["name"],
                    version=db.get("version", "unknown"),
                    created_at=db.get("created_at", "")
                )
                for db in data.get("result", [])
            ]
        except Exception as e:
            logger.error(f"Failed to list D1 databases: {e}")
            return []

    async def create_d1_database(self, name: str) -> Optional[D1Database]:
        """Create a new D1 database"""
        try:
            response = await self.client.post(
                f"/accounts/{self.config.account_id}/d1/database",
                json={"name": name}
            )
            response.raise_for_status()

            data = response.json()
            if not data.get("success"):
                raise Exception(f"D1 creation failed: {data.get('errors')}")

            result = data["result"]
            return D1Database(
                uuid=result["uuid"],
                name=result["name"],
                version=result.get("version", "unknown"),
                created_at=result.get("created_at", "")
            )
        except Exception as e:
            logger.error(f"Failed to create D1 database '{name}': {e}")
            return None

    async def d1_query(
        self,
        database_id: str,
        sql: str,
        params: Optional[List[Any]] = None
    ) -> Optional[Dict[str, Any]]:
        """Execute SQL query on D1 database"""
        try:
            payload = {"sql": sql}
            if params:
                payload["params"] = params

            response = await self.client.post(
                f"/accounts/{self.config.account_id}/d1/database/{database_id}/query",
                json=payload
            )
            response.raise_for_status()

            data = response.json()
            if not data.get("success"):
                raise Exception(f"D1 query failed: {data.get('errors')}")

            return data.get("result", [{}])[0]
        except Exception as e:
            logger.error(f"Failed to execute D1 query: {e}")
            return None

    # ========================================================================
    # Pages Operations
    # ========================================================================

    async def list_pages_projects(self) -> List[Dict[str, Any]]:
        """List all Pages projects"""
        try:
            response = await self.client.get(
                f"/accounts/{self.config.account_id}/pages/projects"
            )
            response.raise_for_status()

            data = response.json()
            return data.get("result", [])
        except Exception as e:
            logger.error(f"Failed to list Pages projects: {e}")
            return []

    async def get_pages_project(self, project_name: str) -> Optional[Dict[str, Any]]:
        """Get Pages project details"""
        try:
            response = await self.client.get(
                f"/accounts/{self.config.account_id}/pages/projects/{project_name}"
            )
            response.raise_for_status()

            data = response.json()
            return data.get("result")
        except Exception as e:
            logger.error(f"Failed to get Pages project '{project_name}': {e}")
            return None

    # ========================================================================
    # Health Check
    # ========================================================================

    async def health_check(self) -> bool:
        """Check Cloudflare API connectivity"""
        try:
            response = await self.client.get(
                f"/accounts/{self.config.account_id}"
            )
            response.raise_for_status()
            return response.json().get("success", False)
        except Exception as e:
            logger.error(f"Cloudflare health check failed: {e}")
            return False


class AgentStateStore:
    """
    Agent state persistence using Cloudflare KV.

    Provides a distributed key-value store for agent memory and state,
    enabling agents to persist across restarts and scale globally.
    """

    def __init__(self, client: CloudflareClient, namespace_id: str):
        self.client = client
        self.namespace_id = namespace_id

    async def save_agent_state(
        self,
        agent_id: str,
        state: Dict[str, Any],
        ttl: Optional[int] = None
    ) -> bool:
        """Save agent state to KV"""
        key = f"agent:{agent_id}:state"
        value = json.dumps(state)
        return await self.client.kv_put(
            self.namespace_id,
            key,
            value,
            expiration_ttl=ttl
        )

    async def load_agent_state(self, agent_id: str) -> Optional[Dict[str, Any]]:
        """Load agent state from KV"""
        key = f"agent:{agent_id}:state"
        value = await self.client.kv_get(self.namespace_id, key)

        if value:
            try:
                return json.loads(value)
            except json.JSONDecodeError:
                logger.error(f"Failed to parse agent state for {agent_id}")
                return None

        return None

    async def delete_agent_state(self, agent_id: str) -> bool:
        """Delete agent state from KV"""
        key = f"agent:{agent_id}:state"
        return await self.client.kv_delete(self.namespace_id, key)

    async def list_agents(self, prefix: str = "agent:") -> List[str]:
        """List all agent IDs in storage"""
        keys = await self.client.kv_list_keys(self.namespace_id, prefix=prefix)
        return [
            key["name"].split(":")[1]  # Extract agent_id from "agent:{id}:state"
            for key in keys
            if key["name"].count(":") == 2
        ]


# ============================================================================
# Factory Functions
# ============================================================================

def create_cloudflare_client(
    account_id: Optional[str] = None,
    api_token: Optional[str] = None
) -> CloudflareClient:
    """
    Create a Cloudflare client from environment variables or parameters.

    Args:
        account_id: Cloudflare account ID (defaults to CLOUDFLARE_ACCOUNT_ID env var)
        api_token: Cloudflare API token (defaults to CLOUDFLARE_API_TOKEN env var)

    Returns:
        Configured CloudflareClient instance
    """
    config = CloudflareConfig(
        account_id=account_id or os.getenv("CLOUDFLARE_ACCOUNT_ID", ""),
        api_token=api_token or os.getenv("CLOUDFLARE_API_TOKEN", "")
    )

    if not config.account_id or not config.api_token:
        raise ValueError(
            "Cloudflare credentials not configured. "
            "Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN environment variables."
        )

    return CloudflareClient(config)


async def setup_agent_infrastructure(client: CloudflareClient) -> AgentStateStore:
    """
    Setup Cloudflare infrastructure for agent system.

    Creates necessary KV namespaces and returns an AgentStateStore.
    """
    # Check for existing "blackroad-agents" namespace
    namespaces = await client.list_kv_namespaces()
    agent_namespace = next(
        (ns for ns in namespaces if ns.title == "blackroad-agents"),
        None
    )

    # Create namespace if it doesn't exist
    if not agent_namespace:
        logger.info("Creating 'blackroad-agents' KV namespace...")
        agent_namespace = await client.create_kv_namespace("blackroad-agents")

        if not agent_namespace:
            raise Exception("Failed to create agent KV namespace")

        logger.info(f"Created namespace: {agent_namespace.id}")

    return AgentStateStore(client, agent_namespace.id)
