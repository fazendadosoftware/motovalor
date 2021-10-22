import test, { ExecutionContext } from 'ava'
import { join } from 'path'
import { Database } from 'sqlite'
import del from 'del'
import { openDB, updateDatabaseFromRepositoryData, updateDatabaseFromRepositoryData2 } from './sqlite'
import { RepositoryData } from './repository'

const data: RepositoryData = require('../fipe-indexes.json')

const DB_FOLDER = join(__dirname, '..', '.sqlite')
const DB_FILENAME = 'fipe.db'

interface Context {
  db: Database
  // indexes: Indexes
}

test.serial.before(async (t: ExecutionContext<Context>) => { await del([join(DB_FOLDER, DB_FILENAME)]) })

test.before(async (t: ExecutionContext<Context>) => {
  t.context.db = await openDB(join(DB_FOLDER, DB_FILENAME))
  await t.context.db.migrate({ migrationsPath: join(process.cwd(), 'migrations') })
})

test('it builds indexes from repository', async (t: ExecutionContext<Context>) => {
  await updateDatabaseFromRepositoryData(t.context.db, data)
  t.pass()
})

test.only('it builds indexes from repository2', async (t: ExecutionContext<Context>) => {
  await updateDatabaseFromRepositoryData2(t.context.db, data)
  t.pass()
})

test.after((t: ExecutionContext<Context>) => t.context.db.close())
// test.serial.after.skip(async (t: ExecutionContext<Context>) => { await del([DB_PATH]) })
