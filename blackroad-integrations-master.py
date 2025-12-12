#!/usr/bin/env python3
# ============================================================================
# BlackRoad OS - Proprietary Software
# Copyright (c) 2025 BlackRoad OS, Inc. / Alexa Louise Amundson
# All Rights Reserved.
# ============================================================================
"""
BlackRoad Integrations Master - THE ULTIMATE INTEGRATION HUB

This service provides a unified API for ALL 25+ platform integrations.
NO MORE CONNECTOR HELL. ONE SERVICE TO RULE THEM ALL.

Integrations:
- Payment: Stripe
- Auth: Clerk
- Project Management: Asana, Notion, Jira, Linear
- Communication: Slack, Discord
- Code: GitHub, GitLab
- Email: Gmail, Outlook, Resend
- Storage: Google Drive, Dropbox, OneDrive
- Calendar: Google Calendar, Outlook Calendar
- Design: Figma, Canva
- Notes: OneNote
- Database: Airtable
- Infrastructure: Railway, Cloudflare, Vercel, DigitalOcean

Port: 10000 (Master Integration Hub)
"""

import os
import sys
import json
from datetime import datetime
from pathlib import Path
from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

# Load integration registry
REGISTRY_FILE = Path(__file__).parent / "INTEGRATION-REGISTRY.json"
INTEGRATION_REGISTRY = json.loads(REGISTRY_FILE.read_text()) if REGISTRY_FILE.exists() else {}

# ============================================================================
# INTEGRATION CONNECTORS
# ============================================================================

class IntegrationConnector:
    """Base class for all integration connectors"""

    def __init__(self, name: str, env_vars: list):
        self.name = name
        self.env_vars = env_vars
        self.enabled = all(os.getenv(var) for var in env_vars)

    def status(self) -> dict:
        return {
            "name": self.name,
            "enabled": self.enabled,
            "env_vars": {var: bool(os.getenv(var)) for var in self.env_vars}
        }


class StripeConnector(IntegrationConnector):
    """Stripe payment integration"""

    def __init__(self):
        super().__init__("stripe", ["STRIPE_SECRET_KEY"])
        self.api_key = os.getenv("STRIPE_SECRET_KEY")
        self.base_url = "https://api.stripe.com/v1"

    def create_checkout_session(self, price_id: str, success_url: str, cancel_url: str):
        if not self.enabled:
            return {"error": "Stripe not configured"}

        headers = {"Authorization": f"Bearer {self.api_key}"}
        data = {
            "mode": "payment",
            "line_items[0][price]": price_id,
            "line_items[0][quantity]": 1,
            "success_url": success_url,
            "cancel_url": cancel_url
        }

        response = requests.post(
            f"{self.base_url}/checkout/sessions",
            headers=headers,
            data=data
        )
        return response.json()

    def list_customers(self, limit=10):
        if not self.enabled:
            return {"error": "Stripe not configured"}

        headers = {"Authorization": f"Bearer {self.api_key}"}
        response = requests.get(
            f"{self.base_url}/customers?limit={limit}",
            headers=headers
        )
        return response.json()


class AsanaConnector(IntegrationConnector):
    """Asana project management integration"""

    def __init__(self):
        super().__init__("asana", ["ASANA_TOKEN"])
        self.token = os.getenv("ASANA_TOKEN")
        self.base_url = "https://app.asana.com/api/1.0"

    def list_tasks(self):
        if not self.enabled:
            return {"error": "Asana not configured"}

        headers = {"Authorization": f"Bearer {self.token}"}
        response = requests.get(
            f"{self.base_url}/tasks?assignee=me&opt_fields=name,completed,due_on",
            headers=headers
        )
        return response.json()


class NotionConnector(IntegrationConnector):
    """Notion workspace integration"""

    def __init__(self):
        super().__init__("notion", ["NOTION_TOKEN"])
        self.token = os.getenv("NOTION_TOKEN")
        self.base_url = "https://api.notion.com/v1"

    def search_pages(self, query=""):
        if not self.enabled:
            return {"error": "Notion not configured"}

        headers = {
            "Authorization": f"Bearer {self.token}",
            "Notion-Version": "2022-06-28"
        }
        data = {"filter": {"property": "object", "value": "page"}}
        if query:
            data["query"] = query

        response = requests.post(
            f"{self.base_url}/search",
            headers=headers,
            json=data
        )
        return response.json()


class GitHubConnector(IntegrationConnector):
    """GitHub code integration"""

    def __init__(self):
        super().__init__("github", ["GITHUB_TOKEN"])
        self.token = os.getenv("GITHUB_TOKEN")
        self.base_url = "https://api.github.com"

    def list_repos(self, org=None):
        if not self.enabled:
            return {"error": "GitHub not configured"}

        headers = {
            "Authorization": f"token {self.token}",
            "Accept": "application/vnd.github+json"
        }

        if org:
            url = f"{self.base_url}/orgs/{org}/repos"
        else:
            url = f"{self.base_url}/user/repos?sort=updated"

        response = requests.get(url, headers=headers)
        return response.json()

    def list_orgs(self):
        if not self.enabled:
            return {"error": "GitHub not configured"}

        headers = {
            "Authorization": f"token {self.token}",
            "Accept": "application/vnd.github+json"
        }
        response = requests.get(f"{self.base_url}/user/orgs", headers=headers)
        return response.json()


class SlackConnector(IntegrationConnector):
    """Slack communication integration"""

    def __init__(self):
        super().__init__("slack", ["SLACK_TOKEN"])
        self.token = os.getenv("SLACK_TOKEN")
        self.base_url = "https://slack.com/api"

    def list_channels(self):
        if not self.enabled:
            return {"error": "Slack not configured"}

        headers = {"Authorization": f"Bearer {self.token}"}
        response = requests.get(
            f"{self.base_url}/conversations.list",
            headers=headers
        )
        return response.json()

    def post_message(self, channel: str, text: str):
        if not self.enabled:
            return {"error": "Slack not configured"}

        headers = {"Authorization": f"Bearer {self.token}"}
        data = {"channel": channel, "text": text}
        response = requests.post(
            f"{self.base_url}/chat.postMessage",
            headers=headers,
            json=data
        )
        return response.json()


# Initialize all connectors
CONNECTORS = {
    "stripe": StripeConnector(),
    "asana": AsanaConnector(),
    "notion": NotionConnector(),
    "github": GitHubConnector(),
    "slack": SlackConnector(),
}


# ============================================================================
# API ROUTES
# ============================================================================

@app.route("/api/health", methods=["GET"])
def health():
    """Health check"""
    return jsonify({
        "ok": True,
        "service": "blackroad-integrations-master",
        "port": 10000,
        "timestamp": datetime.utcnow().isoformat() + "Z"
    })


@app.route("/api/status", methods=["GET"])
def status():
    """Get status of all integrations"""
    integrations = {}

    for name, connector in CONNECTORS.items():
        integrations[name] = connector.status()

    # Add integrations from registry that don't have connectors yet
    for name, config in INTEGRATION_REGISTRY.get("integrations", {}).items():
        if name not in integrations:
            env_vars = config.get("env_vars", [])
            integrations[name] = {
                "name": name,
                "enabled": all(os.getenv(var) for var in env_vars),
                "env_vars": {var: bool(os.getenv(var)) for var in env_vars},
                "connector": "pending"
            }

    enabled_count = sum(1 for i in integrations.values() if i.get("enabled"))

    return jsonify({
        "ok": True,
        "integrations": integrations,
        "total": len(integrations),
        "enabled": enabled_count,
        "categories": INTEGRATION_REGISTRY.get("categories", {})
    })


@app.route("/api/registry", methods=["GET"])
def registry():
    """Get full integration registry"""
    return jsonify({
        "ok": True,
        "registry": INTEGRATION_REGISTRY
    })


# ============================================================================
# STRIPE ROUTES
# ============================================================================

@app.route("/api/stripe/checkout", methods=["POST"])
def stripe_checkout():
    """Create Stripe checkout session"""
    data = request.json or {}
    connector = CONNECTORS["stripe"]

    result = connector.create_checkout_session(
        price_id=data.get("price_id"),
        success_url=data.get("success_url", "https://blackroad.io/success"),
        cancel_url=data.get("cancel_url", "https://blackroad.io")
    )

    return jsonify({"ok": "error" not in result, **result})


@app.route("/api/stripe/customers", methods=["GET"])
def stripe_customers():
    """List Stripe customers"""
    connector = CONNECTORS["stripe"]
    result = connector.list_customers()
    return jsonify({"ok": "error" not in result, **result})


# ============================================================================
# ASANA ROUTES
# ============================================================================

@app.route("/api/asana/tasks", methods=["GET"])
def asana_tasks():
    """List Asana tasks"""
    connector = CONNECTORS["asana"]
    result = connector.list_tasks()
    return jsonify({"ok": "error" not in result, **result})


# ============================================================================
# NOTION ROUTES
# ============================================================================

@app.route("/api/notion/search", methods=["POST"])
def notion_search():
    """Search Notion pages"""
    data = request.json or {}
    connector = CONNECTORS["notion"]
    result = connector.search_pages(query=data.get("query", ""))
    return jsonify({"ok": "error" not in result, **result})


# ============================================================================
# GITHUB ROUTES
# ============================================================================

@app.route("/api/github/repos", methods=["GET"])
def github_repos():
    """List GitHub repos"""
    org = request.args.get("org")
    connector = CONNECTORS["github"]
    result = connector.list_repos(org=org)
    return jsonify({"ok": "error" not in result, **result})


@app.route("/api/github/orgs", methods=["GET"])
def github_orgs():
    """List GitHub orgs"""
    connector = CONNECTORS["github"]
    result = connector.list_orgs()
    return jsonify({"ok": "error" not in result, **result})


# ============================================================================
# SLACK ROUTES
# ============================================================================

@app.route("/api/slack/channels", methods=["GET"])
def slack_channels():
    """List Slack channels"""
    connector = CONNECTORS["slack"]
    result = connector.list_channels()
    return jsonify({"ok": "error" not in result, **result})


@app.route("/api/slack/message", methods=["POST"])
def slack_message():
    """Post Slack message"""
    data = request.json or {}
    connector = CONNECTORS["slack"]
    result = connector.post_message(
        channel=data.get("channel"),
        text=data.get("text")
    )
    return jsonify({"ok": "error" not in result, **result})


# ============================================================================
# UNIFIED ROUTES
# ============================================================================

@app.route("/api/search/all", methods=["POST"])
def search_all():
    """Search across all enabled integrations"""
    data = request.json or {}
    query = data.get("query", "")

    results = {
        "query": query,
        "results": {}
    }

    # Search Notion
    if CONNECTORS["notion"].enabled:
        notion_results = CONNECTORS["notion"].search_pages(query)
        if "error" not in notion_results:
            results["results"]["notion"] = notion_results

    # Search GitHub (would need to implement search)
    # Add more integrations as needed

    return jsonify({"ok": True, **results})


if __name__ == "__main__":
    port = int(os.getenv("PORT", 10000))

    print("=" * 80)
    print("🔌 BlackRoad Integrations Master - THE ULTIMATE HUB")
    print("=" * 80)
    print(f"\nPort: {port}")
    print(f"Loaded registry: {len(INTEGRATION_REGISTRY.get('integrations', {}))} integrations")
    print("\nConnectors initialized:")

    for name, connector in CONNECTORS.items():
        status = "✅ ENABLED" if connector.enabled else "⚠️  DISABLED"
        print(f"  {name}: {status}")

    print("\nAPI Endpoints:")
    print("  GET  /api/health              - Health check")
    print("  GET  /api/status              - All integration status")
    print("  GET  /api/registry            - Full integration registry")
    print("\n  Stripe:")
    print("    POST /api/stripe/checkout   - Create checkout session")
    print("    GET  /api/stripe/customers  - List customers")
    print("\n  Asana:")
    print("    GET  /api/asana/tasks       - List tasks")
    print("\n  Notion:")
    print("    POST /api/notion/search     - Search pages")
    print("\n  GitHub:")
    print("    GET  /api/github/repos      - List repos")
    print("    GET  /api/github/orgs       - List orgs")
    print("\n  Slack:")
    print("    GET  /api/slack/channels    - List channels")
    print("    POST /api/slack/message     - Post message")
    print("\n  Unified:")
    print("    POST /api/search/all        - Search everywhere")
    print("\n" + "=" * 80)
    print("🚀 Starting server...")
    print("=" * 80 + "\n")

    app.run(host="0.0.0.0", port=port, debug=True)
