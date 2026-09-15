# Fabric notebook source
# Silver transformation template: type, deduplicate and MERGE into a silver table.
# One notebook = one silver table. Idempotent: run it twice, nothing changes.

# PARAMETERS
workspace_id = ""
bronze_lakehouse_id = ""
silver_lakehouse_id = ""
source_table = ""             # bronze table
target_table = ""             # silver table (entity name)
natural_key = "order_id"      # comma-separated for composite keys
watermark_column = "updated_utc"
load_type = "incremental"     # incremental | full

# CELL
from pyspark.sql import functions as F, Window
from delta.tables import DeltaTable

spark.conf.set("spark.native.enabled", "true")

onelake = "onelake.dfs.fabric.microsoft.com"
bronze_path = f"abfss://{workspace_id}@{onelake}/{bronze_lakehouse_id}/Tables/{source_table}"
silver_path = f"abfss://{workspace_id}@{onelake}/{silver_lakehouse_id}/Tables/{target_table}"
ctl_path = f"abfss://{workspace_id}@{onelake}/{silver_lakehouse_id}/Tables/ctl_watermarks"
keys = [k.strip() for k in natural_key.split(",")]

# CELL
# 1. Read the watermark (incremental) so we only touch new bronze rows.
watermark = None
if load_type == "incremental":
    try:
        row = spark.read.format("delta").load(ctl_path).filter(F.col("table_name") == target_table).collect()
        watermark = row[0]["watermark_value"] if row else None
    except Exception:
        watermark = None

bronze = spark.read.format("delta").load(bronze_path)
if watermark:
    bronze = bronze.filter(F.col(watermark_column) > F.lit(watermark))

# CELL
# 2. Type and deduplicate: last version per natural key wins.
typed = (
    bronze
    .withColumn("order_id", F.col("order_id").cast("string"))
    .withColumn("amount", F.col("amount").cast("decimal(18,2)"))
    .withColumn(watermark_column, F.col(watermark_column).cast("timestamp"))
)
w = Window.partitionBy(*keys).orderBy(F.col(watermark_column).desc())
incoming = typed.withColumn("_rn", F.row_number().over(w)).filter("_rn = 1").drop("_rn")

# CELL
# 3. MERGE (or overwrite on a full load). Never append here.
if load_type == "full" or not DeltaTable.isDeltaTable(spark, silver_path):
    incoming.write.format("delta").mode("overwrite").save(silver_path)
else:
    cond = " AND ".join(f"t.{k} = s.{k}" for k in keys)
    (
        DeltaTable.forPath(spark, silver_path).alias("t")
        .merge(incoming.alias("s"), cond)
        .whenMatchedUpdateAll(condition=f"s.{watermark_column} > t.{watermark_column}")
        .whenNotMatchedInsertAll()
        .execute()
    )

# CELL
# 4. Advance the watermark in the same run.
new_wm = incoming.agg(F.max(watermark_column)).first()[0]
if new_wm is not None:
    spark.createDataFrame(
        [(target_table, str(new_wm))], "table_name string, watermark_value string"
    ).withColumn("updated_utc", F.current_timestamp()).createOrReplaceTempView("wm_new")
    spark.sql(
        f"""
        MERGE INTO delta.`{ctl_path}` t USING wm_new s
        ON t.table_name = s.table_name
        WHEN MATCHED THEN UPDATE SET *
        WHEN NOT MATCHED THEN INSERT *
        """
    )
print(f"silver: merged {incoming.count()} rows into {target_table}; watermark -> {new_wm}")
