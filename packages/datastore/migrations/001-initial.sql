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
  fuelTypeCode      TEXT CHECK(fuelTypeCode IN ('G','D','A')) NOT NULL
);

CREATE TABLE IF NOT EXISTS modelYear (
  modelId           INTEGER NOT NULL,
  year              INTEGER NOT NULL,
  prices            JSON NOT NULL,
  PRIMARY KEY (modelId, year)
);


-- INSERT INTO fipeTable (id, refDate) VALUES (1, '2021-10-01');
-- INSERT INTO make (id, name) VALUES (1, 'HARLEY DAVIDSON');
-- INSERT INTO model (id, makeId, vehicleTypeCode, name, fipeCode, fuelTypeCode, prices) VALUES (1, 1, 2, 'FAT BOY', '000000-1', 'G', json('{"2011": {"2021-10": 40000}}'));
-- INSERT INTO model (id, makeId, vehicleTypeCode, name, fipeCode, fuelTypeCode, prices) VALUES (2, 1, 2, 'ROCKER C', '000000-2', 'G', json('{"2011": {"2021-10": 50000}}'));

-- select name, json_extract(model.prices, '$.2011.2021-10') from model
-- where json_extract(model.prices, '$.2011.2021-10') > 45000

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE fipeTable;
