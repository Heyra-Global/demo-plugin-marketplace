#!/usr/bin/env python3
"""Report which dbt models have tests and which do not.

Standard library only, so it runs anywhere Python 3.9+ runs. It does not need
dbt installed: it reads models/**/*.sql and the schema .yml files next to
them with a small line-based parser (enough for the common dbt layout).

    python scripts/test_coverage.py [project_dir] [--json]
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path


def find_models(models_dir: Path) -> dict[str, Path]:
    return {p.stem: p for p in models_dir.rglob("*.sql")}


def parse_tests(yml_text: str) -> dict[str, int]:
    """Return {model_name: number_of_tests} from one schema file.

    Handles the usual shape: a `models:` list with `- name:` entries, each with
    optional model-level `tests:` / `data_tests:` and `columns:` that carry
    their own tests. Indentation decides ownership.
    """
    counts: dict[str, int] = {}
    current_model: str | None = None
    model_indent = -1
    in_models = False
    collecting_tests_indent = -1

    for line in yml_text.splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        indent = len(line) - len(line.lstrip())
        stripped = line.strip()

        if indent == 0:
            in_models = stripped.startswith("models:")
            current_model = None
            collecting_tests_indent = -1
            continue
        if not in_models:
            continue

        m = re.match(r"-\s*name:\s*['\"]?([\w.]+)['\"]?", stripped)
        if m and (current_model is None or indent <= model_indent):
            current_model = m.group(1)
            model_indent = indent
            counts.setdefault(current_model, 0)
            collecting_tests_indent = -1
            continue
        if current_model is None:
            continue

        if re.match(r"(data_)?tests:\s*$", stripped):
            collecting_tests_indent = indent
            continue
        if collecting_tests_indent >= 0:
            if indent > collecting_tests_indent and stripped.startswith("-"):
                counts[current_model] += 1
                continue
            if indent <= collecting_tests_indent:
                collecting_tests_indent = -1
        # inline form:  tests: [unique, not_null]
        m2 = re.match(r"(data_)?tests:\s*\[(.*)\]", stripped)
        if m2:
            counts[current_model] += len([t for t in m2.group(2).split(",") if t.strip()])
    return counts


def main() -> None:
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    as_json = "--json" in sys.argv
    project = Path(args[0]) if args else Path.cwd()
    models_dir = project / "models"
    if not models_dir.is_dir():
        print(f"No models/ directory under {project}. Run this from a dbt project.")
        sys.exit(1)

    models = find_models(models_dir)
    tests: dict[str, int] = {}
    for yml in list(models_dir.rglob("*.yml")) + list(models_dir.rglob("*.yaml")):
        for name, n in parse_tests(yml.read_text(encoding="utf-8")).items():
            tests[name] = tests.get(name, 0) + n

    rows = []
    for name, path in sorted(models.items()):
        rows.append({
            "model": name,
            "path": str(path.relative_to(project)).replace("\\", "/"),
            "tests": tests.get(name, 0),
            "documented": name in tests,
        })
    total = len(rows)
    with_tests = sum(1 for r in rows if r["tests"] > 0)
    coverage = round(100 * with_tests / total) if total else 0
    report = {"models": total, "with_tests": with_tests, "coverage_pct": coverage, "rows": rows}

    if as_json:
        json.dump(report, sys.stdout, indent=2)
        print()
        return

    print(f"dbt test coverage: {with_tests}/{total} models have at least one test ({coverage}%)\n")
    print("| Model | Tests | Documented | Path |")
    print("|-------|------:|:----------:|------|")
    for r in rows:
        flag = "yes" if r["documented"] else "no"
        print(f"| {r['model']} | {r['tests']} | {flag} | {r['path']} |")
    missing = [r["model"] for r in rows if r["tests"] == 0]
    if missing:
        print(f"\nModels without tests ({len(missing)}): " + ", ".join(missing))


if __name__ == "__main__":
    main()
