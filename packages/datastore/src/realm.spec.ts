import test, { ExecutionContext } from 'ava'
import Realm from 'realm'
import { join } from 'path'
import { existsSync, mkdirSync, rmdirSync } from 'fs'
import { v4 as uuidv4 } from 'uuid'
import { openRealm, updateDatabaseFromData, RepositoryData } from './realm'
import { buildIndexesFromRepository } from './repository'
import { FipeTableSchema, ModelSchema, ModelYearSchema } from './schema'

const DATAPATH = join(__dirname, '..', '.tmp', uuidv4())
const REALM_FILENAME = 'fipe.realm'

interface Context {
  realm: Realm
  emptyData: RepositoryData
  data: RepositoryData
}

test.before(async (t: ExecutionContext<Context>) => {
  if (!existsSync(DATAPATH)) mkdirSync(DATAPATH, { recursive: true })
  t.context.realm = await openRealm(join(DATAPATH, REALM_FILENAME))
})

test.before(async (t: ExecutionContext<Context>) => {
  t.context.data = await buildIndexesFromRepository()
  t.context.emptyData = { fipeTables: [], models: [], modelYears: [] }
})

test.serial('it initializes the db with schema and empty collections', async (t: ExecutionContext<Context>) => {
  await updateDatabaseFromData(t.context.realm, t.context.emptyData)
  const fipeTableCount = t.context.realm.objects(FipeTableSchema.schema.name).length
  const modelCount = t.context.realm.objects(ModelSchema.schema.name).length
  const modelYearCount = t.context.realm.objects(ModelYearSchema.schema.name).length
  t.assert(fipeTableCount === t.context.emptyData.fipeTables.length)
  t.assert(modelCount === t.context.emptyData.models.length)
  t.assert(modelYearCount === t.context.emptyData.modelYears.length)
  t.pass()
})

test.serial('it updates database from indexes file', async (t: ExecutionContext<Context>) => {
  await updateDatabaseFromData(t.context.realm, t.context.data)
  const fipeTableCount = t.context.realm.objects(FipeTableSchema.schema.name).length
  const modelCount = t.context.realm.objects(ModelSchema.schema.name).length
  const modelYearCount = t.context.realm.objects(ModelYearSchema.schema.name).length
  t.assert(fipeTableCount === t.context.data.fipeTables.length)
  t.assert(modelCount === t.context.data.models.length)
  t.assert(modelYearCount === t.context.data.modelYears.length)
  t.pass()
})

test.after((t: ExecutionContext<Context>) => {
  t.context.realm.close()
  rmdirSync(DATAPATH, { recursive: true })
})
