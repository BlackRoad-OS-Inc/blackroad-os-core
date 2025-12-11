#!/usr/bin/env python3
# ============================================================================
# BlackRoad OS - Proprietary Software
# Copyright (c) 2025 BlackRoad OS, Inc. / Alexa Louise Amundson
# All Rights Reserved.
# ============================================================================
"""
Check Railway deployment status via API
"""
import os
import requests
import json

RAILWAY_TOKEN = os.getenv('RAILWAY_TOKEN')
if not RAILWAY_TOKEN:
    print("❌ RAILWAY_TOKEN not set")
    exit(1)

API_URL = "https://backboard.railway.app/graphql/v2"

headers = {
    "Authorization": f"Bearer {RAILWAY_TOKEN}",
    "Content-Type": "application/json"
}

# Query to get all projects
query = """
query {
  projects {
    edges {
      node {
        id
        name
        services {
          edges {
            node {
              id
              name
            }
          }
        }
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

print("🔍 Fetching Railway projects...")
response = requests.post(API_URL, json={"query": query}, headers=headers)

if response.status_code != 200:
    print(f"❌ API request failed: {response.status_code}")
    print(response.text)
    exit(1)

data = response.json()

if 'errors' in data:
    print("❌ GraphQL errors:")
    print(json.dumps(data['errors'], indent=2))
    exit(1)

projects = data['data']['projects']['edges']

print(f"\n📊 Found {len(projects)} projects\n")

for project_edge in projects:
    project = project_edge['node']
    print(f"Project: {project['name']} (ID: {project['id']})")

    services = project['services']['edges']
    print(f"  Services: {len(services)}")
    for service_edge in services:
        service = service_edge['node']
        print(f"    - {service['name']} (ID: {service['id']})")

    environments = project['environments']['edges']
    print(f"  Environments: {len(environments)}")
    for env_edge in environments:
        env = env_edge['node']
        print(f"    - {env['name']} (ID: {env['id']})")
    print()

# Now let's check deployment status for each service in each project
print("\n🔍 Checking deployment status...\n")

deployment_query = """
query GetDeployments($projectId: String!, $serviceId: String!) {
  deployments(input: {projectId: $projectId, serviceId: $serviceId}) {
    edges {
      node {
        id
        status
        createdAt
        staticUrl
        meta
      }
    }
  }
}
"""

failed_deployments = []

for project_edge in projects:
    project = project_edge['node']
    project_id = project['id']
    project_name = project['name']

    services = project['services']['edges']

    for service_edge in services:
        service = service_edge['node']
        service_id = service['id']
        service_name = service['name']

        # Get deployments for this service
        response = requests.post(
            API_URL,
            json={
                "query": deployment_query,
                "variables": {
                    "projectId": project_id,
                    "serviceId": service_id
                }
            },
            headers=headers
        )

        if response.status_code == 200:
            dep_data = response.json()
            if 'data' in dep_data and dep_data['data']['deployments']:
                deployments = dep_data['data']['deployments']['edges']
                if deployments:
                    latest = deployments[0]['node']
                    status = latest['status']
                    url = latest.get('staticUrl', 'N/A')

                    status_emoji = {
                        'SUCCESS': '✅',
                        'FAILED': '❌',
                        'BUILDING': '🔨',
                        'DEPLOYING': '🚀',
                        'CRASHED': '💥',
                        'REMOVED': '🗑️'
                    }.get(status, '❓')

                    print(f"{status_emoji} {project_name}/{service_name}: {status}")
                    if url != 'N/A':
                        print(f"   URL: {url}")

                    if status in ['FAILED', 'CRASHED']:
                        failed_deployments.append({
                            'project': project_name,
                            'service': service_name,
                            'project_id': project_id,
                            'service_id': service_id,
                            'status': status
                        })
                else:
                    print(f"⚪ {project_name}/{service_name}: No deployments")
            else:
                print(f"⚪ {project_name}/{service_name}: No deployment data")

print(f"\n{'='*60}")
print(f"📊 Summary:")
print(f"   Total projects: {len(projects)}")
total_services = sum(len(p['node']['services']['edges']) for p in projects)
print(f"   Total services: {total_services}")
print(f"   Failed/Crashed: {len(failed_deployments)}")
print(f"{'='*60}\n")

if failed_deployments:
    print("❌ Failed deployments:")
    for dep in failed_deployments:
        print(f"   - {dep['project']}/{dep['service']}: {dep['status']}")
        print(f"     Project ID: {dep['project_id']}")
        print(f"     Service ID: {dep['service_id']}")
    print()
else:
    print("✅ All deployments successful!")
