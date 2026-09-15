{{ config(materialized='table') }}

with

<upstream> as (
    select * from {{ ref('int_<entity>_<verb>') }}
),

final as (
    select
        <entity>_id,
        <dimension_1>,
        <dimension_2>,
        <measure_1>,
        <measure_2>,
        <event>_at
    from <upstream>
)

select * from final
