# Fabric notebook source
# Bronze ingestion template: land raw files as a Delta table with load metadata.
# One notebook = one bronze table. Append-only, partitioned by ingestion date.

# PARAMETERS
workspace_id = ""            # passed by the pipeline; never hardcode
lakehouse_id = ""            # target lakehouse (bronze)
source_path = ""             # abfss://... or Files/landing/<source>/<entity>/
target_table = ""            # bronze table name, keeps the source name
source_format = "csv"        # csv | json | parquet
batch_id = ""                # pipeline run id for traceability

# CELL
from pyspark.sql import functions as F

spark.conf.set("spark.native.enabled", "true")

base = f"abfss://{workspace_id}@onelake.dfs.fabric.microsoft.com/{lakehouse_id}"
target_path = f"{base}/Tables/{target_table}"

reader = spark.read.format(source_format)
if source_format == "csv":
    reader = reader.option("header", "true").option("inferSchema", "false")

df = (
    reader.load(source_path)
    .withColumn("_ingested_utc", F.current_timestamp())
    .withColumn("_source_file", F.input_file_name())
    .withColumn("_batch_id", F.lit(batch_id))
    .withColumn("_ingest_date", F.to_date(F.current_timestamp()))
)

# CELL
# Bronze is the only layer where append is allowed. The batch id makes a
# re-run detectable: delete the batch, then append again.
existing_batch = None
try:
    existing_batch = spark.read.format("delta").load(target_path).filter(F.col("_batch_id") == batch_id).limit(1).count()
except Exception:
    existing_batch = 0

if existing_batch:
    spark.sql(f"DELETE FROM delta.`{target_path}` WHERE _batch_id = '{batch_id}'")

(
    df.write.format("delta")
    .mode("append")
    .option("mergeSchema", "true")
    .partitionBy("_ingest_date")
    .save(target_path)
)

print(f"bronze: appended {df.count()} rows to {target_table} (batch {batch_id})")
