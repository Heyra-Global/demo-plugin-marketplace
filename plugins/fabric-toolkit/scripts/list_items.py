#!/usr/bin/env python3
"""List Microsoft Fabric workspaces or the items in one workspace.

Zero dependencies: standard library only. Auth comes from the Azure CLI
(`az login`) or from a FABRIC_TOKEN environment variable.

Examples:
    python scripts/list_items.py --workspaces
    python scripts/list_items.py --workspace-id 3f2c...  --type Notebook
    python scripts/list_items.py --workspace-id 3f2c...  --json
"""
from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request

API = "https://api.fabric.microsoft.com/v1"


def get_token() -> str:
    token = os.environ.get("FABRIC_TOKEN")
    if token:
        return token
    try:
        out = subprocess.run(
            ["az", "account", "get-access-token", "--resource", "https://api.fabric.microsoft.com",
             "--query", "accessToken", "-o", "tsv"],
            check=True, capture_output=True, text=True,
        )
    except (FileNotFoundError, subprocess.CalledProcessError) as exc:
        sys.exit(f"Could not get a token from the Azure CLI. Run 'az login' first. ({exc})")
    return out.stdout.strip()


def get_all(url: str, token: str) -> list[dict]:
    """Follow Fabric's continuationUri pagination until the list is complete."""
    items: list[dict] = []
    while url:
        req = urllib.request.Request(url, headers={"Authorization": f"Bearer {token}"})
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                body = json.load(resp)
        except urllib.error.HTTPError as exc:
            sys.exit(f"HTTP {exc.code} from {url}: {exc.read().decode(errors='replace')[:300]}")
        items.extend(body.get("value", []))
        url = body.get("continuationUri")
    return items


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--workspaces", action="store_true", help="List workspaces the caller can see")
    group.add_argument("--workspace-id", help="List items in this workspace (GUID)")
    parser.add_argument("--type", help="Filter items by type, for example Notebook, Lakehouse, DataPipeline")
    parser.add_argument("--json", action="store_true", help="Print raw JSON instead of a table")
    args = parser.parse_args()

    token = get_token()
    if args.workspaces:
        rows = get_all(f"{API}/workspaces", token)
        cols = ("id", "displayName", "type")
    else:
        query = f"?{urllib.parse.urlencode({'type': args.type})}" if args.type else ""
        rows = get_all(f"{API}/workspaces/{args.workspace_id}/items{query}", token)
        cols = ("id", "displayName", "type")

    if args.json:
        json.dump(rows, sys.stdout, indent=2)
        print()
        return

    if not rows:
        print("(no results)")
        return
    widths = {c: max(len(c), *(len(str(r.get(c, ""))) for r in rows)) for c in cols}
    print("  ".join(c.ljust(widths[c]) for c in cols))
    print("  ".join("-" * widths[c] for c in cols))
    for r in rows:
        print("  ".join(str(r.get(c, "")).ljust(widths[c]) for c in cols))
    print(f"\n{len(rows)} result(s)")


if __name__ == "__main__":
    main()
