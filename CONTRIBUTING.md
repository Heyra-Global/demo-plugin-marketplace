# Contributing

This repository is a demo. Contributions that make the demo clearer are
welcome: a component type that is not shown yet, a sharper example, a bug in
a hook.

## Add a plugin

1. Copy the template:

   ```bash
   cp -r templates/plugin-template plugins/<name>
   ```

2. Edit `plugins/<name>/.claude-plugin/plugin.json`: name (lowercase
   kebab-case, equal to the folder name), version `1.0.0`, a specific
   description, author, keywords. Remove the `hooks` and `mcpServers` keys if
   you delete those components.
3. Write the components you need and delete the rest. A plugin with one
   skill is fine.
4. Register it in `.claude-plugin/marketplace.json`:

   ```json
   {
     "name": "<name>",
     "source": "./plugins/<name>",
     "description": "<same text as plugin.json>",
     "version": "1.0.0",
     "author": { "name": "Heyra", "email": "hello@heyra.io" },
     "license": "MIT",
     "keywords": ["..."],
     "category": "marketing | data-engineering | development | productivity"
   }
   ```

5. Write `plugins/<name>/README.md` with a component table and a "Try it"
   section, and add a row to the component matrix in the root README.
6. Test locally without installing:

   ```bash
   claude --plugin-dir ./plugins/<name>
   ```

7. Run `bash scripts/validate-all.sh`. Fix everything it reports.
8. Open a pull request. The template has the checklist.

## Change a plugin

Bump the version in both `plugin.json` and `marketplace.json`. Semver: MAJOR
for a change that alters how a skill or hook behaves for existing users,
MINOR for a new component, PATCH for fixes and wording.

## Conventions worth knowing

- **Skill descriptions** are the trigger. Say what the skill does, then "Use
  when ...", then route to sibling skills. Under 1024 characters.
- **No `: ` inside folded frontmatter values.** YAML turns it into a key and
  Claude Code drops the frontmatter silently.
- **Hooks print JSON or nothing.** Exit 0. Never print debug text to stdout;
  use stderr.
- **`${CLAUDE_PLUGIN_ROOT}`** for every path in `hooks.json` and `.mcp.json`;
  quote it. **`${CLAUDE_SKILL_DIR}`** inside skills.
- **userConfig** values reach scripts as `CLAUDE_PLUGIN_OPTION_<KEY>` and
  config files as `${user_config.<key>}`.
- **Evals** live in `plugins/<name>/evals/<case>/prompt.md` with
  `graders/*.md`. Prefer deterministic graders (regex, tool_used) and add one
  LLM grader for tone or judgement. Results go to `evals/results/`, which is
  git-ignored.

## Testing hooks

Every hook is a program. Feed it an event:

```bash
echo '{"tool_input":{"command":"git push --force origin main"}}' | bash plugins/dev-toolkit/hooks/guard-destructive.sh
```

Add a line to `scripts/test-hooks.js` for each new hook. CI runs the file.
