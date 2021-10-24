import { Index, IndexOptions } from 'flexsearch'
import { VModel } from '../composables/useFipe'

let ftsIndex = new Index('match')
let _models: VModel[] = []
let modelIndex: Record<string, VModel> = {}

export const setCollection = (models: VModel[]): VModel[] => {
  ftsIndex = new Index('match')
  _models = models
  modelIndex = {}
  console.log('models', models)
  models
    .forEach(model => {
      const { modelId, make, model: name , modelYear, fuelTypeCode } = model
      if (modelId === undefined || modelYear === undefined) throw Error(`undefined modelId: ${JSON.stringify(model)}`)
      model._key = `${modelId}#${modelYear}`
      const item = `${make} ${name} ${fuelTypeCode} ${modelYear}`
      ftsIndex.add(model._key, item)
      modelIndex[model._key] = model
    })
  return models
}

export const search = (searchQuery: string, limit: number = 100): VModel[] => {
  if (!searchQuery) return _models
  const filteredModels = ftsIndex.search(searchQuery, limit)
    .map(entryId => modelIndex[entryId])
  return filteredModels
}
