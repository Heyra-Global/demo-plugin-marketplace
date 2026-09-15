# Contributing

This repository is a demo. Contributions that make the demo clearer are
welcome: a workflow a client team recognises, a sharper Danish example, a
surface not yet shown.

## Contributing from Chat or Cowork, without a code editor

Employees who do not use Claude Code build plugins in Cowork with
Anthropic's Plugin Create plugin, share them with colleagues, and hand the
`.plugin` file to the plugin owners for promotion into this marketplace.
The full flow, the handover note and the plugin-owner runbook are in
[docs/CONTRIBUTE-WITHOUT-CODE.md](docs/CONTRIBUTE-WITHOUT-CODE.md).

## Add a plugin

1. Copy the template:

   ```bash
   cp -r templates/plugin-template plugins/<name>
   ```

2. Edit `plugins/<name>/.claude-plugin/plugin.json`: name (lowercase
   words with hyphens, equal to the folder name, max 64 characters),
   version `1.0.0`, a description that says what it does and where it
   works, author, keywords. Remove the `mcpServers` key if you delete
   `.mcp.json`.
3. Write the skills. One reference skill Claude loads on its own (the
   house rules), then task skills. Keep `CONNECTORS.md` accurate.
4. Register it in **both** marketplace files. Edit
   `.claude-plugin/marketplace.json`, then copy:

   ```bash
   cp .claude-plugin/marketplace.json .github/plugin/marketplace.json
   ```

5. Write `plugins/<name>/README.md` with a component table and a "Try it"
   section, and add the plugin to the tables in the root README.
6. Keep it consistent with the fictional company in `docs/HEYRA.md`.
7. Run `bash scripts/validate-all.sh`. Fix everything it reports.
8. Open a pull request. The template has the checklist.

## Business plugin or developer plugin

| Rule                                        | Business (Chat, Cowork)                 | Developer (Claude Code, Copilot)       |
| ------------------------------------------- | --------------------------------------- | -------------------------------------- |
| Skills                                      | model-invocable; no `disable-model-invocation` | any frontmatter                 |
| Connectors                                  | built-in by category; remote HTTPS MCP only | local or remote MCP               |
| Subagents                                   | at most one, as an example              | as needed                              |
| Hooks                                       | none                                    | allowed; add a case to `scripts/test-hooks.js` |
| Manifests                                   | `.claude-plugin/plugin.json`            | plus `plugin.json` (Agent Plugins 1.0), `mcp.json`, `com.github.copilot/agents/` |
| Language                                    | English instructions, Danish examples   | English                                |

`scripts/check-marketplace.py` enforces the business-plugin rules for every
plugin whose marketplace category is not `development`.

## Change a plugin

Bump the version in the plugin manifest(s) and in both marketplace files.
Semver: MAJOR when a skill's behaviour changes for existing users, MINOR
for a new skill or component, PATCH for fixes and wording.

## Conventions

- **Skill descriptions** are the trigger. What it does, then "Use when
  ...", then routing to sibling skills. Under 1,024 characters.
- **No `: ` inside folded frontmatter values.** YAML turns it into a key and
  the frontmatter is dropped silently.
- **Answer in the user's language.** Say so in every skill.
- **Skills never send, delete or invent.** They draft, list and ask.
- **No player data in outputs.** Case numbers, never names or amounts.
- **Nothing real.** No real operators, products, slogans or people.

## Packaging for manual upload

```bash
python scripts/package-plugins.py            # dist/*.plugin
python scripts/package-plugins.py heyra-email
```

CI attaches the same files to every run.
