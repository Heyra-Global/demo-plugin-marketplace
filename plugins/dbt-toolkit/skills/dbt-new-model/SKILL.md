---
name: dbt-new-model
description:
  Scaffold a new dbt model in the right layer with the house CTE shape and a
  matching schema .yml entry with tests. Use when the user asks to create,
  add or scaffold a dbt model. For the rules see dbt-conventions, for a
  coverage report see dbt-test-coverage, and to build it see dbt-build-fix.
argument-hint: "<model_name> [staging|intermediate|marts]"
arguments: [model_name, layer]
disable-model-invocation: true
---

# New dbt model

Model name: **$model_name**
Layer: **$layer** (if empty, infer it from the prefix: `stg_` -> staging,
`int_` -> intermediate, `fct_`/`dim_`/`agg_` -> marts; if there is no prefix,
ask one question).

## Live project data

- project: !`grep -m1 '^name:' dbt_project.yml 2>/dev/null || echo "no dbt_project.yml in this directory"`
- existing models in the target layer: !`ls models/$layer 2>/dev/null | head -20 || echo "(layer folder does not exist yet)"`

## Steps

1. Validate the name against the dbt-conventions skill. If the prefix does
   not match the layer, tell the user and stop.
2. Pick the template from this skill's `templates/` folder:
   - staging -> [`templates/staging.sql`](templates/staging.sql)
   - intermediate -> [`templates/intermediate.sql`](templates/intermediate.sql)
   - marts -> [`templates/mart.sql`](templates/mart.sql)
3. Ask **one** question if needed: which upstream model(s) or source the model
   reads from. Then fill the template. Keep the CTE shape; list columns
   explicitly.
4. Write the model to `models/<layer>/<subfolder>/<model_name>.sql`. For
   staging, `<subfolder>` is the source name; for marts it is the domain.
5. Add an entry to the `.yml` file in that folder (create `_<folder>__models.yml`
   if none exists) using [`templates/schema.yml`](templates/schema.yml): grain
   in the description, `unique` and `not_null` on the key.
6. Reply with the two file paths and the command to build it:
   `dbt build --select +<model_name>`.

The plugin's `model-lint` hook checks the written file and reports anything
that does not follow the conventions.
