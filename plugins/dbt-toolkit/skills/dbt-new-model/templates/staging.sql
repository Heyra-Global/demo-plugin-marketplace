with

source as (
    select * from {{ source('<source_name>', '<table_name>') }}
),

renamed as (
    select
        -- ids
        <id_column> as <entity>_id,

        -- attributes
        <column> as <snake_case_name>,

        -- timestamps
        <created_column> as created_at,
        <updated_column> as updated_at
    from source
)

select * from renamed
