#!/usr/bin/env bash
# Run every check this repository has, the same way CI does.
#
#   bash scripts/validate-all.sh
set -euo pipefail
cd "$(dirname "$0")/.."

echo "== JSON syntax"
for f in .claude-plugin/marketplace.json .claude/settings.json plugins/*/.claude-plugin/plugin.json plugins/*/hooks/hooks.json plugins/*/.mcp.json plugins/*/.lsp.json; do
  [ -f "$f" ] || continue
  node -e "JSON.parse(require('fs').readFileSync('$f','utf8'))" && echo "  ok  $f"
done

echo "== Node hook and MCP scripts (syntax)"
for f in plugins/*/hooks/*.js plugins/*/mcp/*.js; do
  node --check "$f" && echo "  ok  $f"
done

echo "== Shell hook scripts (syntax)"
for f in plugins/*/hooks/*.sh plugins/*/scripts/*.sh; do
  bash -n "$f" && echo "  ok  $f"
done

echo "== House rules"
python3 scripts/check-marketplace.py 2>/dev/null || python scripts/check-marketplace.py

echo "== Hook smoke tests"
node scripts/test-hooks.js

echo "== Bundled MCP server smoke test"
node plugins/nordlys-brand/mcp/smoke-test.js

echo "== claude plugin validate"
claude plugin validate .
for p in plugins/*/; do
  claude plugin validate "$p"
done

echo
echo "All checks passed."
