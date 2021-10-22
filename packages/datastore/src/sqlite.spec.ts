import test, { ExecutionContext } from 'ava'
import { join } from 'path'
import { writeFileSync } from 'fs'
import { Database } from 'sqlite'
import del from 'del'
import { openDB, updateDatabaseFromRepositoryData, getSchema, getIndexes, getTriggers, getValues } from './sqlite'
import { RepositoryData } from './repository'

const data: RepositoryData = require('../fipe-indexes.json')

const DB_FOLDER = join(__dirname, '..', '.sqlite')
const DB_FILENAME = 'fipe.db'

interface Context {
  db: Database
  // indexes: Indexes
}

// test.serial.before(async (t: ExecutionContext<Context>) => { await del([join(DB_FOLDER, DB_FILENAME)]) })
test.before(async (t: ExecutionContext<Context>) => {
  t.context.db = await openDB(join(DB_FOLDER, DB_FILENAME))
  await t.context.db.migrate({ migrationsPath: join(process.cwd(), 'migrations') })
})

test('it builds indexes from repository', async (t: ExecutionContext<Context>) => {
  await updateDatabaseFromRepositoryData(t.context.db, data)
  t.pass()
})

// https://stackoverflow.com/questions/4060475/parsing-sql-create-table-statement-using-jquery
// https://github.com/capacitor-community/sqlite/blob/master/android/src/main/java/com/getcapacitor/community/database/sqlite/SQLite/ImportExportJson/ExportToJson.java
// https://github.com/jepiqueau/vue-sqlite-app-starter/blob/main/src/utils/utils-import-from-json.ts
test.only('it export database as json', async (t: ExecutionContext<Context>) => {
  const { db } = t.context

  // get schema
  const schema = await getSchema(db)
  const indexes = await Promise.all(schema.map(async ({ name }) => await getIndexes(db, name)))
  const triggers = await Promise.all(schema.map(async ({ name }) => await getTriggers(db, name)))
  const values = await Promise.all(schema.map(async ({ name }) => await getValues(db, name)))
  const tables = schema.map((schema, i) => ({ ...schema, indexes: indexes[i], triggers: triggers[i], values: values[i] }))
  const data = {
    database: 'fipe',
    version: 1,
    encrypted: false,
    mode: 'full',
    tables
  }
  writeFileSync(join(DB_FOLDER, 'fipe.json'), JSON.stringify(data))
  t.pass()
})

test.after((t: ExecutionContext<Context>) => t.context.db.close())
// test.serial.after.skip(async (t: ExecutionContext<Context>) => { await del([DB_PATH]) })
