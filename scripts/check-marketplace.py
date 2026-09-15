#!/usr/bin/env python3
"""House rules for this marketplace. Standard library only.

Complements `claude plugin validate` with checks the official validator does
not know about:

  - the marketplace file exists in both locations tools look at
    (.claude-plugin/marketplace.json for Claude and Copilot,
    .github/plugin/marketplace.json for Copilot's default) and is identical
  - every entry points at an existing plugin with a plugin.json that agrees
    on name and version
  - a plugin that also ships an Agent Plugins 1.0 manifest (plugin.json at
    the root) agrees with its Claude manifest, and its mcp.json is valid
  - component files referenced from plugin.json exist; hook commands that
    use ${CLAUDE_PLUGIN_ROOT}/... point at real files
  - every SKILL.md and agent file has a name and a description; skill
    descriptions contain "use when"; multi-skill plugins route to siblings
  - business plugins (any category but development): no local MCP servers
    (Cowork and Chat reach connectors through Anthropic's cloud), no
    user-only skills (Chat has no slash commands), a CONNECTORS.md
  - .mcp.json, .lsp.json and hooks.json parse

Exit 1 on errors. Warnings do not fail unless --strict.

    python scripts/check-marketplace.py [--strict]
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
errors: list[str] = []
warnings: list[str] = []
AGENT_PLUGINS_SCHEMA = "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json"
AGENT_MCP_SCHEMA = "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json"


def err(msg: str) -> None:
    errors.append(msg)


def warn(msg: str) -> None:
    warnings.append(msg)


def rel(path: Path) -> str:
    return str(path.relative_to(ROOT)).replace("\\", "/")


def load_json(path: Path) -> dict | None:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        err(f"{rel(path)}: invalid JSON ({exc})")
        return None


def frontmatter(path: Path) -> dict[str, str]:
    """Tiny frontmatter reader: top-level `key: value`, folded continuation lines."""
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---"):
        return {}
    end = text.find("\n---", 3)
    if end < 0:
        return {}
    data: dict[str, str] = {}
    key = None
    for line in text[3:end].strip("\n").splitlines():
        m = re.match(r"^([A-Za-z_-]+):\s*(.*)$", line)
        if m and not line.startswith((" ", "\t")):
            key = m.group(1)
            data[key] = m.group(2).strip()
        elif key and line.startswith((" ", "\t")):
            data[key] = (data[key] + " " + line.strip()).strip()
    return data


def folded_value_has_colon_space(path: Path) -> bool:
    """`: ` inside a folded scalar makes YAML read a mapping key; Claude Code then drops the frontmatter."""
    text = path.read_text(encoding="utf-8")
    end = text.find("\n---", 3)
    block = text[3:end] if text.startswith("---") and end > 0 else ""
    return any(line.startswith((" ", "\t")) and ": " in line for line in block.splitlines())


def check_hooks(plugin_dir: Path, hooks_path: Path) -> None:
    data = load_json(hooks_path)
    if not data:
        return
    for event, groups in data.get("hooks", {}).items():
        for group in groups:
            for hook in group.get("hooks", []):
                kind = hook.get("type")
                if kind == "command":
                    for m in re.finditer(r"\$\{CLAUDE_PLUGIN_ROOT\}/([^\s\"']+)", hook.get("command", "")):
                        if not (plugin_dir / m.group(1)).exists():
                            err(f"{rel(hooks_path)}: {event} hook references missing file {m.group(1)}")
                elif kind in ("prompt", "agent"):
                    if not hook.get("prompt"):
                        err(f"{rel(hooks_path)}: {event} {kind} hook has no prompt")
                else:
                    warn(f"{rel(hooks_path)}: {event} hook has unknown type {kind!r}")


def check_agent_plugins_manifest(plugin_dir: Path, claude: dict) -> None:
    manifest = plugin_dir / "plugin.json"
    if not manifest.is_file():
        return
    data = load_json(manifest)
    if data is None:
        return
    if data.get("$schema") != AGENT_PLUGINS_SCHEMA:
        err(f"{rel(manifest)}: $schema must be {AGENT_PLUGINS_SCHEMA}")
    for field in ("name", "version", "description"):
        if data.get(field) != claude.get(field):
            err(f"{rel(manifest)}: {field} differs from .claude-plugin/plugin.json")
    if "author" in data and not isinstance(data["author"], dict):
        err(f"{rel(manifest)}: author must be an object in Agent Plugins 1.0")
    allowed = {"$schema", "name", "version", "description", "author", "homepage", "repository", "license", "keywords", "extensions"}
    for key in data:
        if key not in allowed:
            err(f"{rel(manifest)}: field {key!r} is not allowed by the Agent Plugins schema")
    mcp = plugin_dir / "mcp.json"
    if mcp.is_file():
        m = load_json(mcp)
        if m is not None:
            if m.get("$schema") != AGENT_MCP_SCHEMA:
                err(f"{rel(mcp)}: $schema must be {AGENT_MCP_SCHEMA}")
            for name, server in (m.get("mcpServers") or {}).items():
                if server.get("type") not in ("stdio", "streamable-http", "sse"):
                    err(f"{rel(mcp)}: server {name} has type {server.get('type')!r}; expected stdio, streamable-http or sse")
    for f in (plugin_dir / "com.github.copilot" / "agents").glob("*.agent.md"):
        if not frontmatter(f).get("description"):
            err(f"{rel(f)}: Copilot agents require a description")


def check_plugin(entry: dict) -> None:
    name = entry.get("name", "?")
    source = entry.get("source")
    category = entry.get("category", "")
    business = category != "development"
    if not isinstance(source, str) or not source.startswith("./"):
        warn(f"marketplace entry {name}: source is not a relative path")
        return
    plugin_dir = ROOT / source
    manifest = plugin_dir / ".claude-plugin" / "plugin.json"
    if not manifest.is_file():
        err(f"marketplace entry {name}: {source}/.claude-plugin/plugin.json does not exist")
        return
    data = load_json(manifest)
    if data is None:
        return

    for field in ("name", "version", "description", "author"):
        if field not in data:
            err(f"{rel(manifest)}: missing required field {field}")
    if data.get("name") != name:
        err(f"{rel(manifest)}: name {data.get('name')!r} differs from marketplace entry {name!r}")
    if data.get("version") != entry.get("version"):
        err(f"{rel(manifest)}: version {data.get('version')!r} differs from marketplace.json {entry.get('version')!r}. Bump both.")
    if data.get("description") != entry.get("description"):
        warn(f"{rel(manifest)}: description differs from marketplace.json (keep them aligned)")
    if not (plugin_dir / "README.md").is_file():
        warn(f"{rel(plugin_dir)}: no README.md")
    if business and not (plugin_dir / "CONNECTORS.md").is_file():
        warn(f"{rel(plugin_dir)}: business plugin without CONNECTORS.md")

    for key in ("hooks", "mcpServers", "lspServers", "outputStyles", "skills", "agents", "commands"):
        value = data.get(key)
        paths = value if isinstance(value, list) else [value] if isinstance(value, str) else []
        for p in paths:
            target = plugin_dir / p
            if not target.exists():
                err(f"{rel(manifest)}: {key} points at missing path {p}")
            elif key == "hooks" and target.is_file():
                check_hooks(plugin_dir, target)
    if "hooks" not in data and (plugin_dir / "hooks" / "hooks.json").is_file():
        check_hooks(plugin_dir, plugin_dir / "hooks" / "hooks.json")
    if business and (plugin_dir / "hooks").exists():
        warn(f"{rel(plugin_dir)}: business plugin ships hooks; they run only in Cowork and need a runtime on each machine")

    mcp = plugin_dir / ".mcp.json"
    if mcp.is_file():
        m = load_json(mcp)
        if m is not None:
            for sname, server in (m.get("mcpServers") or {}).items():
                if business and "command" in server:
                    err(f"{rel(mcp)}: server {sname} is a local process; Chat and Cowork can only use remote (http) servers")
                if server.get("type") in ("http", "sse") and not str(server.get("url", "")).startswith("https://"):
                    err(f"{rel(mcp)}: server {sname} has no https url")
    lsp = plugin_dir / ".lsp.json"
    if lsp.is_file():
        load_json(lsp)

    skill_files = sorted(plugin_dir.glob("skills/*/SKILL.md"))
    skill_names = [f.parent.name for f in skill_files]
    if not skill_files:
        warn(f"{rel(plugin_dir)}: no skills")
    for f in skill_files:
        fm = frontmatter(f)
        if folded_value_has_colon_space(f):
            err(f"{rel(f)}: ': ' inside a folded frontmatter value; YAML reads it as a key and the frontmatter is dropped")
        if not fm.get("name"):
            err(f"{rel(f)}: frontmatter has no name")
        elif fm["name"] != f.parent.name:
            warn(f"{rel(f)}: name {fm['name']!r} differs from directory {f.parent.name!r}")
        desc = fm.get("description", "")
        if len(desc) < 60:
            err(f"{rel(f)}: description too short ({len(desc)} chars)")
        if len(desc) > 1024:
            err(f"{rel(f)}: description longer than 1024 characters")
        if "use when" not in desc.lower():
            err(f"{rel(f)}: description has no 'Use when ...' trigger clause")
        siblings = [s for s in skill_names if s != f.parent.name]
        if siblings and not any(re.search(rf"\b{re.escape(s)}\b", desc) for s in siblings):
            err(f"{rel(f)}: multi-skill plugin, but the description names no sibling skill")
        if business and fm.get("disable-model-invocation", "").lower() == "true":
            warn(f"{rel(f)}: user-only skill in a business plugin; Claude Chat has no slash commands, so it cannot be used there")
        if fm.get("context") == "fork" and not fm.get("agent"):
            warn(f"{rel(f)}: context: fork without agent:")
        if fm.get("agent") and not (plugin_dir / "agents" / f"{fm['agent']}.md").is_file():
            err(f"{rel(f)}: agent {fm['agent']!r} has no file at agents/{fm['agent']}.md")

    for f in sorted(plugin_dir.glob("agents/*.md")):
        fm = frontmatter(f)
        if folded_value_has_colon_space(f):
            err(f"{rel(f)}: ': ' inside a folded frontmatter value")
        for field in ("name", "description"):
            if not fm.get(field):
                err(f"{rel(f)}: frontmatter has no {field}")
        if fm.get("name") and fm["name"] != f.stem:
            warn(f"{rel(f)}: name {fm['name']!r} differs from file name {f.stem!r}")
        for s in re.findall(r"-\s*([\w-]+)", fm.get("skills", "")):
            if s not in skill_names:
                warn(f"{rel(f)}: preloads skill {s!r} that is not in this plugin")

    for bad in ("skills", "agents", "hooks", "commands"):
        if (plugin_dir / ".claude-plugin" / bad).exists():
            err(f"{rel(plugin_dir)}: {bad}/ must live at the plugin root, not inside .claude-plugin/")

    check_agent_plugins_manifest(plugin_dir, data)


def check_marketplace_copies() -> None:
    primary = ROOT / ".claude-plugin" / "marketplace.json"
    copilot = ROOT / ".github" / "plugin" / "marketplace.json"
    if not copilot.is_file():
        err("missing .github/plugin/marketplace.json (Copilot's default location); run: cp .claude-plugin/marketplace.json .github/plugin/marketplace.json")
        return
    if primary.read_bytes() != copilot.read_bytes():
        err(".github/plugin/marketplace.json differs from .claude-plugin/marketplace.json; copy the primary file over it")


def main() -> None:
    strict = "--strict" in sys.argv
    mp = load_json(ROOT / ".claude-plugin" / "marketplace.json")
    if mp is None:
        report(strict)
        return
    for field in ("name", "owner", "plugins"):
        if field not in mp:
            err(f"marketplace.json: missing {field}")
    names = [p.get("name") for p in mp.get("plugins", [])]
    for n in names:
        if not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", str(n)) or len(str(n)) > 64:
            err(f"marketplace.json: plugin name {n!r} must be lowercase kebab-case, max 64 characters")
    if len(names) != len(set(names)):
        err("marketplace.json: duplicate plugin names")
    for entry in mp.get("plugins", []):
        check_plugin(entry)
    check_marketplace_copies()
    print(f"Checked {len(names)} plugin(s) in marketplace {mp.get('name')!r}")
    report(strict)


def report(strict: bool) -> None:
    for w in warnings:
        print(f"  warning: {w}")
    for e in errors:
        print(f"  error:   {e}")
    failed = bool(errors) or (strict and bool(warnings))
    print(f"{len(errors)} error(s), {len(warnings)} warning(s){' [strict]' if strict else ''}")
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
