#!/usr/bin/env node
/**
 * SessionStart hook: tells Claude which Fabric workspaces this project uses.
 *
 * Reads the plugin's userConfig values, which Claude Code exports as
 * CLAUDE_PLUGIN_OPTION_<KEY> environment variables, and falls back to the
 * defaults declared in plugin.json.
 */
"use strict";

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (d) => (raw += d));
process.stdin.on("end", () => {
  const workspace = process.env.CLAUDE_PLUGIN_OPTION_WORKSPACE_NAME || "nordlys-dev";
  const prod = process.env.CLAUDE_PLUGIN_OPTION_PRODUCTION_WORKSPACE || "nordlys-prod";
  const context =
    `fabric-toolkit plugin is active. Target Fabric workspace: "${workspace}". Production workspace: "${prod}" ` +
    "(destructive fab commands against it are blocked by a hook). " +
    "Skills: fabric-architect (design), fabric-engineer (notebooks, loads on notebook files), fabric-cli (fab commands), " +
    "/fabric-toolkit:fabric-deploy (deploy via subagent). " +
    "The fabric-core MCP server needs 'az login' with Fabric access.";
  process.stdout.write(
    JSON.stringify({ hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: context } })
  );
});
