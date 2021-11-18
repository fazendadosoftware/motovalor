import Realm, { open } from 'realm'
import Fuse from 'fuse.js'
import { FipeTable, Make, Model, ModelYearSchema } from './model'

export interface RepositoryData {
  fipeTables: FipeTable[]
  makes: Make[]
  models: Model[]
  modelYears: ModelYearSchema[]
}

export const openRealm = async (path?: string): Promise<Realm> => {
  const realm = await open({ path, schema: [Make, Model, ModelYearSchema] })
  return realm
}

const windowYearSize = 3
const deltaPriceIndexes = ModelYearSchema.getDeltaMonthIndexesSet(5)

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
        const { prices, deltas } = tableDates
          .reduce((accumulator: { prices: number[], deltaPrices: number[], deltas: number[] }, date, i) => {
            const price = modelYear.prices[date] ?? getPreviousPrice(i, tableDates, modelYear.prices)
            if (price === null) return accumulator
            accumulator.prices.push(price)
            if (deltaPriceIndexes.has(i)) {
              const delta = (accumulator.prices[0] / price) - 1
              accumulator.deltas.push(delta)
              accumulator.deltaPrices.push(accumulator.prices[0] - price)
            }
            return accumulator
          }, { prices: [], deltaPrices: [], deltas: [] })
        modelYear.model = { id: modelYear.modelId }
        modelYear.prices = prices
        modelYear.price = prices[0]

        const deltaFields = ModelYearSchema.getDeltaFields(deltas)
        Object.entries(deltaFields).forEach(([key, value]) => { modelYear[key] = value })
        realm.create<ModelYearSchema>(ModelYearSchema.schema.name, modelYear, Realm.UpdateMode.All)
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
