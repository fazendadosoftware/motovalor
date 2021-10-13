// https://github.com/jepiqueau/vue-sqlite-hook
// https://github.com/capacitor-community/sqlite/blob/f191f413fa8a54654dd31351c609534922843243/docs/Ionic-Vue-Usage.md
// https://github.com/jepiqueau/vue-sqlite-app-starter
/* SQLite imports */
import { defineCustomElements as jeepSqlite, applyPolyfills } from 'jeep-sqlite/loader'
import { Capacitor } from '@capacitor/core'
import { SQLiteConnection, SQLiteDBConnection, CapacitorSQLite } from '@capacitor-community/sqlite'
import { Filesystem, Directory } from '@capacitor/filesystem'
import writeBlob from 'capacitor-blob-writer'
import axios from 'axios'
import AdmZip from 'adm-zip'

const DB_FILE_NAME = 'fipe.db'
const getMigratedFilename = (filename: string) => filename.replace(/.db/, 'SQLite.db')

let initialized: boolean | null = null
let db: SQLiteDBConnection | null = null

// const sqlite = useSQLite()
const sqlite = new SQLiteConnection(CapacitorSQLite)

applyPolyfills().then(() => jeepSqlite(window))

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
  const dbFilePathTokens = uri.split('/')
  const relPath = dbFilePathTokens[dbFilePathTokens.indexOf(filename) - 1]

  const { values: migratableDbList = [] } = await sqlite.getMigratableDbList(relPath)
  if (migratableDbList.indexOf(filename) > 0) await sqlite.addSQLiteSuffix(relPath, [filename])
  else throw Error(`Could not find ${filename} in dbMigratableList: ${migratableDbList.join(', ')}`)
  const migratedFilename = getMigratedFilename(filename)

  const { values: dblist = [] } = await sqlite.getDatabaseList()
  console.log('========================= NEW DATABASE LIST', dblist)
  if (dblist.indexOf(migratedFilename) < 0) throw Error(`could not find ${migratedFilename} in db list: ${dblist.join(', ') || '/none'}`)
  return migratedFilename
}

export interface InitProps {
  syncDatabase?: boolean
}
// https://github.com/capacitor-community/sqlite/blob/master/docs/Ionic-Vue-Usage.md#vue-sqlite-hook-definition
const init = async (props?: InitProps) => {
  // initialized will be false during initialization process
  if (initialized === false) {
    let interval: any
    await new Promise((resolve, reject) => {
      interval = setInterval(async () => {
        if (initialized === true && (await db?.isDBOpen())?.result) {
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
  await sqlite.deleteOldDatabases()
  if (props?.syncDatabase === true) await deleteDatabase(DB_FILE_NAME)
  const platform = Capacitor.getPlatform()
  try {
    if (platform === 'web') {
      await customElements.whenDefined('jeep-sqlite')
      let jeepSqliteEl = document.querySelector('jeep-sqlite')
      if (jeepSqliteEl === null) {
        jeepSqliteEl = document.createElement('jeep-sqlite')
        document.body.appendChild(jeepSqliteEl)
        await sqlite.initWebStore()
      }
    }

    const { values: databaseList = [] } = await sqlite.getDatabaseList().catch(() => ({ values: [] }))
    if (databaseList.indexOf(getMigratedFilename(DB_FILE_NAME)) < 0) await getLocalDb(DB_FILE_NAME)

    const { result: isConsistent = false } = await sqlite.checkConnectionsConsistency()
    const { result: isConn = false } = await sqlite.isConnection(DB_FILE_NAME)

    db = isConsistent && isConn
      ? await sqlite.retrieveConnection(DB_FILE_NAME)
      : await sqlite.createConnection(DB_FILE_NAME, false, 'no-encryption', 1)
    if (!await db.isDBOpen().then(({ result }) => result)) await db.open()
  } finally {
    initialized = true
  }
}

const getInstance = async (): Promise<SQLiteDBConnection> => {
  if (db !== null) return db
  else if (!initialized) await init({ syncDatabase: true })
  if (db === null) throw Error('could not initialize db')
  return db
}

const deleteDatabase = async (databaseName: string) => {
  // first we check if database exists
  const { values: existingDatabases = [] } = await sqlite.getDatabaseList().catch(() => ({ values: [] }))
  if (existingDatabases.indexOf(getMigratedFilename(databaseName)) > -1) {
    const { result: isConsistent = false } = await sqlite.checkConnectionsConsistency()
    const { result: isConn = false } = await sqlite.isConnection(DB_FILE_NAME)
    isConsistent && isConn
      ? await sqlite.retrieveConnection(DB_FILE_NAME)
      : await sqlite.createConnection(DB_FILE_NAME, false, 'no-encryption', 1)
    await CapacitorSQLite.deleteDatabase({ database: databaseName })
  }
}

const useSqlite = () => ({
  getInstance
})

export default useSqlite
