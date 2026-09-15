---
name: fabric-architect
description:
  Architecture decisions for Microsoft Fabric - workspace topology (dev, test,
  prod), lakehouse layout per medallion layer, capacity sizing, naming
  conventions and when to pick Lakehouse versus Warehouse versus Eventhouse.
  Use when designing a new Fabric platform, reviewing a proposed layout, or
  answering "where should this live" questions. For notebook code see
  fabric-engineer, for the fab CLI see fabric-cli, and for deployment see
  fabric-deploy.
---

# Fabric architecture

## Decision table

| Question                              | Default answer                                                         |
| ------------------------------------- | ---------------------------------------------------------------------- |
| How many workspaces?                  | Three per solution: `<sol>-dev`, `<sol>-test`, `<sol>-prod`             |
| How many lakehouses?                  | One per medallion layer: `lh_bronze`, `lh_silver`, `lh_gold`            |
| Lakehouse or Warehouse for gold?      | Lakehouse with Delta tables. Warehouse only when T-SQL writers are required |
| Where do notebooks live?              | In the workspace that owns the target table, in a `notebooks/` folder   |
| Streaming?                            | Eventstream into Eventhouse (KQL) for sub-minute; otherwise batch       |
| Capacity for a first project?         | F8 for dev and test, F16+ for prod. Enable the Native Execution Engine   |
| Git integration?                      | Yes, dev workspace only. Test and prod are deployed, never edited       |

## Naming conventions

- Workspaces: `<solution>-<env>` in lowercase, for example `sales-prod`.
- Lakehouses: `lh_<layer>`; Warehouses: `wh_<domain>`; Eventhouses: `eh_<stream>`.
- Notebooks: `<layer>_<source>_<entity>`, for example `bronze_erp_orders`.
- Tables: bronze keeps the source name; silver uses `<entity>`; gold uses
  `fct_<event>` and `dim_<entity>`.

## Medallion layers in Fabric

Read [`references/medallion.md`](references/medallion.md) for the layer
contracts (what may enter each layer, what each layer promises) before you
design a new pipeline. The short version:

1. **Bronze**: raw, append-only, one table per source object, with load
   metadata columns. Never cleaned.
2. **Silver**: typed, deduplicated, conformed keys, one row per business
   entity version. MERGE by natural key.
3. **Gold**: business aggregates and star schemas. Rebuilt or merged from
   silver only. Nothing reads bronze from gold.

## Workspace topology

```
sales-dev    (Git-connected)   notebooks, lh_bronze, lh_silver, lh_gold
sales-test   (deployed)        same items, test capacity
sales-prod   (deployed)        same items, prod capacity, no direct edits
```

Deployment pipelines or `fabric-cicd` move items dev -> test -> prod. Item
ids differ per workspace, which is why every notebook takes workspace and
lakehouse ids as parameters (see fabric-engineer).

## Anti-patterns

- One giant workspace for everything. Permissions and capacity become
  impossible to reason about.
- Bronze tables that are already "a bit cleaned". Then nobody can replay.
- Gold reading from bronze "just this once".
- Notebooks with hardcoded GUIDs. They break the moment they are deployed.
