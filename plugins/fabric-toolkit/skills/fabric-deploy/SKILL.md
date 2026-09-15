---
name: fabric-deploy
description:
  Deploy local notebooks and items to a Microsoft Fabric workspace with the
  fab CLI, plan first, then apply. Runs in the fabric-deployer subagent so the
  long command output stays out of the main conversation. Use when the user
  asks to deploy, push or publish notebooks to Fabric. For CLI details see
  fabric-cli, for code rules see fabric-engineer.
argument-hint: "[--workspace <name>] [--apply]"
disable-model-invocation: true
context: fork
agent: fabric-deployer
---

Deploy the local Fabric items in this project.

Arguments: `$ARGUMENTS`

Rules for this run:

- If no `--workspace` is given, use the workspace from the plugin settings
  (the session context names it; default `nordlys-dev`).
- Without `--apply`, stop after the plan. Print the plan table and the exact
  command to apply it.
- With `--apply`, apply the plan and verify.
- Never touch the production workspace unless the user typed the word
  "production" in the request.

Follow the flow in your system prompt. Report in the format it defines.
