--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS fipeTable (
  id                INTEGER PRIMARY KEY,
  date              INTEGER UNIQUE,
  createdAt         DATE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS make (
  id                INTEGER PRIMARY KEY,
  name              TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS model (
  id                INTEGER PRIMARY KEY,
  makeId            INTEGER NOT NULL,
  name              TEXT NOT NULL,
  vehicleTypeCode   INTEGER NOT NULL CHECK (vehicleTypeCode IN (1, 2, 3)),
  fipeCode          TEXT NOT NULL,
  fuelTypeCode      TEXT CHECK(fuelTypeCode IN ('G','D','A')) NOT NULL,
  FOREIGN KEY (makeId) REFERENCES make(id) ON DELETE CASCADE
);

CREATE INDEX index_model_on_makeId ON model (makeId);

CREATE TABLE IF NOT EXISTS modelYear (
  modelId           INTEGER NOT NULL,
  year              INTEGER NOT NULL,
  refDate           INTEGER NOT NULL,
  prices            JSON NOT NULL, -- prices for the last 12m
  deltaPrices       JSON NOT NULL, -- 1M, 3M, 6M, 12M, 24M, 32M
  PRIMARY KEY (modelId, year),
  FOREIGN KEY (modelId) REFERENCES model(id) ON DELETE CASCADE
);

CREATE VIEW IF NOT EXISTS models
AS
    SELECT mo.id * 1E5 + my.year as id, ma.name as make, mo.id as modelId, mo.name as model, mo.fipeCode, mo.vehicleTypeCode, mo.fuelTypeCode, my.refDate, my.year as modelYear, json('[' || (SELECT group_concat(year) from modelYear WHERE modelYear.modelId = mo.id) || ']') as modelYears, json_extract(my.prices, '$[0]') as price, json_extract(my.deltaPrices, '$[3]') as deltaPrice12M, my.prices, my.deltaPrices
    FROM model as mo
    INNER JOIN make as ma ON mo.makeId = ma.id
    INNER JOIN modelYear as my ON my.modelId = mo.id;

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE fipeTable;
