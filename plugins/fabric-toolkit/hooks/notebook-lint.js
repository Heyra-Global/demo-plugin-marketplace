#!/usr/bin/env node
/**
 * PostToolUse hook (matcher: Write|Edit): lints Fabric notebooks and PySpark
 * files for the mistakes the fabric-engineer skill forbids.
 *
 * Checks: hardcoded GUIDs, embedded secrets, blind appends, Parquet writes
 * to Tables. Findings go back to Claude as additionalContext. Nothing is
 * blocked; Claude fixes the file in its next turn.
 */
"use strict";
const fs = require("fs");
const path = require("path");

const CODE_EXTENSIONS = new Set([".py", ".ipynb"]);
const CHECKS = [
  {
    id: "hardcoded-guid",
    re: /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i,
    msg: "hardcoded GUID (workspace or lakehouse id). Pass ids as notebook parameters instead.",
  },
  {
    id: "secret",
    re: /(AccountKey=|SharedAccessSignature|[?&]sig=|client_secret\s*[:=]\s*["'][^"']{6,}|password\s*[:=]\s*["'][^"']{4,})/i,
    msg: "embedded secret or SAS token. Use a Key Vault reference or notebookutils.credentials.",
  },
  {
    id: "blind-append",
    re: /\.mode\(\s*["']append["']\s*\)/,
    msg: "append write. Use MERGE (or overwrite) so the notebook is idempotent when re-run.",
  },
  {
    id: "parquet-table",
    re: /\.format\(\s*["']parquet["']\s*\)/,
    msg: "Parquet write. Fabric Tables must be Delta: use .format(\"delta\").",
  },
];

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
  if (!filePath || !CODE_EXTENSIONS.has(path.extname(filePath).toLowerCase())) return;
  if (filePath.replace(/\\/g, "/").includes("/hooks/")) return; // never lint ourselves

  let text = "";
  try {
    text = fs.readFileSync(filePath, "utf8");
  } catch {
    return;
  }
  const findings = CHECKS.filter((c) => c.re.test(text)).map((c) => `${c.id}: ${c.msg}`);
  if (findings.length === 0) return;

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PostToolUse",
        additionalContext:
          `fabric-toolkit notebook-lint found ${findings.length} issue(s) in ${path.basename(filePath)}:\n- ` +
          findings.join("\n- ") +
          "\nFix them now. The rules are in the fabric-engineer skill.",
      },
    })
  );
});
