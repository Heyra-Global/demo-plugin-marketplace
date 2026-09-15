---
name: example-skill
description:
  What this skill does, in one sentence. Then the trigger - Use when the user
  asks for X, mentions Y, or wants Z. In a multi-skill plugin, end with
  routing to siblings, for A see other-skill. Never put a colon followed by
  a space inside this text; YAML would read it as a key.
argument-hint: "<what the user may pass>"
---

# Example skill

Everything below the frontmatter is the instruction Claude follows. Write
it for a capable colleague: short steps, hard rules, an output format.
Answer in the language the user writes in.

Input: `$ARGUMENTS`

## Steps

1. Load `<reference-skill>` if it is not in context (house rules live in a
   reference skill that Claude loads on its own).
2. Get the facts. With ~~email or ~~files connected, read them; otherwise
   ask the user to paste. Ask at most one question.
3. Do the work with the template in [`templates/output.md`](templates/output.md).
4. Deliver in this shape:

```markdown
## <Result>
<the deliverable, ready to use>

## Notes
- facts used and their sources
- next step
```

## Rules

- What the skill never does (send, delete, invent numbers).
- Data rules (no personal data in outputs).

## Frontmatter notes

- Business plugins: do **not** set `disable-model-invocation: true`. Claude
  Chat has no slash commands; a user-only skill cannot be used there. In
  Cowork the skill still appears as a slash command.
- Developer plugins may use `disable-model-invocation`, `allowed-tools`,
  `context: fork` with `agent:`, and `paths`. See `plugins/heyra-dev`.
