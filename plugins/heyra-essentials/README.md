# heyra-essentials

The plugin every Heyra employee has. General skills that are useful in any
role and need no connector. The recommended install state for an
organisation is **Required** or **Installed by default**.

## What is in it

| Component             | Where                      | Works in                  | What it does                                                                                 |
| --------------------- | -------------------------- | ------------------------- | -------------------------------------------------------------------------------------------- |
| Skill: `ama`          | `skills/ama/`              | Chat, Cowork, Claude Code | "Interview me": Claude asks rounds of multiple-choice questions with a recommendation each, until it understands what you want. In Claude.ai the round is one interactive widget (`assets/widget-template.html`); elsewhere it asks one question at a time |
| Skill: `plugin-help`  | `skills/plugin-help/`      | Chat, Cowork, Claude Code | Which Heyra plugins and skills exist, which to use, where to switch them on, how to propose changes |
| Connectors            | `CONNECTORS.md`            |                           | None needed                                                                                  |

## Try it

```text
/ama Jeg skal lave en præsentation til ledelsen om vores kundecenter, men jeg ved ikke helt hvad de vil have.
Interview me about the retailer newsletter I have to write.
Hvilke plugins har jeg, og hvad kan de?
Hvordan får jeg Claude til at gennemgå min indbakke?
```

## Why it exists

Most poor answers come from unclear requests. `ama` turns "help me with a
presentation" into a specific task in two rounds of clicks. `plugin-help`
removes the question "what can Claude do here" for a new colleague.

## Adding more general skills

This is the place for skills everyone should have: a house writing style,
a translation skill, a summariser. Keep them connector-free and
role-neutral, so the plugin can stay Required for everyone. Department
skills belong in the department plugins.
