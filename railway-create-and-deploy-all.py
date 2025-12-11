#!/usr/bin/env python3
# ============================================================================
# BlackRoad OS - Create and Deploy All Services to Railway
# Copyright (c) 2025 BlackRoad OS, Inc. / Alexa Louise Amundson
# All Rights Reserved.
# ============================================================================

import os
import sys
import json
import time
import requests
from typing import Dict, List, Optional

# Railway GraphQL API
RAILWAY_API = "https://backboard.railway.app/graphql"

class RailwayDeployer:
    def __init__(self):
        self.token = os.getenv("RAILWAY_TOKEN")
        if not self.token:
            print("❌ RAILWAY_TOKEN not set")
            sys.exit(1)

        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }

        self.project_id = "0c7bcf07-307b-4db6-9c94-22a456500d68"
        self.env_id = "dc6e2fde-bca0-4e07-9143-646c3e61a81d"

        self.stats = {
            "total": 0,
            "created": 0,
            "deployed": 0,
            "failed": 0,
            "services": []
        }

    def graphql_query(self, query: str, variables: dict = None) -> dict:
        """Execute GraphQL query"""
        payload = {"query": query}
        if variables:
            payload["variables"] = variables

        response = requests.post(RAILWAY_API, json=payload, headers=self.headers)

        if response.status_code == 200:
            return response.json()
        else:
            print(f"❌ GraphQL Error: {response.status_code}")
            print(response.text)
            return {}

    def list_services(self) -> List[dict]:
        """List all services in project"""
        query = """
        query project($id: String!) {
          project(id: $id) {
            services {
              edges {
                node {
                  id
                  name
                }
              }
            }
          }
        }
        """

        result = self.graphql_query(query, {"id": self.project_id})

        if "data" in result and "project" in result["data"]:
            services = result["data"]["project"]["services"]["edges"]
            return [edge["node"] for edge in services]
        return []

    def create_service(self, name: str, source_repo: str = None) -> Optional[str]:
        """Create a new service"""
        mutation = """
        mutation serviceCreate($input: ServiceCreateInput!) {
          serviceCreate(input: $input) {
            id
            name
          }
        }
        """

        # Create service from current directory
        service_input = {
            "projectId": self.project_id,
            "name": name
        }

        # If we have a source repo, add it
        if source_repo:
            service_input["source"] = {
                "repo": source_repo,
                "branch": "main"
            }

        result = self.graphql_query(mutation, {"input": service_input})

        if "data" in result and "serviceCreate" in result["data"]:
            service = result["data"]["serviceCreate"]
            print(f"  ✅ Created service: {service['name']} ({service['id']})")
            return service["id"]
        elif "errors" in result:
            print(f"  ❌ Error creating service: {result['errors']}")
            return None
        return None

    def set_service_variables(self, service_id: str, variables: dict):
        """Set environment variables for a service"""
        mutation = """
        mutation variableUpsert($input: VariableUpsertInput!) {
          variableUpsert(input: $input)
        }
        """

        for key, value in variables.items():
            var_input = {
                "environmentId": self.env_id,
                "serviceId": service_id,
                "name": key,
                "value": value
            }

            self.graphql_query(mutation, {"input": var_input})

    def deploy_service_from_code(self, service_name: str, script_path: str, port: int):
        """Deploy a service from local code"""
        print(f"\n{'='*70}")
        print(f"🚀 Deploying: {service_name}")
        print(f"{'='*70}")
        print(f"  Script: {script_path}")
        print(f"  Port: {port}")

        self.stats["total"] += 1

        # Check if script exists
        if not os.path.exists(script_path):
            print(f"  ❌ Script not found: {script_path}")
            self.stats["failed"] += 1
            return False

        # Check if service already exists
        services = self.list_services()
        existing_service = next((s for s in services if s["name"] == service_name), None)

        if existing_service:
            print(f"  ℹ️  Service already exists: {existing_service['id']}")
            service_id = existing_service["id"]
        else:
            # Create new service
            print(f"  📝 Creating new service...")
            service_id = self.create_service(service_name)

            if not service_id:
                print(f"  ❌ Failed to create service")
                self.stats["failed"] += 1
                return False

            self.stats["created"] += 1
            time.sleep(1)

        # Set environment variables
        print(f"  ⚙️  Setting environment variables...")
        env_vars = {
            "PORT": str(port),
            "PYTHONUNBUFFERED": "1",
            "BLACKROAD_ENV": "production"
        }
        self.set_service_variables(service_id, env_vars)

        # Create Nixpacks config for Python service
        toml_path = f"railway-{service_name}.toml"
        if not os.path.exists(toml_path):
            with open(toml_path, "w") as f:
                f.write(f"""[build]
builder = "NIXPACKS"

[deploy]
startCommand = "python3 {script_path}"
healthcheckPath = "/api/health"
healthcheckTimeout = 300
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10

[[services]]
name = "{service_name}"
""")
            print(f"  ✅ Created config: {toml_path}")

        print(f"  ✅ Service ready for deployment")

        self.stats["deployed"] += 1
        self.stats["services"].append({
            "name": service_name,
            "service_id": service_id,
            "script": script_path,
            "port": port
        })

        return True

    def deploy_all_services(self):
        """Deploy all 20 backend services"""
        print("\n" + "="*70)
        print("🚂 BlackRoad Railway Deployment - Create All Services")
        print("="*70)
        print(f"Project ID: {self.project_id}")
        print(f"Environment: production")
        print()

        # Define all services
        services = [
            # Layer 1: Foundation
            ("auth-api", "blackroad-auth-system.py", 11000),
            ("event-bus", "blackroad-event-bus.py", 9800),
            ("service-registry", "blackroad-service-registry.py", 9900),

            # Layer 2: Core APIs
            ("operator", "operator_http.py", 8000),
            ("agent-orchestrator", "blackroad-agent-orchestrator-v2.py", 10100),
            ("integrations-hub", "blackroad_integrations_hub.py", 9700),

            # Layer 3: Specialized Services
            ("vector-db", "blackroad-vectordb.py", 9600),
            ("stream", "blackroad-stream.py", 9500),
            ("message-queue", "blackroad-mq.py", 9400),
            ("llm-server", "blackroad-llm-server.py", 9300),
            ("api-gateway", "blackroad-api-gateway.py", 9200),
            ("service-mesh", "blackroad-service-mesh.py", 9100),
            ("backup", "blackroad-backup.py", 9000),
            ("cache", "blackroad-cache.py", 8900),
            ("ratelimiter", "blackroad-ratelimiter.py", 8800),
            ("observability", "blackroad-observability.py", 8700),
            ("agent-beacon", "blackroad-agent-beacon.py", 8600),
            ("leak-detector", "blackroad-leak-detector.py", 8500),
            ("console-server", "blackroad-console-server.py", 8888),
            ("terminal-server", "blackroad-terminal-server.py", 8080),
            ("ws-server", "blackroad-ws-server.py", 3000),
        ]

        # Deploy each service
        for service_name, script, port in services:
            self.deploy_service_from_code(service_name, script, port)
            time.sleep(1)  # Rate limiting

        # Print summary
        self.print_summary()

        # Save report
        self.save_report()

    def print_summary(self):
        """Print deployment summary"""
        print("\n" + "="*70)
        print("📊 Deployment Summary")
        print("="*70)
        print(f"Total Services: {self.stats['total']}")
        print(f"✅ Created: {self.stats['created']}")
        print(f"✅ Deployed: {self.stats['deployed']}")
        print(f"❌ Failed: {self.stats['failed']}")
        print()

        if self.stats['deployed'] == self.stats['total']:
            print("🎉 All services ready for deployment!")
        elif self.stats['deployed'] > 0:
            print("⚠️  Partial success")
        else:
            print("💥 Deployment failed")

        print("\n" + "="*70)
        print("Next Steps:")
        print("="*70)
        print("1. Push code to GitHub to trigger automatic deployment")
        print("2. Or manually deploy using Railway dashboard")
        print("3. View services: railway status")
        print("4. Open dashboard: railway open")
        print(f"5. Or visit: https://railway.com/project/{self.project_id}")
        print()

    def save_report(self):
        """Save deployment report"""
        from datetime import datetime

        report_file = f"RAILWAY_SERVICES_CREATED_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"

        with open(report_file, "w") as f:
            f.write("# Railway Services Created - All 20 Backends\n\n")
            f.write(f"**Date**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            f.write(f"**Project ID**: {self.project_id}\n\n")

            f.write("## Summary\n\n")
            f.write(f"- Total Services: {self.stats['total']}\n")
            f.write(f"- ✅ Created: {self.stats['created']}\n")
            f.write(f"- ✅ Ready: {self.stats['deployed']}\n")
            f.write(f"- ❌ Failed: {self.stats['failed']}\n\n")

            f.write("## Services\n\n")
            for service in self.stats['services']:
                f.write(f"### {service['name']}\n")
                f.write(f"- Service ID: `{service['service_id']}`\n")
                f.write(f"- Script: `{service['script']}`\n")
                f.write(f"- Port: `{service['port']}`\n")
                f.write(f"- Config: `railway-{service['name']}.toml`\n\n")

            f.write("## Access\n\n")
            f.write(f"**Dashboard**: https://railway.com/project/{self.project_id}\n\n")
            f.write("**Live Domain**: https://cozy-dream-all.up.railway.app\n\n")

        print(f"✅ Report saved: {report_file}\n")

def main():
    deployer = RailwayDeployer()
    deployer.deploy_all_services()

if __name__ == "__main__":
    main()
