#!/usr/bin/env node
/**
 * Smoke tests for the hook scripts in this marketplace (only heyra-dev ships hooks).
 *
 * Each case feeds a sample Claude Code hook event on stdin and checks the JSON
 * the hook prints. Hooks are plain programs, so they are testable without
 * Claude. CI runs this; locally:
 *
 *   node scripts/test-hooks.js
 */
"use strict";
const { spawnSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const H = (...p) => path.join(ROOT, "plugins", "heyra-dev", "hooks", ...p);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "heyra-demo-hooks-"));

function runHook(cmd, args, input, opts = {}) {
  const r = spawnSync(cmd, args, {
    input: JSON.stringify(input),
    encoding: "utf8",
    cwd: opts.cwd || ROOT,
    env: { ...process.env, ...(opts.env || {}) },
  });
  if (r.error) throw r.error;
  if (r.status !== 0) throw new Error(`${path.basename(args[0] || cmd)} exited ${r.status}: ${r.stderr}`);
  const out = r.stdout.trim();
  return out ? JSON.parse(out) : null;
}
const node = (script, input, opts) => runHook(process.execPath, [script], input, opts);
const bash = (script, input, opts) => runHook("bash", [script], input, opts);
const decision = (o) => (o && o.hookSpecificOutput && o.hookSpecificOutput.permissionDecision) || null;
const context = (o) => (o && o.hookSpecificOutput && o.hookSpecificOutput.additionalContext) || "";

// Fixtures
const textFile = path.join(tmp, "notes.txt");
fs.writeFileSync(textFile, "plain text\n");
const gitRepo = path.join(tmp, "gitrepo");
fs.mkdirSync(gitRepo);
for (const args of [["init", "-q"], ["config", "user.email", "hooks@example.com"], ["config", "user.name", "hooks"], ["commit", "-q", "--allow-empty", "-m", "init"]]) {
  spawnSync("git", args, { cwd: gitRepo, encoding: "utf8" });
}

const cases = [
  ["guard denies force-push to main", () => decision(bash(H("guard-destructive.sh"), { tool_input: { command: "git push --force origin main" } })) === "deny"],
  ["guard denies -f push to master", () => decision(bash(H("guard-destructive.sh"), { tool_input: { command: "git push -f origin master" } })) === "deny"],
  ["guard asks on rm -rf", () => decision(bash(H("guard-destructive.sh"), { tool_input: { command: "rm -rf build" } })) === "ask"],
  ["guard asks on git reset --hard", () => decision(bash(H("guard-destructive.sh"), { tool_input: { command: "git reset --hard HEAD~1" } })) === "ask"],
  ["guard is silent on git status", () => bash(H("guard-destructive.sh"), { tool_input: { command: "git status" } }) === null],
  ["guard is silent on a feature-branch push", () => bash(H("guard-destructive.sh"), { tool_input: { command: "git push origin feature/x" } }) === null],
  ["git-context reports the branch", () => /branch (main|master)/.test(context(bash(H("git-context.sh"), {}, { cwd: gitRepo })))],
  ["git-context is silent outside a git repo", () => bash(H("git-context.sh"), {}, { cwd: tmp }) === null],
  ["auto-format is silent for an unknown file type", () => node(H("auto-format.js"), { tool_input: { file_path: textFile }, cwd: tmp }) === null],
  ["auto-format is silent for a missing file", () => node(H("auto-format.js"), { tool_input: { file_path: path.join(tmp, "nope.py") }, cwd: tmp }) === null],
];

let failed = 0;
for (const [name, fn] of cases) {
  let ok = false;
  let detail = "";
  try {
    ok = Boolean(fn());
  } catch (e) {
    detail = ` (${e.message.split("\n")[0]})`;
  }
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail}`);
  if (!ok) failed += 1;
}
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`\n${cases.length - failed}/${cases.length} hook checks passed`);
process.exit(failed ? 1 : 0);
