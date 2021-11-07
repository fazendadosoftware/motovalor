// https://github.com/jepiqueau/vue-sqlite-hook
// https://github.com/capacitor-community/sqlite/blob/f191f413fa8a54654dd31351c609534922843243/docs/Ionic-Vue-Usage.md
// https://github.com/jepiqueau/vue-sqlite-app-starter
/* SQLite imports */
import { defineCustomElements as jeepSqlite, applyPolyfills } from 'jeep-sqlite/loader'
import { Capacitor } from '@capacitor/core'
import { SQLiteConnection, SQLiteDBConnection, CapacitorSQLite } from '@capacitor-community/sqlite'
// ort { Filesystem, Directory } from '@capacitor/filesystem'
// import writeBlob from 'capacitor-blob-writer'
// import axios from 'axios'
// import AdmZip from 'adm-zip'

const DB_FILE_NAME = 'fipe.db'
const getMigratedFilename = (filename: string): string => filename.replace(/.db/, 'SQLite.db')

let initialized: boolean | null = null
let db: SQLiteDBConnection | null = null

// const sqlite = useSQLite()
const sqlite = new SQLiteConnection(CapacitorSQLite)

void applyPolyfills().then(async () => await jeepSqlite(window))

/*
const getLocalDb = async (filename: string): Promise<string> => {
  console.log('============================= GETTING LOCAL DB!!!!', filename)
  let uri: string | null = null;

  ({ uri } = await Filesystem.stat({ path: filename, directory: Directory.Data })
    .catch(() => { return { uri: null } }))
  if (uri === null) {
    const dbEntry = await axios.get('/assets/databases/fipe.db.zip', { responseType: 'arraybuffer' })
      .then(({ data }: { data: any }) => new AdmZip(Buffer.from(data)))
      .then((zip: AdmZip) => zip.getEntry(filename))
    if (dbEntry === null) throw Error(`could not find ${filename} in zip file`)

    uri = await writeBlob({ path: filename, directory: Directory.Data, blob: new Blob([dbEntry.getData()]) })
  }

  if (Capacitor.getPlatform() !== 'web') {
    const dbFilePathTokens = uri.split('/')
    const relPath = dbFilePathTokens[dbFilePathTokens.indexOf(filename) - 1]
    const { values: migratableDbList = [] } = await sqlite.getMigratableDbList(relPath)
    if (migratableDbList.indexOf(filename) > 0) await sqlite.addSQLiteSuffix(relPath, [filename])
    else throw Error(`Could not find ${filename} in dbMigratableList: ${migratableDbList.join(', ')}`)
  }

  const migratedFilename = getMigratedFilename(filename)
  const { values: dblist = [] } = await sqlite.getDatabaseList()
  console.log('========================= NEW DATABASE LIST', dblist)
  if (dblist.indexOf(migratedFilename) < 0) throw Error(`could not find ${migratedFilename} in db list: ${dblist.join(', ') || '/none'}`)
  return migratedFilename
}
*/

const checkIfDbExists = async (dbName: string): Promise<boolean> => {
  const { values: databaseList = [] } = await sqlite.getDatabaseList().catch(() => ({ values: [] }))
  return databaseList.includes(dbName)
}
export interface InitProps {
  syncDatabase?: boolean
}
// https://github.com/capacitor-community/sqlite/blob/master/docs/Ionic-Vue-Usage.md#vue-sqlite-hook-definition
const init = async (props?: InitProps): Promise<void> => {
  // initialized will be false during initialization process
  if (initialized === false) {
    let interval: any
    await new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      interval = setInterval(async () => {
        if (initialized === true && (((await db?.isDBOpen())?.result) ?? false)) {
          clearInterval(interval)
          interval = undefined
          resolve(undefined)
        }
      }, 250)
    })
  }
  if (initialized === true) return
  // if initialized === null then initialize, flag it as false
  initialized = false

  // when using Capacitor, you might want to close existing connections,
  // otherwise new connections will fail when using dev-live-reload
  // see https://github.com/capacitor-community/sqlite/issues/106
  await CapacitorSQLite.checkConnectionsConsistency({ dbNames: [] })
  // the plugin throws an error when closing connections. we can ignore
  // that since it is expected behaviour
    .catch(e => {})
  // delete old databases

  const platform = Capacitor.getPlatform()

  if (platform !== 'web') await sqlite.deleteOldDatabases().catch(() => {})

  try {
    if (platform === 'web') {
      if (document.querySelector('jeep-sqlite') === null) {
        const jeepSqliteEl = document.createElement('jeep-sqlite')
        document.body.appendChild(jeepSqliteEl)
        await sqlite.initWebStore()
      }
    }

    // overwrite existing database if not exists or forced via syncDatabase flag
    if (!await checkIfDbExists(getMigratedFilename(DB_FILE_NAME)) || props?.syncDatabase === true) {
      await sqlite.copyFromAssets(true)
      if (!await checkIfDbExists(getMigratedFilename(DB_FILE_NAME))) throw Error('Could not find database!')
    }

    // if (databaseList.indexOf(getMigratedFilename(DB_FILE_NAME)) < 0) await getLocalDb(DB_FILE_NAME)
    const { result: isConsistent = false } = await sqlite.checkConnectionsConsistency()
    const { result: isConn = false } = await sqlite.isConnection(DB_FILE_NAME)

    db = isConsistent && isConn
      ? await sqlite.retrieveConnection(DB_FILE_NAME)
      : await sqlite.createConnection(DB_FILE_NAME, false, 'no-encryption', 1)
    if (!((await db.isDBOpen().then(({ result }) => result)) ?? false)) await db.open()
  } finally {
    initialized = true
  }
}

const getInstance = async (): Promise<SQLiteDBConnection> => {
  if (db !== null) return db
  else if (!(initialized ?? false)) await init({ syncDatabase: true })
  if (db === null) throw Error('could not initialize db')
  return db
}

const deleteDatabase = async (databaseName: string): Promise<void> => {
  // first we check if database exists
  const { values: existingDatabases = [] } = await sqlite.getDatabaseList().catch(() => ({ values: [] }))
  if (existingDatabases.includes(getMigratedFilename(databaseName))) {
    const { result: isConsistent = false } = await sqlite.checkConnectionsConsistency()
    const { result: isConn = false } = await sqlite.isConnection(DB_FILE_NAME)
    isConsistent && isConn
      ? await sqlite.retrieveConnection(DB_FILE_NAME)
      : await sqlite.createConnection(DB_FILE_NAME, false, 'no-encryption', 1)
    await CapacitorSQLite.deleteDatabase({ database: databaseName })
  }
}

const executeSQL = async <T>(sqlStatement: string, args?: any[]): Promise<T[]> => {
  const db = await getInstance()
  const { values, error = null }: { values: T[], error: any } = await db.query(sqlStatement, args)
    .then(({ values = [] }) => ({ values, error: null }))
    .catch(error => ({ values: [], error }))
  if (error !== null) throw error
  return values
}

export interface IUseSqlite {
  getInstance: () => Promise<SQLiteDBConnection>
  executeSQL: <T>(sqlStatement: string, args?: any[]) => Promise<T[]>
}

const useSqlite = (): IUseSqlite => ({
  getInstance,
  executeSQL
})

export default useSqlite
