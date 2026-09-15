#!/usr/bin/env node
/**
 * PreToolUse hook (matcher: Bash): guards dbt commands that target production.
 *
 * - `--target prod` (or `-t prod`, `--target production`) together with
 *   `--full-refresh`, `run-operation`, `clean` or `seed`            -> deny
 * - any other command with a production target                       -> ask
 * - everything else                                                  -> silent
 *
 * Compare with fabric-toolkit/hooks/guard-fab.js, which uses the `if` field
 * in hooks.json to skip non-fab commands before the script even starts. This
 * hook filters inside the script instead; both patterns are valid.
 */
"use strict";

const PROD_TARGET = /(?:^|\s)(?:--target|-t)[\s=]+(prod|production|live)\b/i;
const DANGEROUS = /--full-refresh\b|\brun-operation\b|\bdbt\s+clean\b|\bdbt\s+seed\b/i;

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (d) => (raw += d));
process.stdin.on("end", () => {
  let event = {};
  try {
    event = JSON.parse(raw || "{}");
  } catch {
    return;
  }
  const cmd = String((event.tool_input && event.tool_input.command) || "");
  if (!/\bdbt\b/.test(cmd)) return;
  const prodMatch = PROD_TARGET.exec(cmd);
  if (!prodMatch) return;
  const target = prodMatch[1];

  const dangerous = DANGEROUS.test(cmd);
  const out = {
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: dangerous ? "deny" : "ask",
      permissionDecisionReason: dangerous
        ? `dbt-toolkit guard: this command rebuilds or mutates the "${target}" target (full refresh, run-operation, seed or clean). Production changes go through CI, not through an interactive session.`
        : `dbt-toolkit guard: this dbt command targets "${target}". Confirm before it runs.`,
    },
  };
  process.stdout.write(JSON.stringify(out));
});
