#!/usr/bin/env python3
"""
Deploy Integration Master to Railway via API
"""

import os
import json
import requests
import subprocess
import time

RAILWAY_TOKEN = os.getenv("RAILWAY_TOKEN")
RAILWAY_API = "https://backboard.railway.app/graphql/v2"

if not RAILWAY_TOKEN:
    print("❌ RAILWAY_TOKEN not set")
    exit(1)

headers = {
    "Authorization": f"Bearer {RAILWAY_TOKEN}",
    "Content-Type": "application/json"
}

# GraphQL query to create a service
CREATE_SERVICE_MUTATION = """
mutation CreateService($input: ServiceCreateInput!) {
  serviceCreate(input: $input) {
    id
    name
  }
}
"""

# GraphQL query to deploy
DEPLOY_MUTATION = """
mutation ServiceInstanceDeploy($serviceId: String!, $environmentId: String!) {
  serviceInstanceDeploy(serviceId: $serviceId, environmentId: $environmentId) {
    id
  }
}
"""

# GraphQL query to set variables
SET_VARIABLES_MUTATION = """
mutation VariableUpsert($input: VariableUpsertInput!) {
  variableUpsert(input: $input)
}
"""

# List projects
LIST_PROJECTS_QUERY = """
query {
  projects {
    edges {
      node {
        id
        name
        environments {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    }
  }
}
"""

print("=" * 80)
print("🚂 Deploying Integration Master to Railway")
print("=" * 80)
print()

# Get projects
print("📋 Fetching Railway projects...")
response = requests.post(
    RAILWAY_API,
    headers=headers,
    json={"query": LIST_PROJECTS_QUERY}
)

if response.status_code != 200:
    print(f"❌ Failed to fetch projects: {response.status_code}")
    print(response.text)
    exit(1)

data = response.json()
projects = data.get("data", {}).get("projects", {}).get("edges", [])

print(f"✅ Found {len(projects)} projects")
print()

# Find the sandbox project
sandbox_project = None
for project in projects:
    node = project["node"]
    if "sandbox" in node["name"].lower() or node["id"] == "0c7bcf07-307b-4db6-9c94-22a456500d68":
        sandbox_project = node
        break

if not sandbox_project:
    print("⚠️  Sandbox project not found, using first project")
    sandbox_project = projects[0]["node"] if projects else None

if not sandbox_project:
    print("❌ No projects found")
    exit(1)

project_id = sandbox_project["id"]
project_name = sandbox_project["name"]
environments = sandbox_project.get("environments", {}).get("edges", [])
environment_id = environments[0]["node"]["id"] if environments else None

print(f"📦 Using project: {project_name}")
print(f"   Project ID: {project_id}")
print(f"   Environment ID: {environment_id}")
print()

# Create service
print("🔨 Creating integration-master service...")

create_service_vars = {
    "input": {
        "projectId": project_id,
        "name": "integration-master",
        "source": {
            "repo": "BlackRoad-OS/blackroad-sandbox",
            "rootDirectory": "."
        }
    }
}

# Note: This might fail if service already exists, which is fine
response = requests.post(
    RAILWAY_API,
    headers=headers,
    json={
        "query": CREATE_SERVICE_MUTATION,
        "variables": create_service_vars
    }
)

print(f"Response: {response.status_code}")
if response.status_code == 200:
    result = response.json()
    if "errors" in result:
        print(f"⚠️  Service might already exist: {result['errors'][0]['message']}")
    else:
        service_data = result.get("data", {}).get("serviceCreate", {})
        print(f"✅ Service created: {service_data.get('name')} ({service_data.get('id')})")

print()

# Set environment variables
print("🔐 Setting environment variables...")

# Get all environment variables from current environment
env_vars = {
    "PORT": "10000",
    "PYTHONUNBUFFERED": "1",
    "NODE_ENV": "production"
}

# Add integration tokens (if available)
integration_vars = [
    "STRIPE_SECRET_KEY",
    "CLERK_SECRET_KEY",
    "ASANA_TOKEN",
    "NOTION_TOKEN",
    "JIRA_TOKEN",
    "LINEAR_TOKEN",
    "SLACK_TOKEN",
    "DISCORD_TOKEN",
    "GITHUB_TOKEN",
    "GMAIL_TOKEN",
    "OUTLOOK_TOKEN",
    "RESEND_API_KEY",
    "GOOGLE_DRIVE_TOKEN",
    "DROPBOX_TOKEN",
    "FIGMA_TOKEN",
    "CANVA_TOKEN",
    "AIRTABLE_API_KEY",
    "RAILWAY_TOKEN",
    "CLOUDFLARE_API_TOKEN",
    "VERCEL_TOKEN",
    "DIGITALOCEAN_TOKEN"
]

for var_name in integration_vars:
    var_value = os.getenv(var_name)
    if var_value:
        env_vars[var_name] = var_value

print(f"Setting {len(env_vars)} environment variables...")

# Note: The variables API might require different structure
# For now, we'll document what needs to be set

print("\n📝 Environment variables to set manually via Railway UI:")
print("   (Railway GraphQL API for variables is complex, recommend using UI)")
print()
for var_name in env_vars.keys():
    status = "✅" if var_name in ["PORT", "PYTHONUNBUFFERED", "NODE_ENV"] else ("🔑" if os.getenv(var_name) else "⚪")
    print(f"   {status} {var_name}")

print()
print("=" * 80)
print("📋 Deployment Summary")
print("=" * 80)
print()
print(f"Project: {project_name}")
print(f"Service: integration-master")
print(f"Port: 10000")
print()
print("Next Steps:")
print("1. Go to Railway dashboard: https://railway.app/project/{project_id}")
print("2. Find the 'integration-master' service")
print("3. Set environment variables in the UI")
print("4. Deploy from GitHub or manually upload files")
print()
print("Files to deploy:")
print("  - blackroad-integrations-master.py")
print("  - INTEGRATION-REGISTRY.json")
print("  - requirements.txt (add: flask flask-cors requests)")
print()
print("Alternative: Use Railway CLI")
print("  railway link {project_id}")
print("  railway up --service integration-master")
print()
print("=" * 80)
