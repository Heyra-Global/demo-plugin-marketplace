# heyra-demo marketplace

A demo Claude Code plugin marketplace. Four plugins under `plugins/`, one
manifest at `.claude-plugin/marketplace.json`. The authoritative list of what
exists is that manifest plus each `plugins/*/.claude-plugin/plugin.json`; do
not restate it here.

## Rules for changes

- Every change under `plugins/<name>/` needs a version bump in **both**
  `plugins/<name>/.claude-plugin/plugin.json` and the matching entry in
  `.claude-plugin/marketplace.json`. CI fails otherwise.
- Keep `description` identical in the two files.
- Skill descriptions: say what the skill does, then a "Use when ..." clause.
  In a plugin with several skills, name at least one sibling skill
  ("for X see other-skill"). `scripts/check-marketplace.py` enforces this.
- Frontmatter descriptions are folded YAML scalars. Never put `: ` (colon
  followed by a space) inside them; YAML reads it as a mapping key and the
  whole frontmatter is dropped at runtime.
- Hooks are plain programs that read JSON on stdin and print JSON on stdout.
  Every new hook gets a case in `scripts/test-hooks.js`.
- Hook and MCP scripts have zero external dependencies. Node for
  cross-platform scripts, bash only where the point is to show a shell hook.
- Components live at the plugin root (`skills/`, `agents/`, `hooks/`,
  `.mcp.json`, `.lsp.json`, `output-styles/`, `evals/`). Only `plugin.json`
  goes inside `.claude-plugin/`.
- No real client names, data or credentials. The demo brand is Nordlys
  Analytics; keep it fictional.

## Validate before you commit

```bash
bash scripts/validate-all.sh
```

That runs JSON and script syntax checks, `scripts/check-marketplace.py`,
`scripts/test-hooks.js`, the MCP smoke test and `claude plugin validate` on
the marketplace and every plugin. CI runs the same steps.

## Adding a plugin

1. Copy `templates/plugin-template/` to `plugins/<name>/` and edit
   `plugin.json`. Delete components you do not need.
2. Add an entry to `.claude-plugin/marketplace.json` (name, source,
   description, version, keywords, category).
3. Add a row to the component matrix in `README.md` and a component table
   in the plugin's own `README.md`.
4. Try it: `claude --plugin-dir ./plugins/<name>`.
5. Validate, then open a PR with the template.

The `.claude/settings.json` in this repo enables `plugin-dev` and
`example-skills` (which hosts `skill-creator`) for contributors. Use them when
authoring skills and plugins.

## Commit messages

`type(scope): subject`, plugin name as scope, under 72 characters, present
tense. Example: `feat(dbt-toolkit): add sql-reviewer subagent`.
