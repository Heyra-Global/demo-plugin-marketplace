#!/usr/bin/env node
/**
 * PostToolUse hook (matcher: Write|Edit): lints dbt model files as they are
 * written and reports findings back to Claude as additionalContext.
 *
 * Checks (all from the dbt-conventions skill):
 *   - naming by layer: staging -> stg_, intermediate -> int_, marts -> fct_/dim_
 *   - hardcoded relations: no {{ ref() }} or {{ source() }} anywhere
 *   - `select *` in the final select
 *   - no matching entry in a schema .yml next to the model (so no tests)
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
    return;
  }
  const filePath = String((event.tool_input && event.tool_input.file_path) || "").replace(/\\/g, "/");
  if (!filePath.endsWith(".sql") || !/\/models\//.test(filePath)) return;

  let sql = "";
  try {
    sql = fs.readFileSync(filePath, "utf8");
  } catch {
    return;
  }
  const modelName = path.basename(filePath, ".sql");
  const findings = [];

  // Layer naming
  if (/\/models\/staging\//.test(filePath) && !/^stg_/.test(modelName)) {
    findings.push(`naming: staging models start with stg_ (got ${modelName})`);
  } else if (/\/models\/intermediate\//.test(filePath) && !/^int_/.test(modelName)) {
    findings.push(`naming: intermediate models start with int_ (got ${modelName})`);
  } else if (/\/models\/marts\//.test(filePath) && !/^(fct|dim|agg)_/.test(modelName)) {
    findings.push(`naming: mart models start with fct_, dim_ or agg_ (got ${modelName})`);
  }

  // Hardcoded relations
  if (!/\{\{\s*(ref|source)\s*\(/.test(sql)) {
    findings.push("lineage: no {{ ref() }} or {{ source() }} found; hardcoded table names break lineage and environments");
  }

  // select * in the final select is fine only when it reads a CTE defined in
  // this file (the house shape ends with `select * from final`).
  const cteNames = new Set();
  for (const m of sql.matchAll(/(?:^|[\s,(])([a-z_][\w]*)\s+as\s*\(/gi)) cteNames.add(m[1].toLowerCase());
  const lastSelect = sql.toLowerCase().lastIndexOf("select");
  const finalSelect = lastSelect >= 0 ? sql.slice(lastSelect) : "";
  const star = /^\s*select\s+\*\s+from\s+([\w.]+)/i.exec(finalSelect);
  if (star && !cteNames.has(star[1].toLowerCase())) {
    findings.push("columns: the final select uses select * on a table; list the columns explicitly so contracts and docs stay stable");
  }

  // Schema yml entry
  const dir = path.dirname(filePath);
  let documented = false;
  try {
    for (const f of fs.readdirSync(dir)) {
      if (!/\.ya?ml$/.test(f)) continue;
      const yml = fs.readFileSync(path.join(dir, f), "utf8");
      if (new RegExp(`^\\s*-\\s*name:\\s*${modelName}\\s*$`, "m").test(yml)) {
        documented = true;
        break;
      }
    }
  } catch {
    // unreadable dir: skip this check
  }
  if (!documented) {
    findings.push(`tests: no schema .yml entry for ${modelName} in ${path.basename(dir)}/; add one with unique and not_null tests on the key`);
  }

  if (findings.length === 0) return;
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PostToolUse",
        additionalContext:
          `dbt-toolkit model-lint found ${findings.length} issue(s) in ${modelName}.sql:\n- ` +
          findings.join("\n- ") +
          "\nFix them before you move on. Rules: dbt-conventions skill.",
      },
    })
  );
});
