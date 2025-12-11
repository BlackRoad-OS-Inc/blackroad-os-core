#!/usr/bin/env python3
# ============================================================================
# BlackRoad OS - Proprietary Software
# Copyright (c) 2025 BlackRoad OS, Inc. / Alexa Louise Amundson
# All Rights Reserved.
# ============================================================================
"""
Fix GitHub Actions to use pinned commit SHAs instead of tags
"""
import os
import re
import subprocess
from pathlib import Path

# Common actions with their latest stable commit SHAs (as of Dec 2025)
ACTION_PINS = {
    'actions/checkout@v4': 'actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683',  # v4.2.2
    'actions/checkout@v3': 'actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683',  # Use v4
    'actions/setup-node@v4': 'actions/setup-node@39370e3970a6d050c480ffad4ff0ed4d3fdee5af',  # v4.1.0
    'actions/setup-node@v3': 'actions/setup-node@39370e3970a6d050c480ffad4ff0ed4d3fdee5af',  # Use v4
    'actions/setup-python@v5': 'actions/setup-python@0b93645e9fea7318ecaed2b359559ac225c90a2b',  # v5.3.0
    'actions/setup-python@v4': 'actions/setup-python@0b93645e9fea7318ecaed2b359559ac225c90a2b',  # Use v5
    'actions/upload-artifact@v4': 'actions/upload-artifact@b4b15b8c7c6ac21ea08fcf65892d2ee8f75cf882',  # v4.4.3
    'actions/upload-artifact@v3': 'actions/upload-artifact@b4b15b8c7c6ac21ea08fcf65892d2ee8f75cf882',  # Use v4
    'actions/download-artifact@v4': 'actions/download-artifact@fa0a91b85d4f404e444e00e005971372dc801d16',  # v4.1.8
    'actions/cache@v4': 'actions/cache@1bd1e32a3bdc45362d1e726936510720a7c30a57',  # v4.2.0
    'actions/cache@v3': 'actions/cache@1bd1e32a3bdc45362d1e726936510720a7c30a57',  # Use v4
    'docker/setup-buildx-action@v3': 'docker/setup-buildx-action@c47758b77c9736f4b2ef4073d4d51994fabfe349',  # v3.7.1
    'docker/login-action@v3': 'docker/login-action@9780b0c442fbb1117ed29e0efdff1e18412f7567',  # v3.3.0
    'docker/build-push-action@v5': 'docker/build-push-action@4f58ea79222b3b9dc2c8bbdd6debcef730109a75',  # v5.4.0
    'github/codeql-action/init@v3': 'github/codeql-action/init@9278e1e1a4861d5e3a5ff3c2c3e89a11b4d1a39e',  # v3.27.9
    'github/codeql-action/autobuild@v3': 'github/codeql-action/autobuild@9278e1e1a4861d5e3a5ff3c2c3e89a11b4d1a39e',  # v3.27.9
    'github/codeql-action/analyze@v3': 'github/codeql-action/analyze@9278e1e1a4861d5e3a5ff3c2c3e89a11b4d1a39e',  # v3.27.9
}

def fix_workflow_file(file_path):
    """Fix a single workflow file"""
    print(f"Processing {file_path}...")

    with open(file_path, 'r') as f:
        content = f.read()

    original_content = content
    changed = False

    # Replace each action with its pinned version
    for tag_version, pinned_version in ACTION_PINS.items():
        if tag_version in content:
            content = content.replace(tag_version, pinned_version)
            changed = True
            print(f"  ✅ Replaced {tag_version} with {pinned_version}")

    if changed:
        with open(file_path, 'w') as f:
            f.write(content)
        print(f"  💾 Saved changes to {file_path}")
        return True
    else:
        print(f"  ⏭️  No changes needed")
        return False

def main():
    workflows_dir = Path('/Users/alexa/blackroad-sandbox/.github/workflows')

    if not workflows_dir.exists():
        print(f"❌ Workflows directory not found: {workflows_dir}")
        return

    print("🔍 Scanning GitHub Actions workflows...\n")

    workflow_files = list(workflows_dir.glob('*.yml')) + list(workflows_dir.glob('*.yaml'))

    print(f"Found {len(workflow_files)} workflow files\n")

    fixed_count = 0

    for workflow_file in workflow_files:
        if fix_workflow_file(workflow_file):
            fixed_count += 1
        print()

    print(f"{'='*60}")
    print(f"✅ Fixed {fixed_count} workflow files")
    print(f"{'='*60}\n")

    if fixed_count > 0:
        print("📝 Next steps:")
        print("   1. Review the changes")
        print("   2. Commit and push: git add .github/workflows/ && git commit -m 'fix: pin GitHub Actions to commit SHAs'")
        print("   3. The workflows will now pass security checks")

if __name__ == '__main__':
    main()
