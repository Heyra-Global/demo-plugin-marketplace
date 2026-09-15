#!/usr/bin/env bash
# Run every check this repository has, the same way CI does.
#
#   bash scripts/validate-all.sh
set -euo pipefail
cd "$(dirname "$0")/.."

PY=python3
command -v python3 >/dev/null 2>&1 || PY=python

echo "== JSON syntax"
for f in .claude-plugin/marketplace.json .github/plugin/marketplace.json .claude/settings.json .github/copilot/settings.json plugins/*/.claude-plugin/plugin.json plugins/*/plugin.json plugins/*/hooks/hooks.json plugins/*/.mcp.json plugins/*/mcp.json plugins/*/.lsp.json; do
  [ -f "$f" ] || continue
  node -e "JSON.parse(require('fs').readFileSync('$f','utf8'))" && echo "  ok  $f"
done

echo "== Script syntax"
for f in plugins/*/hooks/*.js scripts/*.js; do node --check "$f" && echo "  ok  $f"; done
for f in plugins/*/hooks/*.sh scripts/*.sh; do bash -n "$f" && echo "  ok  $f"; done
$PY -m py_compile scripts/*.py && echo "  ok  scripts/*.py"

echo "== House rules"
$PY scripts/check-marketplace.py

echo "== Hook smoke tests"
node scripts/test-hooks.js

echo "== Package plugins (dist/)"
$PY scripts/package-plugins.py

echo "== claude plugin validate"
claude plugin validate --strict .
for p in plugins/*/; do
  claude plugin validate --strict "$p"
done

echo
echo "All checks passed."
