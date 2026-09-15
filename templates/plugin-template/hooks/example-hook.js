#!/usr/bin/env node
/**
 * Example hook. Reads the event JSON on stdin, prints a JSON result on stdout.
 *
 * Print nothing (exit 0) when you have nothing to say. Exit code 2 with a
 * message on stderr blocks the action. For PreToolUse, print
 * { hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "allow" | "deny" | "ask", permissionDecisionReason } }.
 * For most other events, print
 * { hookSpecificOutput: { hookEventName: "<Event>", additionalContext: "..." } }.
 *
 * userConfig values from plugin.json arrive as CLAUDE_PLUGIN_OPTION_<KEY>.
 */
"use strict";
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
  const filePath = (event.tool_input && event.tool_input.file_path) || "";
  if (!filePath.endsWith(".example")) return;
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PostToolUse",
        additionalContext: `my-plugin: ${filePath} was written. (Replace this with a real check.)`,
      },
    })
  );
});
