import Realm, { open } from 'realm'
import Fuse from 'fuse.js'
import { FipeTableSchema, MakeSchema, ModelSchema, ModelYearSchema } from './schema'

export interface RepositoryData {
  fipeTables: FipeTableSchema[]
  models: ModelSchema[]
  modelYears: ModelYearSchema[]
}

export const openRealm = async (path?: string): Promise<Realm> => {
  const realm = await open({ path, schema: [FipeTableSchema, MakeSchema, ModelSchema, ModelYearSchema] })
  return realm
}

export const updateDatabaseFromData = async (realm: Realm, data: RepositoryData) => {
  const { fipeTables, models, modelYears } = data
  realm.beginTransaction()
  try {
    fipeTables
      .forEach(fipeTable => realm.create<FipeTableSchema>(FipeTableSchema.schema.name, fipeTable, Realm.UpdateMode.All))
    models
      .forEach(model => realm.create<ModelSchema>(ModelSchema.schema.name, model, Realm.UpdateMode.All))
    modelYears
      .forEach(modelYear => realm.create<ModelYearSchema>(ModelYearSchema.schema.name, modelYear, Realm.UpdateMode.All))
    realm.commitTransaction()
  } catch (error) {
    realm.cancelTransaction()
    throw error
  }
}

export const buildFTSIndexFromDatabase = async (realm: Realm) => {
  const models = realm.objects(ModelSchema.name)
    .map(model => model.toJSON())
    .map(model => ({ ...model, modelYears: Object.keys(model.modelYears) }))
  return Fuse.createIndex(['make', 'name', 'modelYears'], models).toJSON()
}
