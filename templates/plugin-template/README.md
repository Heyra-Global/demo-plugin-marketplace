# my-plugin

One paragraph: what this plugin does and who installs it.

## What is in it

| Component | Where                          | What it does |
| --------- | ------------------------------ | ------------ |
| Skill     | `skills/example-skill/`        |              |
| Subagent  | `agents/example-agent.md`      |              |
| Hook      | `hooks/hooks.json`             |              |
| MCP       | `.mcp.json`                    |              |

Delete the rows (and the files) you do not need. A plugin with one skill and
nothing else is a perfectly good plugin.

## Try it

```text
/plugin install my-plugin@heyra-demo
/my-plugin:example-skill
```

## Prerequisites

List binaries the user must install (Node, Python, a CLI). The plugin must
degrade gracefully when they are missing.
