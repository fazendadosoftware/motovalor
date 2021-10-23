import Fuse from 'fuse.js'
import { VModel } from '../composables/useFipe'

const ftsIndex = new Fuse<VModel>([], { keys: ['model', 'make'], threshold: 0.5, ignoreLocation: true })
let collection: VModel[] = []

export const setCollection = (models: VModel[]) => {
  console.log('SETTING INDEX')
  collection = models
  ftsIndex.setCollection(models)
  console.log('DONE INDEX')
}

export const search = (searchQuery: string, limit: number = 100) => searchQuery ? ftsIndex.search(searchQuery, { limit }).map(({ item }) => item) : collection.slice(0, limit)
