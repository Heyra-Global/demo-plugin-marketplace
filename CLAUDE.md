# heyra-demo marketplace

A demo plugin marketplace for Claude Chat, Claude Cowork, Claude Code and
GitHub Copilot. Six plugins under `plugins/`; the manifest is
`.claude-plugin/marketplace.json` with an identical copy at
`.github/plugin/marketplace.json`. The list of what exists lives in those
files and in each `plugins/*/.claude-plugin/plugin.json`; do not restate it
here.

All example content is about "Heyra", a fictional Danish betting and gaming
operator described in `docs/HEYRA.md`. Keep it fictional. No real operators,
products, slogans or people.

## Rules for changes

- Every change under `plugins/<name>/` bumps `version` in the plugin
  manifest(s) and in **both** marketplace files. CI fails otherwise. Copy
  the primary marketplace file over the Copilot copy; never edit them
  separately.
- Business plugins (category other than `development`): skills and
  connectors only, no hooks, no local MCP servers, no
  `disable-model-invocation`. `scripts/check-marketplace.py` enforces it.
- Skill descriptions: what it does, "Use when ...", routing to sibling
  skills. Never `: ` inside a folded frontmatter value.
- Skills answer in the user's language; instructions are English, examples
  may be Danish.
- Skills never send mail, post messages, delete data or invent numbers.
- heyra-dev keeps both manifest formats in sync (`.claude-plugin/plugin.json`
  and `plugin.json`), and both MCP files.

## Validate before you commit

```bash
bash scripts/validate-all.sh
```

Runs JSON and script syntax checks, `scripts/check-marketplace.py`,
`scripts/test-hooks.js`, `scripts/package-plugins.py` and
`claude plugin validate --strict` on the marketplace and every plugin. CI
runs the same.

## Adding a plugin

`templates/plugin-template/` is the starting point. `CONTRIBUTING.md` has
the steps. The `.claude/settings.json` in this repo enables `plugin-dev`
and `example-skills` (host of `skill-creator`) for contributors; use them
when authoring.

## Commit messages

`type(scope): subject`, plugin name as scope, under 72 characters, present
tense. Example: `feat(heyra-email): add follow-ups skill`.
