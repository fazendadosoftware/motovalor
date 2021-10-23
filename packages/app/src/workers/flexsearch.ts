import { Index } from 'flexsearch'
import { VModel } from '../composables/useFipe'

let ftsIndex = new Index()
let _models: VModel[] = []
let modelIndex: Record<string, Record<string, VModel>> = {}

export const setCollection = (models: VModel[]) => {
  ftsIndex = new Index()
  _models = models
  modelIndex = {}
  models
    .forEach(model => {
      model?.modelYears
        ?.forEach(modelYear => {
          const { modelId } = model
          if (modelId === undefined) throw Error(`undefined modelId: ${JSON.stringify(model)}`)
          const entry = { id: `${modelId}#${modelYear}`, item: `${model.make} ${model.model} ${modelYear}`}
          if (!modelIndex[modelId]) modelIndex[modelId] = {}
          modelIndex[modelId][modelYear] = model
          ftsIndex.add(entry.id, entry.item)
        })
    })
}

export const search = (searchQuery: string, limit: number = 100) => {
  if (!searchQuery) return _models.slice(0, limit)
  const filteredModels = Object.values(ftsIndex.search(searchQuery, limit)
    .reduce((accumulator: Record<string, VModel>, entryId) => {
      // @ts-expect-error
      const [modelId, modelYear] = entryId.split('#')
      const model = modelIndex[modelId][modelYear]
      model.modelYear = parseInt(modelYear)
      if (!accumulator[modelId]) {
        delete model.modelYear
        accumulator[modelId] = { ...model, modelYears: [] }
      }
      accumulator[modelId]?.modelYears?.push(modelYear)
      return accumulator
    }, {}))
  return filteredModels
}
