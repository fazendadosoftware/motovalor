import * as sqlite3 from 'sqlite3'
import { open, Database } from 'sqlite'
import { RepositoryData } from './repository'
import { FipeTable, Make, Model, ModelYear } from './model'

export const openDB = async (dbPath: string): Promise<Database> => open({ filename: dbPath, driver: sqlite3.cached.Database })

export const updateDatabaseFromRepositoryData = async (db: Database, data: RepositoryData) => {
  const rawDb = db.getDatabaseInstance()
  rawDb.parallelize(() => {
    const fipeTableKeys = Object.keys(new FipeTable())
    const query = `INSERT INTO fipeTable (${fipeTableKeys.join(',')}) VALUES (${fipeTableKeys.map(() => '?').join(',')})`
    const stmt = rawDb.prepare(query)
    data.fipeTables.forEach(row => {
      const values = fipeTableKeys.map(key => row[key])
      stmt.run(...values)
    })
    stmt.finalize()
  })

  rawDb.parallelize(() => {
    const makeKeys = Make.getKeys()
    const query = `INSERT INTO make (${makeKeys.join(',')}) VALUES (${makeKeys.map(() => '?').join(',')})`
    const stmt = rawDb.prepare(query)
    data.makes.forEach(row => stmt.run(...makeKeys.map(key => row[key])))
    stmt.finalize()
  })

  rawDb.parallelize(() => {
    const modelKeys = Model.getKeys()
    const query = `INSERT INTO model (${modelKeys.join(',')}) VALUES (${modelKeys.map(() => '?').join(',')})`
    const stmt = rawDb.prepare(query)
    data.models.forEach(row => stmt.run(...modelKeys.map(key => row[key])))
    stmt.finalize()
  })

  rawDb.parallelize(() => {
    const modelYearKeys = ModelYear.getKeys()
    const query = `INSERT INTO modelYear (${modelYearKeys.join(',')}) VALUES (${modelYearKeys.map(() => '?').join(',')})`
    const stmt = rawDb.prepare(query)
    data.modelYears.forEach(row => stmt.run(...modelYearKeys.map(key => key !== 'prices' ? row[key] : JSON.stringify(row[key]))))
    stmt.finalize()
  })
}
