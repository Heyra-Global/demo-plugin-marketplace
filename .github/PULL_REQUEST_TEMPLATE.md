## What

<!-- One paragraph. Which plugin, which component, what changed. -->

## Type of change

- [ ] New plugin
- [ ] New component in an existing plugin (skill, agent, hook, MCP, LSP, output style, eval)
- [ ] Fix or content update
- [ ] Repository infrastructure (CI, scripts, docs, template)

## Checklist

- [ ] `bash scripts/validate-all.sh` passes locally
- [ ] Version bumped in **both** `plugins/<name>/.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json` (CI fails otherwise)
- [ ] The plugin README's component table is up to date
- [ ] New hooks have a case in `scripts/test-hooks.js`
- [ ] Skill descriptions contain a "Use when ..." clause and name a sibling skill (multi-skill plugins)
- [ ] Nothing in this PR contains real client data or credentials (this repository is a demo)

## How to demo it

<!-- The exact prompt or slash command a presenter types to show this change. -->
