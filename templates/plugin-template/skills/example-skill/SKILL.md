---
name: example-skill
description:
  What this skill does, in one sentence. Then the trigger - Use when the user
  asks for X, mentions Y, or works on Z files. In a multi-skill plugin, end
  with routing to siblings - for A see other-skill. Never put a colon followed
  by a space inside this text; YAML would read it as a key.
argument-hint: "[what the user may pass]"
---

# Example skill

Everything below the frontmatter is the instruction Claude follows. Write it
for a capable colleague: short steps, hard rules, an output format.

User input: `$ARGUMENTS`

## Optional frontmatter you may add

| Field                        | Effect                                                            |
| ---------------------------- | ----------------------------------------------------------------- |
| `disable-model-invocation: true` | Only the user can start it (a "command")                      |
| `user-invocable: false`      | Only Claude can start it (a pure reference skill)                 |
| `paths: ["src/**"]`          | Loads automatically when Claude touches matching files            |
| `arguments: [a, b]`          | Named arguments available as `$a` and `$b`                        |
| `allowed-tools: Bash(git status:*)` | Pre-approve tools for this skill's turn                    |
| `context: fork` + `agent: name` | Run in a subagent defined in `agents/name.md`                  |
| `model: haiku`               | Run on a cheaper model                                            |

## Dynamic context

Inline commands run when the skill loads and their output replaces the
placeholder: current branch: !`git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "not a git repo"`

## Bundled files

Reference files next to this SKILL.md with relative links, for example
[`references/details.md`](references/details.md), and tell Claude when to
read them. `${CLAUDE_SKILL_DIR}` resolves to this directory.

## Steps

1. ...
2. ...

## Output

State the exact shape of the answer.
