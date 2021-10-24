import * as sqlite3 from 'sqlite3'
import { open, Database } from 'sqlite'
import { RepositoryData } from './repository'
import { FipeTable, Make, Model, ModelYear } from './model'

export const openDB = async (dbPath: string): Promise<Database> => open({ filename: dbPath, driver: sqlite3.cached.Database })

const getDeltaMonthIndexesSet = (windowYearSize: number) => new Set([...Array(Math.ceil(windowYearSize)).keys()]
  .map(year => year === 0 ? [1, 3, 6] : year * 12).flat())

export const updateDatabaseFromRepositoryData = async (db: Database, data: RepositoryData) => {
  const rawDb = db.getDatabaseInstance()

  // previous 24M table dates
  const windowYearSize = 3
  const deltaPriceIndexes = getDeltaMonthIndexesSet(5)

  const tableDates = data.fipeTables.map(({ date }) => date)
    .sort()
    .reverse()
    .slice(0, windowYearSize * 12 + 1)

  const refDate = tableDates[0]
  const mappedModelYears = data.modelYears
    .filter(modelYear => !isNaN(modelYear.prices[tableDates[0]])) // filter modelYears with price listing for the latest table...
    .map(modelYear => {
      const { prices, deltaPrices } = tableDates
        .reduce((accumulator: { prices: number[], deltaPrices: number[] }, date, i) => {
          const price = modelYear.prices[date]
          accumulator.prices.push(price)
          if (deltaPriceIndexes.has(i)) accumulator.deltaPrices.push(accumulator.prices[0] - price)
          return accumulator
        }, { prices: [], deltaPrices: [] })
      return { ...modelYear, refDate, prices, deltaPrices }
    })

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
    const keys = modelYearKeys.join(',')
    const jsonKeys = ModelYear.getJsonKeys()
    const values = modelYearKeys.map(key => jsonKeys.indexOf(key) < 0 ? '?' : 'json(?)')
    const query = `INSERT INTO modelYear (${keys}) VALUES (${values})`
    const stmt = rawDb.prepare(query)
    mappedModelYears.forEach(row => stmt.run(...modelYearKeys.map(key => jsonKeys.indexOf(key) < 0 ? row[key] : JSON.stringify(row[key]))))
    stmt.finalize()
  })
}
