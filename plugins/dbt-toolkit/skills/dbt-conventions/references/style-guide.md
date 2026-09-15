# dbt style guide: anti-patterns and fixes

Loaded on demand from the dbt-conventions skill.

| Anti-pattern                                     | Why it hurts                                   | Fix                                                        |
| ------------------------------------------------ | ---------------------------------------------- | ---------------------------------------------------------- |
| `select *` in a logic CTE                        | Columns change upstream without notice         | List columns; `select *` only in import CTEs and `final`   |
| `from raw.shop.orders` (hardcoded)               | No lineage, breaks across environments         | `{{ source('shop', 'orders') }}`                            |
| Joins in staging                                 | Staging must be a 1:1 mirror of the source     | Move the join to intermediate                              |
| `distinct` to hide duplicates                    | Hides a grain problem                          | Fix the grain; add a `unique` test                         |
| `case when` with magic numbers                   | Nobody knows what 3 means                      | A seed or a macro with named values                        |
| Incremental without `unique_key`                 | Duplicates on re-run                           | Set `unique_key`, add `is_incremental()` filter            |
| Test-free marts                                  | Silent breakage                                | `unique` + `not_null` on the key, `relationships` on FKs   |
| Model names that describe the transformation     | `orders_cleaned_v2_final`                      | Name the entity and layer: `stg_shop__orders`              |

## Materialisation guide

| Model type                          | Materialisation | Note                                             |
| ----------------------------------- | --------------- | ------------------------------------------------ |
| Staging                             | view            | Cheap, always fresh                              |
| Intermediate, reused by many        | view            | Ephemeral if only one consumer                   |
| Small mart (< 10M rows)             | table           | Rebuilt each run                                 |
| Large event fact                    | incremental     | `unique_key`, partition on the event date        |
| Snapshot of slowly changing entity  | snapshot        | Timestamp strategy when `updated_at` is reliable |

## YAML shape

```yaml
version: 2

models:
  - name: fct_orders
    description: One row per order. Grain = order_id.
    columns:
      - name: order_id
        description: Primary key.
        data_tests:
          - unique
          - not_null
      - name: customer_id
        data_tests:
          - relationships:
              to: ref('dim_customers')
              field: customer_id
      - name: status
        data_tests:
          - accepted_values:
              values: ['placed', 'shipped', 'returned', 'cancelled']
```
