#!/usr/bin/env bash
# SessionStart hook (matcher: startup|resume): puts the git state of the
# project into Claude's context at the start of a session. Silent outside a
# git repository.
set -u
cat >/dev/null # consume the event JSON; this hook does not need it

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || exit 0

BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo unknown)"
LAST="$(git log -1 --pretty='%h %s' 2>/dev/null | tr -d '"\\' | cut -c1-80)"
DIRTY="$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')"
AHEAD="$(git rev-list --count '@{upstream}..HEAD' 2>/dev/null || echo 'n/a')"

CTX="dev-toolkit: branch ${BRANCH}, ${DIRTY} uncommitted change(s), ${AHEAD} commit(s) ahead of upstream. Last commit: ${LAST}. Skills: /dev-toolkit:commit, /dev-toolkit:pr-description, /dev-toolkit:review-changes, /dev-toolkit:doctor, /dev-toolkit:setup. A Stop hook asks you to run tests after code changes."

printf '{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"%s"}}' "$CTX"
