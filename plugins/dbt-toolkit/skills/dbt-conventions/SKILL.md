---
name: dbt-conventions
description:
  House conventions for dbt projects - layer structure (staging,
  intermediate, marts), model and column naming, CTE shape, materialisations,
  required tests and documentation. Loads automatically when you work under
  models/ or on dbt_project.yml. Use when writing, changing or reviewing any
  dbt model. To scaffold a model see dbt-new-model, for a test report see
  dbt-test-coverage, and to run and fix a build see dbt-build-fix.
paths:
  - "models/**"
  - "macros/**"
  - "dbt_project.yml"
---

# dbt conventions

Loaded automatically through the `paths` frontmatter whenever Claude touches
a file under `models/`, `macros/` or the project file. The plugin's
`model-lint` hook enforces the parts of this document that a script can check.

## Layers

| Layer        | Folder                  | Prefix         | Materialisation | Reads from             |
| ------------ | ----------------------- | -------------- | --------------- | ---------------------- |
| Staging      | `models/staging/<src>/` | `stg_<src>__`  | view            | `source()` only        |
| Intermediate | `models/intermediate/`  | `int_`         | ephemeral/view  | staging, intermediate  |
| Marts        | `models/marts/<domain>/`| `fct_`, `dim_`, `agg_` | table or incremental | intermediate, staging |

Rules:

- Staging does exactly three things: rename, cast, light filtering of test
  rows. No joins.
- One staging model per source table, named `stg_<source>__<table>`.
- Marts never read `source()` directly.
- Every mart has a declared grain in its `.yml` description.

## Model shape

```sql
with

source as (
    select * from {{ ref('stg_shop__orders') }}
),

customers as (
    select * from {{ ref('stg_shop__customers') }}
),

joined as (
    select
        source.order_id,
        source.customer_id,
        customers.country,
        source.amount,
        source.ordered_at
    from source
    left join customers on source.customer_id = customers.customer_id
),

final as (
    select
        order_id,
        customer_id,
        country,
        amount,
        ordered_at
    from joined
)

select * from final
```

- Import CTEs first, one per upstream model, `select *` allowed there.
- Logic CTEs list columns explicitly.
- Exactly one `final` CTE, then `select * from final`.
- Lowercase keywords, four-space indent, trailing commas never.

## Naming

- Columns: snake_case. Booleans `is_`/`has_`. Timestamps `_at`, dates
  `_date`, money `_amount`, counts `_count`.
- Primary key: `<entity>_id`. Surrogate keys: `<entity>_key` built with
  `dbt_utils.generate_surrogate_key`.

## Tests and docs (mandatory)

Every model has an entry in the `.yml` file in its folder with:

- a one-line `description` that states the grain,
- `unique` and `not_null` on the primary key,
- `relationships` on every foreign key to a mart,
- `accepted_values` on any status column.

Run `/dbt-toolkit:dbt-test-coverage` to see which models fall short.

## Incremental models

```sql
{{ config(materialized='incremental', unique_key='order_id', on_schema_change='append_new_columns') }}

...
{% if is_incremental() %}
where ordered_at > (select coalesce(max(ordered_at), '1900-01-01') from {{ this }})
{% endif %}
```

## Environments

- `dev` target: your own schema, `dbt build --select +my_model`.
- `ci` target: built by the pipeline on every PR with `--select state:modified+`.
- `prod` target: deployed by CI only. The plugin's guard hook asks before
  any interactive command that targets prod and denies full refreshes.

More detail, with anti-patterns and their fixes, in
[`references/style-guide.md`](references/style-guide.md).
