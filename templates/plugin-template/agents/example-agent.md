---
name: example-agent
description:
  What this subagent does and when Claude should delegate to it. Claude
  reads this description to decide; make the trigger explicit ("Use after
  X" or "Use when the user asks for Y"). Subagents run in Cowork and Claude
  Code, not in Claude Chat.
tools: Read, Glob, Grep
model: sonnet
color: blue
maxTurns: 15
skills:
  - example-skill
---

You are ... (the system prompt of the subagent).

Say what the agent must do, in what order, and the exact format of the
result it returns. Subagents have their own context window: give them
everything they need here, or preload a skill with `skills:` in the
frontmatter.

Plugin-shipped agents do not support `hooks`, `mcpServers` or
`permissionMode`.
