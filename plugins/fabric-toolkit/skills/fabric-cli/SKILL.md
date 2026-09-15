---
name: fabric-cli
description:
  Reference for the Microsoft Fabric CLI (fab) - authentication, navigating
  workspaces like a file system, importing and exporting notebooks, running
  jobs and inspecting tables from the terminal. Use when the user wants to
  script against Fabric, asks for a fab command, or when a task is faster from
  the terminal than from the portal. For notebook code see fabric-engineer, for
  design see fabric-architect, and for a guided deployment see fabric-deploy.
---

# Fabric CLI (fab)

## Live environment

The lines below are filled in by the skill at load time (dynamic context via
`` !`command` ``). If the CLI is missing, the first line says so.

- fab version: !`fab --version 2>/dev/null || echo "fab not installed - run: pip install ms-fabric-cli"`
- auth: !`fab auth status 2>/dev/null | head -3 || echo "not logged in - run: fab auth login"`

## Mental model

`fab` treats Fabric as a file system. Workspaces are directories, items are
files with a type suffix:

```
/sales-dev.Workspace/
  lh_bronze.Lakehouse/
  bronze_erp_orders.Notebook
  load_orders.DataPipeline
```

## Commands you use every day

| Task                         | Command                                                                 |
| ---------------------------- | ----------------------------------------------------------------------- |
| Log in                       | `fab auth login`                                                        |
| List workspaces              | `fab ls`                                                                |
| List items in a workspace    | `fab ls /sales-dev.Workspace`                                           |
| Show item details            | `fab get /sales-dev.Workspace/bronze_erp_orders.Notebook`               |
| Export a notebook            | `fab export /sales-dev.Workspace/bronze_erp_orders.Notebook -o ./notebooks` |
| Import (create or update)    | `fab import /sales-dev.Workspace/bronze_erp_orders.Notebook -i ./notebooks/bronze_erp_orders.ipynb -f` |
| Run a notebook or pipeline   | `fab job run /sales-dev.Workspace/load_orders.DataPipeline`             |
| Inspect a table schema       | `fab table schema /sales-dev.Workspace/lh_bronze.Lakehouse/Tables/orders` |
| Delete an item               | `fab rm /sales-dev.Workspace/old.Notebook` (the plugin's guard hook asks first) |

Flags change between CLI versions. Check `fab <command> --help` before you
rely on a flag in a script.

## Scripting rules

- Always pass `-f` (force) explicitly in scripts; never rely on prompts.
- Prefer JSON output (`--output json` where supported) and parse it; do not
  scrape tables.
- Wrap every `fab` call in a check of the exit code.
- The plugin's `guard-fab` hook denies destructive commands that name the
  production workspace and asks for confirmation on all other destructive
  commands. Do not try to work around it; run those by hand.

## REST API fallback

When `fab` lacks a feature, use the REST API with the bundled script:

```bash
python scripts/list_items.py --workspaces
python scripts/list_items.py --workspace-id <guid> --type Notebook
```

(`scripts/` is the plugin's scripts directory; the script needs `az login`.)
