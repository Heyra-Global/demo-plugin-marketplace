#!/usr/bin/env node
/**
 * SessionStart hook: adds a short brand reminder to Claude's context.
 *
 * Demonstrates the `additionalContext` output of a hook. Keep it short: every
 * character here is paid for in every session where the plugin is enabled.
 *
 * Input (stdin):  { session_id, cwd, hook_event_name: "SessionStart", source: "startup" | "resume" | ... }
 * Output (stdout): { hookSpecificOutput: { hookEventName, additionalContext } }
 */
"use strict";
const fs = require("fs");
const path = require("path");

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (d) => (raw += d));
process.stdin.on("end", () => {
  let palette = { colors: [] };
  try {
    palette = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "assets", "palette.json"), "utf8"));
  } catch {
    // Missing palette is not fatal. The hook just says less.
  }
  const accent = palette.colors.find((c) => c.name === "Aurora Green");
  const dark = palette.colors.find((c) => c.name === "Polar Night");
  const lines = [
    "nordlys-brand plugin is active (brand: Nordlys Analytics, a fictional demo company).",
    accent && dark ? `Palette: accent ${accent.name} ${accent.hex}, primary dark ${dark.name} ${dark.hex}.` : "",
    "Before you write marketing copy, load the brand-guidelines skill. Use /nordlys-brand:linkedin-post, /nordlys-brand:campaign-brief and /nordlys-brand:brand-check for common tasks.",
    "The brand-assets MCP server offers get_palette, check_contrast and get_banned_words.",
  ].filter(Boolean);

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "SessionStart",
        additionalContext: lines.join(" "),
      },
    })
  );
});
