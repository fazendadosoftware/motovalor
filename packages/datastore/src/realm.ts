import Realm, { open } from 'realm'
import Fuse from 'fuse.js'
import { FipeTable, Make, Model, ModelYear } from './model'

export interface RepositoryData {
  fipeTables: FipeTable[]
  makes: Make[]
  models: Model[]
  modelYears: ModelYear[]
}

export const openRealm = async (path?: string): Promise<Realm> => {
  const realm = await open({ path, schema: [FipeTable, Make, Model, ModelYear] })
  return realm
}

const getDeltaMonthIndexesSet = (windowYearSize: number) => new Set([...Array(Math.ceil(windowYearSize)).keys()]
  .map(year => year === 0 ? [1, 3, 6] : year * 12).flat())

const windowYearSize = 3
const deltaPriceIndexes = getDeltaMonthIndexesSet(5)

export const updateDatabaseFromData = async (realm: Realm, data: RepositoryData) => {
  const { fipeTables, makes, models, modelYears } = data

  const tableDates = fipeTables.map(({ date }) => date)
    .sort()
    .reverse()
    .slice(0, windowYearSize * 12 + 1)

  realm.beginTransaction()
  try {
    makes
      .forEach(make => realm.create<Make>(Make.schema.name, make, Realm.UpdateMode.All))
    models
      .forEach(model => {
        model.make = { id: model.makeId }
        realm.create<Model>(Model.schema.name, model, Realm.UpdateMode.All)
      })

    const getPreviousPrice = (i: number, tableDates: number[], modelYearPrices: Record<number, number>) => {
      if (modelYearPrices[tableDates[i]] === undefined && (i + 1) < tableDates.length) return getPreviousPrice(i + 1, tableDates, modelYearPrices)
      else return modelYearPrices[tableDates[i]] ?? null
    }

    modelYears
      .filter(modelYear => !isNaN(modelYear.prices[tableDates[0]])) // filter modelYears with price listing for the latest table...
      .forEach(modelYear => {
        const { prices, deltaPrices } = tableDates
          .reduce((accumulator: { prices: number[], deltaPrices: number[] }, date, i) => {
            let price = modelYear.prices[date]
            if (price === undefined) {
              price = getPreviousPrice(i, tableDates, modelYear.prices)
              if (price === null) {
                console.log('no previous price')
                return accumulator
              }
            }
            accumulator.prices.push(price)
            if (deltaPriceIndexes.has(i)) accumulator.deltaPrices.push(accumulator.prices[0] - price)
            return accumulator
          }, { prices: [], deltaPrices: [] })
        modelYear.model = { id: modelYear.modelId }
        modelYear.prices = prices
        modelYear.deltaPrices = deltaPrices
        realm.create<ModelYear>(ModelYear.schema.name, modelYear, Realm.UpdateMode.All)
      })
    realm.commitTransaction()
  } catch (error) {
    realm.cancelTransaction()
    throw error
  }
}

export const buildFTSIndexFromDatabase = async (realm: Realm) => {
  const models = realm.objects(Model.name)
    .map(model => model.toJSON())
    .map(model => ({ ...model, modelYears: Object.keys(model.modelYears) }))
  return Fuse.createIndex(['make', 'name', 'modelYears'], models).toJSON()
}
