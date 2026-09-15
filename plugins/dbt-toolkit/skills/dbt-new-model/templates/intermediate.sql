with

<upstream_a> as (
    select * from {{ ref('stg_<source>__<entity_a>') }}
),

<upstream_b> as (
    select * from {{ ref('stg_<source>__<entity_b>') }}
),

joined as (
    select
        <upstream_a>.<entity_a>_id,
        <upstream_b>.<attribute>,
        <upstream_a>.<measure>
    from <upstream_a>
    left join <upstream_b>
        on <upstream_a>.<key> = <upstream_b>.<key>
),

final as (
    select
        <entity_a>_id,
        <attribute>,
        <measure>
    from joined
)

select * from final
