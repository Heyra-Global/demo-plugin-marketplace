# Medallion layer contracts

Loaded on demand from the fabric-architect skill.

| Layer  | May contain                                       | Promises to readers                                          | Write mode                     |
| ------ | ------------------------------------------------- | ------------------------------------------------------------ | ------------------------------ |
| Bronze | Source rows as received, plus `_ingested_at`, `_source_file`, `_batch_id` | Nothing is lost. Replay from here is always possible | Append, partitioned by load date |
| Silver | Typed columns, deduplicated rows, conformed keys, `_valid_from`/`_valid_to` where history matters | One row per entity version. Types are right. Keys join | MERGE on the natural key      |
| Gold   | Facts and dimensions, KPIs, aggregates             | Business definitions are final. Safe for reports              | Overwrite or MERGE from silver |

## Column conventions

- Metadata columns start with an underscore.
- Keys: `<entity>_key` (surrogate, gold), `<entity>_id` (natural, silver).
- Timestamps in UTC, suffix `_utc`.
- Money as `decimal(18,2)`; never float.

## Watermarks

Every incremental notebook stores its high-water mark in a small control
table `lh_silver.ctl_watermarks(table_name, watermark_value, updated_utc)`.
Read it at the start, write it at the end, inside the same run.

## Schema evolution

- Bronze: `mergeSchema=true` is allowed; new columns are welcome.
- Silver: schema changes are a code change. Fail the run on unexpected
  columns and open a ticket.
- Gold: never evolve implicitly.
