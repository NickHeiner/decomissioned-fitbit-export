USE fitbit_export_db;

CREATE TABLE fetch_results (
  base_date DATE,
  query_period VARCHAR(10),
  resource_category VARCHAR(100),
  resource_subcategory VARCHAR(100),
  # I would like to encrypt the results from fitbit, 
  # but I'm not sure if the best way to do that is at a column or whole-db level.
  result JSON
)
