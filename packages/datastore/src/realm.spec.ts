import anyTest, { TestInterface } from 'ava'
import Realm from 'realm'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { openRealm, updateDatabaseFromData, RepositoryData } from './realm'
// import { buildIndexesFromRepository } from './repository'
import { FipeTable, Model, ModelYear } from './model'

const test = anyTest as TestInterface<{ realm: Realm, emptyData: RepositoryData, data: RepositoryData }>
const data: RepositoryData = require('../fipe-indexes.json')

// const DATAPATH = join(__dirname, '..', '.tmp', uuidv4())
const DATAPATH = join(__dirname, '..', '.realm')
const REALM_FILENAME = 'fipe.realm'

test.before(async t => {
  if (!existsSync(DATAPATH)) mkdirSync(DATAPATH, { recursive: true })
  t.context.realm = await openRealm(join(DATAPATH, REALM_FILENAME))
})

test.before(async t => {
  t.context.data = data
})

test.skip('it initializes the db with schema and empty collections', async t => {
  await updateDatabaseFromData(t.context.realm, t.context.emptyData)
  const fipeTableCount = t.context.realm.objects(FipeTable.schema.name).length
  const modelCount = t.context.realm.objects(Model.schema.name).length
  const modelYearCount = t.context.realm.objects(ModelYear.schema.name).length
  t.assert(fipeTableCount === t.context.emptyData.fipeTables.length)
  t.assert(modelCount === t.context.emptyData.models.length)
  t.assert(modelYearCount === t.context.emptyData.modelYears.length)
  t.pass()
})

test.serial('it updates database from indexes file', async t => {
  await updateDatabaseFromData(t.context.realm, t.context.data)
  // const fipeTableCount = t.context.realm.objects(FipeTable.schema.name).length
  const modelCount = t.context.realm.objects(Model.schema.name).length
  // const modelYearCount = t.context.realm.objects(ModelYearSchema.schema.name).length
  // t.assert(fipeTableCount === t.context.data.fipeTables.length)
  t.assert(modelCount === t.context.data.models.length)
  // t.assert(modelYearCount === t.context.data.modelYears.length)
  t.pass()
})

test.after(t => {
  t.context.realm.compact()
  t.context.realm.close()
})
