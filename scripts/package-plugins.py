#!/usr/bin/env python3
"""Package every plugin as a `<name>.plugin` zip for manual upload.

Claude Cowork and the Claude admin console accept a plugin as a zip file
("Upload a file" on the Plugins page; org marketplaces accept a zip of up to
50 MB). Output goes to dist/, which is git-ignored.

    python scripts/package-plugins.py            # all plugins
    python scripts/package-plugins.py heyra-email
"""
from __future__ import annotations

import json
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"
SKIP_DIRS = {"node_modules", "__pycache__", ".git", "results"}
SKIP_FILES = {".DS_Store", "Thumbs.db"}


def package(plugin_dir: Path) -> Path:
    manifest = json.loads((plugin_dir / ".claude-plugin" / "plugin.json").read_text(encoding="utf-8"))
    out = DIST / f"{manifest['name']}.plugin"
    DIST.mkdir(exist_ok=True)
    count = 0
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as zf:
        for path in sorted(plugin_dir.rglob("*")):
            if path.is_dir():
                continue
            parts = set(path.relative_to(plugin_dir).parts)
            if parts & SKIP_DIRS or path.name in SKIP_FILES:
                continue
            zf.write(path, path.relative_to(plugin_dir).as_posix())
            count += 1
    size_kb = out.stat().st_size // 1024
    print(f"{out.relative_to(ROOT).as_posix()}: {count} files, {size_kb} KB (version {manifest.get('version')})")
    return out


def main() -> None:
    wanted = set(sys.argv[1:])
    plugin_dirs = sorted(p for p in (ROOT / "plugins").iterdir() if (p / ".claude-plugin" / "plugin.json").is_file())
    if wanted:
        plugin_dirs = [p for p in plugin_dirs if p.name in wanted]
        missing = wanted - {p.name for p in plugin_dirs}
        if missing:
            sys.exit(f"unknown plugin(s): {', '.join(sorted(missing))}")
    for p in plugin_dirs:
        package(p)


if __name__ == "__main__":
    main()
