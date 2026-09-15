#!/usr/bin/env node
/**
 * PreToolUse hook (matcher: Bash, if: "Bash(fab *)"): guards destructive
 * Fabric CLI commands.
 *
 * - Destructive command that names the production workspace  -> deny
 * - Any other destructive command                             -> ask (permission prompt)
 * - Everything else                                            -> no output (normal flow)
 *
 * The production workspace name comes from the plugin's userConfig
 * (`production_workspace` in plugin.json). Claude Code exports userConfig
 * values to hook scripts as CLAUDE_PLUGIN_OPTION_<KEY>.
 *
 * Input (stdin):   { tool_name: "Bash", tool_input: { command }, ... }
 * Output (stdout): { hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision, permissionDecisionReason } }
 */
"use strict";

const PROD = (process.env.CLAUDE_PLUGIN_OPTION_PRODUCTION_WORKSPACE || "nordlys-prod").trim();
const DESTRUCTIVE = /\bfab\s+(rm|del|delete|unassign|reset|clear)\b|\bfab\b[^\n]*\s(-f|--force)\b/i;

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
  if (!/\bfab\b/.test(cmd)) return;

  const destructive = DESTRUCTIVE.test(cmd);
  const touchesProd = PROD && cmd.toLowerCase().includes(PROD.toLowerCase());

  let decision = null;
  let reason = "";
  if (destructive && touchesProd) {
    decision = "deny";
    reason = `fabric-toolkit guard: destructive fab command targets the production workspace "${PROD}". Run it by hand from a terminal, or change production_workspace in the plugin settings if this is intended.`;
  } else if (destructive) {
    decision = "ask";
    reason = "fabric-toolkit guard: this fab command deletes or force-overwrites Fabric items. Confirm before it runs.";
  } else if (touchesProd) {
    decision = "ask";
    reason = `fabric-toolkit guard: this command touches the production workspace "${PROD}". Confirm before it runs.`;
  }
  if (!decision) return;

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: decision,
        permissionDecisionReason: reason,
      },
    })
  );
});
