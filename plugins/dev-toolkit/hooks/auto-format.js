#!/usr/bin/env node
/**
 * PostToolUse hook (matcher: Edit|Write): formats the file Claude just wrote
 * with the project's own formatter, when one is configured.
 *
 *   *.py                       -> ruff format   (if ruff is on PATH)
 *   *.js *.ts *.jsx *.tsx *.json *.css *.md
 *                              -> prettier      (if the project has a prettier config
 *                                                and prettier is installed locally)
 *
 * Best effort and silent on failure: a formatter problem must never break a
 * tool call. When a file was reformatted, Claude is told so it re-reads it
 * before the next edit.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const IS_WIN = process.platform === "win32";
const PRETTIER_EXT = new Set([".js", ".ts", ".jsx", ".tsx", ".json", ".css", ".md"]);

function run(cmd, args, cwd) {
  const r = spawnSync(cmd, args, { cwd, encoding: "utf8", shell: IS_WIN, timeout: 20000 });
  return r.status === 0;
}
function hasPrettierConfig(cwd) {
  const names = [".prettierrc", ".prettierrc.json", ".prettierrc.js", ".prettierrc.cjs", ".prettierrc.yaml", ".prettierrc.yml", "prettier.config.js", "prettier.config.cjs"];
  if (names.some((n) => fs.existsSync(path.join(cwd, n)))) return true;
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(cwd, "package.json"), "utf8"));
    return Boolean(pkg.prettier);
  } catch {
    return false;
  }
}

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
  if (!filePath || !fs.existsSync(filePath)) return;
  const cwd = event.cwd || process.cwd();
  const ext = path.extname(filePath).toLowerCase();
  let tool = null;

  if (ext === ".py" && run("ruff", ["--version"], cwd)) {
    if (run("ruff", ["format", "--quiet", filePath], cwd)) tool = "ruff format";
  } else if (PRETTIER_EXT.has(ext) && hasPrettierConfig(cwd)) {
    if (run("npx", ["--no-install", "prettier", "--log-level", "silent", "--write", filePath], cwd)) tool = "prettier";
  }
  if (!tool) return;

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PostToolUse",
        additionalContext: `dev-toolkit auto-format: ${path.basename(filePath)} was reformatted with ${tool}. Re-read it before the next edit.`,
      },
    })
  );
});
