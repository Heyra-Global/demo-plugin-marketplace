#!/usr/bin/env node
/**
 * PostToolUse hook (matcher: Write|Edit): scans the written file for banned
 * marketing words and reports them back to Claude as additional context.
 *
 * It is a warning, not a block. Claude sees the finding and fixes the copy.
 * A PreToolUse hook could block instead; see the guard hooks in dev-toolkit,
 * fabric-toolkit and dbt-toolkit for that pattern.
 *
 * Input (stdin):   { tool_name, tool_input: { file_path, ... }, tool_response, cwd, ... }
 * Output (stdout): { hookSpecificOutput: { hookEventName: "PostToolUse", additionalContext } }
 *                  or nothing when the file is clean.
 */
"use strict";
const fs = require("fs");
const path = require("path");

const CONTENT_EXTENSIONS = new Set([".md", ".mdx", ".txt", ".html", ".htm"]);
const SKIP_SEGMENTS = ["node_modules", ".git", ".claude", "CLAUDE.md", "SKILL.md"];

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (d) => (raw += d));
process.stdin.on("end", () => {
  let event = {};
  try {
    event = JSON.parse(raw || "{}");
  } catch {
    return; // Malformed input: stay silent, never break the tool call.
  }
  const filePath = (event.tool_input && event.tool_input.file_path) || "";
  if (!filePath) return;
  const normalized = filePath.replace(/\\/g, "/");
  if (!CONTENT_EXTENSIONS.has(path.extname(normalized).toLowerCase())) return;
  if (SKIP_SEGMENTS.some((s) => normalized.includes(s))) return;

  let text = "";
  try {
    text = fs.readFileSync(filePath, "utf8");
  } catch {
    return;
  }

  let rules = { banned: [], replacements: {} };
  try {
    rules = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "assets", "banned-words.json"), "utf8"));
  } catch {
    return;
  }

  const hits = [];
  for (const word of rules.banned) {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
    const re = new RegExp(`(^|[^\\w-])(${escaped})(?=$|[^\\w-])`, "i");
    const m = re.exec(text);
    if (m) {
      const replacement = rules.replacements[word.toLowerCase()];
      hits.push(replacement ? `"${m[2]}" (use "${replacement}")` : `"${m[2]}"`);
    }
  }
  if (hits.length === 0) return;

  const context =
    `nordlys-brand banned-words hook: ${path.basename(normalized)} contains ${hits.length} banned word(s): ` +
    hits.join(", ") +
    ". Rewrite those passages in plain language before you finish. The full list is in the brand-guidelines skill.";

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: { hookEventName: "PostToolUse", additionalContext: context },
    })
  );
});
