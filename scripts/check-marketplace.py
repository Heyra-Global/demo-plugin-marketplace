#!/usr/bin/env python3
"""Deterministic checks for this marketplace. Standard library only.

Complements `claude plugin validate` with the house rules that the official
validator does not know about:

  - every marketplace entry points at an existing plugin directory
  - plugin.json and marketplace.json agree on name and version
  - component files referenced from plugin.json exist
  - every hook command that uses ${CLAUDE_PLUGIN_ROOT}/... points at a real file
  - every SKILL.md and agent file has a name and a description
  - every skill description contains "use when" (trigger clause)
  - in multi-skill plugins, every skill description names a sibling skill
  - .mcp.json, .lsp.json and hooks.json parse as JSON

Exit code 1 on any error. Warnings do not fail the run.

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


def err(msg: str) -> None:
    errors.append(msg)


def warn(msg: str) -> None:
    warnings.append(msg)


def load_json(path: Path) -> dict | None:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        err(f"{rel(path)}: invalid JSON ({exc})")
        return None


def rel(path: Path) -> str:
    return str(path.relative_to(ROOT)).replace("\\", "/")


def frontmatter(path: Path) -> dict[str, str]:
    """Tiny YAML-ish frontmatter reader: top-level `key: value`, folded multi-line values."""
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---"):
        return {}
    end = text.find("\n---", 3)
    if end < 0:
        return {}
    block = text[3:end].strip("\n")
    data: dict[str, str] = {}
    key = None
    for line in block.splitlines():
        m = re.match(r"^([A-Za-z_-]+):\s*(.*)$", line)
        if m and not line.startswith((" ", "\t")):
            key = m.group(1)
            data[key] = m.group(2).strip()
        elif key and line.startswith((" ", "\t")):
            data[key] = (data[key] + " " + line.strip()).strip()
    return data


def check_hooks(plugin_dir: Path, hooks_path: Path) -> None:
    data = load_json(hooks_path)
    if not data:
        return
    for event, groups in data.get("hooks", {}).items():
        for group in groups:
            for hook in group.get("hooks", []):
                kind = hook.get("type")
                if kind == "command":
                    cmd = hook.get("command", "")
                    for m in re.finditer(r"\$\{CLAUDE_PLUGIN_ROOT\}/([^\s\"']+)", cmd):
                        target = plugin_dir / m.group(1)
                        if not target.exists():
                            err(f"{rel(hooks_path)}: {event} hook references missing file {m.group(1)}")
                elif kind in ("prompt", "agent"):
                    if not hook.get("prompt"):
                        err(f"{rel(hooks_path)}: {event} {kind} hook has no prompt")
                else:
                    warn(f"{rel(hooks_path)}: {event} hook has unknown type {kind!r}")


def check_plugin(entry: dict, marketplace_version: str) -> None:
    name = entry.get("name", "?")
    source = entry.get("source")
    if not isinstance(source, str) or not source.startswith("./"):
        warn(f"marketplace entry {name}: source is not a relative path (external plugins are fine here)")
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

    # Component paths referenced from plugin.json
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
    for fname in (".mcp.json", ".lsp.json"):
        f = plugin_dir / fname
        if f.is_file():
            load_json(f)

    # Skills
    skill_files = sorted(plugin_dir.glob("skills/*/SKILL.md"))
    skill_names = [f.parent.name for f in skill_files]
    for f in skill_files:
        fm = frontmatter(f)
        if not fm.get("name"):
            err(f"{rel(f)}: frontmatter has no name")
        elif fm["name"] != f.parent.name:
            warn(f"{rel(f)}: name {fm['name']!r} differs from directory {f.parent.name!r}")
        desc = fm.get("description", "")
        if len(desc) < 60:
            err(f"{rel(f)}: description too short ({len(desc)} chars); say what it does and when to use it")
        if "use when" not in desc.lower():
            err(f"{rel(f)}: description has no 'Use when ...' trigger clause")
        siblings = [s for s in skill_names if s != f.parent.name]
        if siblings and not any(re.search(rf"\b{re.escape(s)}\b", desc) for s in siblings):
            err(f"{rel(f)}: multi-skill plugin, but the description names no sibling skill (routing)")
        if fm.get("context") == "fork" and not fm.get("agent"):
            warn(f"{rel(f)}: context: fork without agent:")
        if fm.get("agent"):
            agent_file = plugin_dir / "agents" / f"{fm['agent']}.md"
            if not agent_file.is_file():
                err(f"{rel(f)}: agent {fm['agent']!r} has no file at agents/{fm['agent']}.md")

    # Agents
    for f in sorted(plugin_dir.glob("agents/*.md")):
        fm = frontmatter(f)
        for field in ("name", "description"):
            if not fm.get(field):
                err(f"{rel(f)}: frontmatter has no {field}")
        if fm.get("name") and fm["name"] != f.stem:
            warn(f"{rel(f)}: name {fm['name']!r} differs from file name {f.stem!r}")
        for s in re.findall(r"-\s*([\w-]+)", fm.get("skills", "")):
            if s not in skill_names and not (plugin_dir / "skills" / s).is_dir():
                warn(f"{rel(f)}: preloads skill {s!r} that is not in this plugin")

    # Wrong location: components inside .claude-plugin/
    for bad in ("skills", "agents", "hooks", "commands"):
        if (plugin_dir / ".claude-plugin" / bad).exists():
            err(f"{rel(plugin_dir)}: {bad}/ must live at the plugin root, not inside .claude-plugin/")


def main() -> None:
    strict = "--strict" in sys.argv
    mp_path = ROOT / ".claude-plugin" / "marketplace.json"
    mp = load_json(mp_path)
    if mp is None:
        report(strict)
        return
    for field in ("name", "owner", "plugins"):
        if field not in mp:
            err(f"marketplace.json: missing {field}")
    names = [p.get("name") for p in mp.get("plugins", [])]
    for n in names:
        if not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", str(n)):
            err(f"marketplace.json: plugin name {n!r} is not lowercase kebab-case")
    if len(names) != len(set(names)):
        err("marketplace.json: duplicate plugin names")
    for entry in mp.get("plugins", []):
        check_plugin(entry, mp.get("metadata", {}).get("version", ""))
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
