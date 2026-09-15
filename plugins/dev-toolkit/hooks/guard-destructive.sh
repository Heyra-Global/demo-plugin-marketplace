#!/usr/bin/env bash
# PreToolUse hook (matcher: Bash), written in shell to show that hook scripts
# can be any executable. It reads the tool call as JSON on stdin and prints a
# permission decision as JSON on stdout.
#
#   force-push to main/master/production  -> deny
#   rm -rf, git reset --hard, git clean -f,
#   git checkout -- ., git branch -D      -> ask (permission prompt with reason)
#   anything else                          -> silent (normal permission flow)
#
# Uses jq when available and a sed fallback otherwise, so it also runs on a
# machine that has only Git Bash.
set -u

INPUT="$(cat)"
if command -v jq >/dev/null 2>&1; then
  CMD="$(printf '%s' "$INPUT" | jq -r '.tool_input.command // empty')"
else
  CMD="$(printf '%s' "$INPUT" | sed -n 's/.*"command"[[:space:]]*:[[:space:]]*"\(\([^"\\]\|\\.\)*\)".*/\1/p' | head -1)"
fi
[ -z "$CMD" ] && exit 0

emit() {
  # $1 = decision, $2 = reason (must not contain double quotes)
  printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"%s","permissionDecisionReason":"%s"}}' "$1" "$2"
  exit 0
}

# 1. Force-push to a protected branch: deny.
if printf '%s' "$CMD" | grep -Eq 'git[[:space:]]+push' \
  && printf '%s' "$CMD" | grep -Eq -- '(--force|--force-with-lease|(^|[[:space:]])-f([[:space:]]|$))' \
  && printf '%s' "$CMD" | grep -Eq '(^|[[:space:]:/])(main|master|production)([[:space:]]|$)'; then
  emit deny "dev-toolkit guard: force-push to a protected branch is not allowed from a Claude session. Open a pull request instead."
fi

# 2. Destructive local operations: ask.
if printf '%s' "$CMD" | grep -Eq '(^|[[:space:]|;&])rm[[:space:]]+-[a-zA-Z]*r'; then
  emit ask "dev-toolkit guard: recursive delete. Confirm the path before it runs."
fi
if printf '%s' "$CMD" | grep -Eq 'git[[:space:]]+(reset[[:space:]]+--hard|clean[[:space:]]+-[a-zA-Z]*f|checkout[[:space:]]+--[[:space:]]+\.|branch[[:space:]]+-D)'; then
  emit ask "dev-toolkit guard: this git command discards work. Confirm before it runs."
fi

exit 0
