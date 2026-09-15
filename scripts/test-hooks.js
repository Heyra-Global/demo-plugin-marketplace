#!/usr/bin/env node
/**
 * Smoke tests for every hook script in this marketplace.
 *
 * Each case feeds a sample Claude Code hook event on stdin and checks the
 * JSON the hook prints. Hooks are plain programs, so they are testable
 * without Claude. CI runs this; locally:
 *
 *   node scripts/test-hooks.js
 */
"use strict";
const { spawnSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const P = (...p) => path.join(ROOT, "plugins", ...p);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "heyra-demo-hooks-"));
const IS_WIN = process.platform === "win32";

function runHook(cmd, args, input, opts = {}) {
  const r = spawnSync(cmd, args, {
    input: JSON.stringify(input),
    encoding: "utf8",
    cwd: opts.cwd || ROOT,
    env: { ...process.env, ...(opts.env || {}) },
    shell: IS_WIN && cmd === "bash" ? false : false,
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
const dirtyMd = path.join(tmp, "post.md");
fs.writeFileSync(dirtyMd, "We leverage cutting-edge synergies.\n");
const cleanMd = path.join(tmp, "clean.md");
fs.writeFileSync(cleanMd, "We build reliable platforms.\n");
const badNb = path.join(tmp, "bad_notebook.py");
fs.writeFileSync(badNb, 'ws = "3f2c1a9e-1111-2222-3333-444455556666"\ndf.write.format("parquet").mode("append").save(p)\n');
const dbtProj = path.join(tmp, "dbtproj");
fs.mkdirSync(path.join(dbtProj, "models", "staging", "shop"), { recursive: true });
fs.writeFileSync(path.join(dbtProj, "dbt_project.yml"), "name: demo_dw\nprofile: demo\n");
const badModel = path.join(dbtProj, "models", "staging", "shop", "orders_raw.sql");
fs.writeFileSync(badModel, "select * from raw.shop.orders\n");
const goodModel = path.join(dbtProj, "models", "staging", "shop", "stg_shop__orders.sql");
fs.writeFileSync(goodModel, "with s as (select * from {{ source('shop','orders') }}), final as (select order_id from s) select * from final\n");
fs.writeFileSync(path.join(dbtProj, "models", "staging", "shop", "_models.yml"), "version: 2\nmodels:\n  - name: stg_shop__orders\n");
// A throwaway git repository for the git-context hook.
const gitRepo = path.join(tmp, "gitrepo");
fs.mkdirSync(gitRepo);
for (const args of [["init", "-q"], ["config", "user.email", "hooks@example.com"], ["config", "user.name", "hooks"], ["commit", "-q", "--allow-empty", "-m", "init"]]) {
  spawnSync("git", args, { cwd: gitRepo, encoding: "utf8" });
}

const cases = [
  // nordlys-brand
  ["brand session-context adds brand reminder", () => context(node(P("nordlys-brand/hooks/session-context.js"), {})).includes("nordlys-brand")],
  ["brand banned-words flags a dirty file", () => /leverage/.test(context(node(P("nordlys-brand/hooks/banned-words.js"), { tool_input: { file_path: dirtyMd } })))],
  ["brand banned-words is silent on a clean file", () => node(P("nordlys-brand/hooks/banned-words.js"), { tool_input: { file_path: cleanMd } }) === null],
  // fabric-toolkit
  ["fabric guard denies fab rm on prod", () => decision(node(P("fabric-toolkit/hooks/guard-fab.js"), { tool_input: { command: "fab rm /nordlys-prod.Workspace/x.Notebook" } })) === "deny"],
  ["fabric guard asks on fab rm on dev", () => decision(node(P("fabric-toolkit/hooks/guard-fab.js"), { tool_input: { command: "fab rm /nordlys-dev.Workspace/x.Notebook" } })) === "ask"],
  ["fabric guard is silent on fab ls", () => node(P("fabric-toolkit/hooks/guard-fab.js"), { tool_input: { command: "fab ls /nordlys-dev.Workspace" } }) === null],
  ["fabric guard honours userConfig via env", () => decision(node(P("fabric-toolkit/hooks/guard-fab.js"), { tool_input: { command: "fab rm /acme-live.Workspace/x.Notebook" } }, { env: { CLAUDE_PLUGIN_OPTION_PRODUCTION_WORKSPACE: "acme-live" } })) === "deny"],
  ["fabric notebook-lint finds 3 issues", () => /3 issue/.test(context(node(P("fabric-toolkit/hooks/notebook-lint.js"), { tool_input: { file_path: badNb } })))],
  ["fabric session-context names the workspace", () => /sales-dev/.test(context(node(P("fabric-toolkit/hooks/session-context.js"), {}, { env: { CLAUDE_PLUGIN_OPTION_WORKSPACE_NAME: "sales-dev" } })))],
  // dbt-toolkit
  ["dbt guard denies prod full-refresh", () => decision(node(P("dbt-toolkit/hooks/guard-prod.js"), { tool_input: { command: "dbt run --target prod --full-refresh" } })) === "deny"],
  ["dbt guard asks on -t prod", () => decision(node(P("dbt-toolkit/hooks/guard-prod.js"), { tool_input: { command: "dbt test -t prod" } })) === "ask"],
  ["dbt guard is silent on dev", () => node(P("dbt-toolkit/hooks/guard-prod.js"), { tool_input: { command: "dbt build --select +fct_orders" } }) === null],
  ["dbt model-lint flags naming, lineage and select *", () => { const c = context(node(P("dbt-toolkit/hooks/model-lint.js"), { tool_input: { file_path: badModel } })); return /naming/.test(c) && /lineage/.test(c) && /select \*/.test(c); }],
  ["dbt model-lint is silent on a good model", () => node(P("dbt-toolkit/hooks/model-lint.js"), { tool_input: { file_path: goodModel } }) === null],
  ["dbt project-context reports a dbt project", () => /demo_dw/.test(context(node(P("dbt-toolkit/hooks/project-context.js"), { cwd: dbtProj })))],
  ["dbt project-context is silent elsewhere", () => node(P("dbt-toolkit/hooks/project-context.js"), { cwd: tmp }) === null],
  // dev-toolkit
  ["dev guard denies force-push to main", () => decision(bash(P("dev-toolkit/hooks/guard-destructive.sh"), { tool_input: { command: "git push --force origin main" } })) === "deny"],
  ["dev guard asks on rm -rf", () => decision(bash(P("dev-toolkit/hooks/guard-destructive.sh"), { tool_input: { command: "rm -rf build" } })) === "ask"],
  ["dev guard asks on git reset --hard", () => decision(bash(P("dev-toolkit/hooks/guard-destructive.sh"), { tool_input: { command: "git reset --hard HEAD~1" } })) === "ask"],
  ["dev guard is silent on git status", () => bash(P("dev-toolkit/hooks/guard-destructive.sh"), { tool_input: { command: "git status" } }) === null],
  ["dev git-context reports the branch", () => /branch (main|master)/.test(context(bash(P("dev-toolkit/hooks/git-context.sh"), {}, { cwd: gitRepo })))],
  ["dev git-context is silent outside a git repo", () => bash(P("dev-toolkit/hooks/git-context.sh"), {}, { cwd: tmp }) === null],
  ["dev auto-format is silent for an unknown file type", () => node(P("dev-toolkit/hooks/auto-format.js"), { tool_input: { file_path: cleanMd }, cwd: tmp }) === null],
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
