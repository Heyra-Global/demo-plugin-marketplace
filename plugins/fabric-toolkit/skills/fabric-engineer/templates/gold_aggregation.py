# Fabric notebook source
# Gold aggregation template: build a business-ready fact table from silver.
# One notebook = one gold table. Reads silver only, never bronze.

# PARAMETERS
workspace_id = ""
silver_lakehouse_id = ""
gold_lakehouse_id = ""
target_table = "fct_daily_sales"

# CELL
from pyspark.sql import functions as F

spark.conf.set("spark.native.enabled", "true")

onelake = "onelake.dfs.fabric.microsoft.com"
silver = f"abfss://{workspace_id}@{onelake}/{silver_lakehouse_id}/Tables"
gold_path = f"abfss://{workspace_id}@{onelake}/{gold_lakehouse_id}/Tables/{target_table}"

orders = spark.read.format("delta").load(f"{silver}/orders")
customers = spark.read.format("delta").load(f"{silver}/customers")

# CELL
fct = (
    orders.join(customers, "customer_id", "left")
    .withColumn("order_date", F.to_date("ordered_utc"))
    .groupBy("order_date", "country", "channel")
    .agg(
        F.count("order_id").alias("orders"),
        F.sum("amount").alias("revenue"),
        F.countDistinct("customer_id").alias("customers"),
    )
    .withColumn("_built_utc", F.current_timestamp())
)

# CELL
# Gold is rebuilt from silver: overwrite is the idempotent choice here.
fct.write.format("delta").mode("overwrite").option("overwriteSchema", "false").save(gold_path)
print(f"gold: wrote {fct.count()} rows to {target_table}")
