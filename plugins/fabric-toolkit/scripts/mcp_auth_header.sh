#!/usr/bin/env bash
# headersHelper for the fabric-core MCP server (see ../.mcp.json).
#
# Claude Code runs this script every time it connects to the MCP server and
# expects a JSON object of HTTP headers on stdout. We mint a fresh Azure CLI
# bearer token scoped to the Fabric REST API, so no token is ever stored in a
# config file. Prerequisite: `az login` with an account that can use Fabric.
set -euo pipefail

if ! command -v az >/dev/null 2>&1; then
  echo "fabric-toolkit: Azure CLI (az) not found. Install it and run 'az login'." >&2
  exit 1
fi

TOKEN=$(az account get-access-token \
  --resource https://api.fabric.microsoft.com \
  --query accessToken -o tsv)

printf '{"Authorization":"Bearer %s"}' "$TOKEN"
