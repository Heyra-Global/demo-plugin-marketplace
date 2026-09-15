#!/usr/bin/env node
/**
 * SessionStart hook: if the current project is a dbt project, tell Claude its
 * name, profile and model count. If it is not, stay silent.
 *
 * This is the conditional-context pattern: a plugin can be installed at user
 * scope and still add nothing to sessions where it is irrelevant.
 */
"use strict";
const fs = require("fs");
const path = require("path");

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (d) => (raw += d));
process.stdin.on("end", () => {
  let event = {};
  try {
    event = JSON.parse(raw || "{}");
  } catch {
    event = {};
  }
  const cwd = event.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const projectFile = path.join(cwd, "dbt_project.yml");
  if (!fs.existsSync(projectFile)) return;

  const yml = fs.readFileSync(projectFile, "utf8");
  const pick = (key) => {
    const m = new RegExp(`^${key}:\\s*['"]?([^'"\\n]+)['"]?\\s*$`, "m").exec(yml);
    return m ? m[1].trim() : "unknown";
  };
  const name = pick("name");
  const profile = pick("profile");

  let models = 0;
  const walk = (dir) => {
    let entries = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith(".sql")) models += 1;
    }
  };
  walk(path.join(cwd, "models"));

  const context =
    `dbt-toolkit plugin is active and this is a dbt project: name "${name}", profile "${profile}", ${models} model file(s) under models/. ` +
    "Conventions load automatically when you touch models/**. Skills: /dbt-toolkit:dbt-new-model, /dbt-toolkit:dbt-test-coverage, /dbt-toolkit:dbt-build-fix. " +
    "Commands against a production target are guarded by a hook. The dbt MCP server (uvx dbt-mcp) exposes dbt CLI tools.";
  process.stdout.write(
    JSON.stringify({ hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: context } })
  );
});
