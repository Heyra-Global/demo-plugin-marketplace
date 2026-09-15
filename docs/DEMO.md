# Presenter script

A 20-minute walkthrough of the marketplace for clients and prospects. Each
step has the command to type and the point to make. Times are approximate.

## Before the session

- Claude Code 2.1.260 or newer, logged in. Node 18+, Python 3.10+, git.
- A scratch repository with a few source files, a `dbt_project.yml`, a
  `models/staging/` folder and a `notebooks/` folder. Commit it so the git
  hooks have something to show.
- Remove earlier installs so the install step is real:
  `claude plugin uninstall dev-toolkit@heyra-demo` and so on, or
  `claude plugin marketplace remove heyra-demo`.
- Optional: `az login` and `uv` for the MCP servers. The demo works without
  them; the doctor skill will show them as missing, which is itself a point.
- Open `README.md` in a browser tab for the component matrix.

## 1. What a marketplace is (2 min)

Show `.claude-plugin/marketplace.json` in the editor.

> One JSON file lists plugins. A plugin is a folder. That is the entire
> distribution mechanism: a git repository. Private repositories work, so a
> company can ship its own way of working to every developer.

Show `.claude/settings.json`.

> Teams pin the marketplace here. New colleagues clone the repo, open Claude
> Code, and get prompted to install the same plugins.

## 2. Install (2 min)

```text
/plugin marketplace add Heyra-Global/demo-cc-marketplace
/plugin
```

Browse the four plugins in the UI. Install `dev-toolkit` at user scope.

> Notice the descriptions. They are the sales pitch and the routing at the
> same time.

Restart the session (or `/reload-plugins`). Point at the session-start
context line if it is visible: the plugin already told Claude which branch
you are on.

## 3. Skills as commands (4 min)

```text
/dev-toolkit:doctor
```

> Every line in that table was produced by a shell command that ran when the
> skill loaded. Skills can look at the machine before Claude reads them.

```text
/dev-toolkit:setup
```

Pick `dbt-toolkit` and `nordlys-brand` when asked. Show the resulting
`.claude/settings.json` in the project.

> Project-scope installs are committed. The whole team gets them.

Make a small code change, then:

```text
/dev-toolkit:commit --all
```

> No permission prompt for the git commands: the skill pre-approved exactly
> those and nothing else.

## 4. Hooks: guard rails and feedback (4 min)

Ask Claude:

```text
Force-push this branch to main.
```

> The bash hook denied it before the command ran, with a reason Claude can
> read. This is policy as code, and it works no matter what the prompt says.

Ask Claude to write `marketing/launch.md` announcing a product "leveraging
cutting-edge synergies".

> The PostToolUse hook read the file and told Claude which words to remove.
> Claude fixes it on its own. Rules the team cares about become
> non-negotiable without anyone reviewing.

Ask Claude to add a dbt model `models/staging/shop/orders_raw.sql` that
selects from `raw.shop.orders`.

> Three findings from the lint hook: naming, lineage, tests. And the
> conventions skill loaded on its own because the file is under `models/`.

Finally, ask Claude to change a Python file and finish. When the Stop hook
asks for a test run, point at it:

> That hook has no code. It is a prompt evaluated by a small model. The
> cheapest possible "did you run the tests" reviewer.

## 5. Subagents (3 min)

```text
/dev-toolkit:review-changes
```

> The review ran in a separate context with read-only tools and a high
> effort setting. The main conversation stays short; the report comes back.

```text
/nordlys-brand:brand-check marketing/launch.md
```

> Same mechanism, different specialist. The reviewer had the brand skill
> preloaded, so it did not need to search for the rules.

## 6. MCP servers (3 min)

```text
Does Ice White text on Aurora Green pass accessibility for body copy?
```

> Claude called `check_contrast` on an MCP server that ships inside the
> plugin: 200 lines of Node, no install, no network. Plugins can also point
> at public servers: this marketplace connects to the Fabric MCP with an
> Azure token helper, to the dbt MCP through uvx, and to Context7 for
> documentation.

If `az` is logged in, ask Claude to list the Fabric workspaces. If not, show
`plugins/fabric-toolkit/.mcp.json` and the auth helper script.

## 7. Quality: evals and CI (2 min)

Open `plugins/nordlys-brand/evals/linkedin-post-no-hype/`.

> A plugin can ship its own tests. This case sends a prompt, then three
> graders score the result: a regex for banned words, a check that the skill
> fired, and a rubric judged by a model. `claude plugin eval` runs it with
> and without the plugin and reports the difference.

(`claude plugin eval` is in early access. If your account does not have it,
show the files and skip the run.)

Open `.github/workflows/validate.yml`.

> Every pull request runs syntax checks, house rules, hook smoke tests, the
> MCP smoke test and the official validator. A marketplace is a software
> product; it gets CI.

## Closing line

> Skills carry knowledge, subagents carry specialists, hooks carry policy,
> MCP carries tools. A marketplace ships all four to every developer in one
> command. What in your team's way of working would you put in here first?

## If something breaks

- Hook did not fire: `/hooks` shows the registered hooks. Check Node is on
  PATH. Run the hook by hand: `echo '{}' | node <hook>`.
- Skill not found: `/reload-plugins`, then `/skills`.
- MCP server red in `/mcp`: the doctor skill lists the missing tool.
- Reset: `claude plugin marketplace remove heyra-demo` and delete
  `.claude/settings.json` in the scratch repo.
