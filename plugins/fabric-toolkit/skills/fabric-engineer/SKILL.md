---
name: fabric-engineer
description:
  Data engineering in Microsoft Fabric with PySpark notebooks and Delta Lake -
  bronze ingestion, silver MERGE transformations, gold aggregations,
  parameterisation, idempotent writes and the Native Execution Engine. Loads
  automatically when you work on notebook files. Use when writing or changing
  a Fabric notebook or pipeline code. For architecture decisions see
  fabric-architect, for fab CLI commands see fabric-cli, and to push notebooks
  to a workspace see fabric-deploy.
paths:
  - "**/*.ipynb"
  - "**/notebooks/**"
---

# Fabric notebook engineering

This skill uses the `paths` frontmatter field: Claude loads it automatically
whenever it reads or edits a notebook file, without anyone asking.

## Core principles

1. **One notebook produces one table.** Lineage stays readable, failures stay
   isolated.
2. **Parameterise everything.** Workspace id, lakehouse id, table name, load
   type and watermark column are notebook parameters. No GUID literals. The
   plugin's `notebook-lint` hook reports any GUID it finds.
3. **Delta everywhere.** Tables are Delta. Parquet files never go into
   `Tables/`.
4. **Idempotent writes.** Incremental loads use `MERGE`. Full loads use
   `overwrite`. Plain `append` is only allowed in bronze with a batch id.
5. **ABFSS paths for cross-lakehouse access.** Do not rely on a default
   lakehouse when a notebook is run headless.
6. **Native Execution Engine on.** `spark.conf.set("spark.native.enabled", "true")`
   at the top of every production notebook.
7. **No secrets in code.** Use `notebookutils.credentials.getSecret(...)`.

## Templates

Copy a template into a new notebook and fill the parameter cell. They live
next to this file and are runnable as exported notebooks:

| Layer  | Template                                                                     | Pattern                                    |
| ------ | ---------------------------------------------------------------------------- | ------------------------------------------ |
| Bronze | [`templates/bronze_ingestion.py`](templates/bronze_ingestion.py)             | Read files, add metadata, append by batch  |
| Silver | [`templates/silver_transformation.py`](templates/silver_transformation.py)   | Type, dedupe, MERGE on natural key         |
| Gold   | [`templates/gold_aggregation.py`](templates/gold_aggregation.py)             | Aggregate from silver, overwrite           |

## Parameter cell

Fabric marks the parameter cell with a `# PARAMETERS` comment (in `.py`
exports) or the "toggle parameter cell" option in the UI. Keep it first:

```python
# PARAMETERS
workspace_id = ""
lakehouse_id = ""
target_table = ""
load_type = "incremental"  # or "full"
watermark_column = "updated_utc"
```

## MERGE pattern (silver)

```python
from delta.tables import DeltaTable

target = DeltaTable.forPath(spark, target_path)
(
    target.alias("t")
    .merge(incoming.alias("s"), "t.order_id = s.order_id")
    .whenMatchedUpdateAll(condition="s.updated_utc > t.updated_utc")
    .whenNotMatchedInsertAll()
    .execute()
)
```

## Checklist before you hand a notebook over

- [ ] Parameter cell is first and complete.
- [ ] Writes are MERGE or overwrite.
- [ ] Format is Delta.
- [ ] Native Execution Engine enabled.
- [ ] Watermark read at start, written at end.
- [ ] Run twice in a row: second run changes nothing.

Ask the `notebook-reviewer` subagent for a review when the notebook is done.
