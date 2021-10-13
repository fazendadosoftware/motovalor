// https://github.com/jepiqueau/vue-sqlite-hook
// https://github.com/capacitor-community/sqlite/blob/f191f413fa8a54654dd31351c609534922843243/docs/Ionic-Vue-Usage.md
// https://github.com/jepiqueau/vue-sqlite-app-starter
/* SQLite imports */
import { defineCustomElements as jeepSqlite, applyPolyfills } from 'jeep-sqlite/loader'
import { Capacitor } from '@capacitor/core'
import { SQLiteConnection, SQLiteDBConnection, CapacitorSQLite } from '@capacitor-community/sqlite'
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem'
import writeBlob from 'capacitor-blob-writer'
import axios from 'axios'
import AdmZip from 'adm-zip'

import { useSQLite } from 'vue-sqlite-hook/dist'

const DB_FILE_NAME = 'fipe.db'

let initialized: boolean | null = null
let db: SQLiteDBConnection | null = null

const sqlite = useSQLite()

const _sqlite = new SQLiteConnection(CapacitorSQLite)

applyPolyfills().then(() => jeepSqlite(window))

const getLocalDbFileUri = async (filename: string): Promise<string> => {
  console.log('GETTING LOCAL DB')
  let uri: string | null = null;

  ({ uri } = await Filesystem.stat({ path: filename, directory: Directory.Data })
    .catch(() => { return { uri: null } }))

  if (uri === null) {
    console.log('DOWNLOADING FILE')

    const dbEntry = await axios.get('/assets/databases/fipe.db.zip', { responseType: 'arraybuffer' })
      .then(({ data }: { data: any }) => new AdmZip(Buffer.from(data)))
      .then((zip: AdmZip) => zip.getEntry(filename))
    if (dbEntry === null) throw Error(`could not find ${filename} in zip file`)

    uri = await writeBlob({ path: filename, directory: Directory.Data, blob: new Blob([dbEntry.getData()]) })
  }
  console.log('URI FILE ====>>>', uri)
  const dbFilePathTokens = uri.split('/')
  const relPath = dbFilePathTokens[dbFilePathTokens.indexOf(filename) - 1]
  // const relPath = dbFilePathTokens.slice(indexOfFilename - 1, indexOfFilename).join('/')
  console.log('DB FILE RELATIVE', relPath)
  const { result } = await sqlite.isDatabase('fipeSQLite.db')
  if (result === false) {
    // @ts-ignore
    await sqlite.addSQLiteSuffix(relPath)
    const { result } = await sqlite.isDatabase('fipeSQLite.db')
    console.log('NO FIPE SLQITE????', result)
  } else {
    console.log('DB EXISTS!!!!!')
  }
  return relPath
}

// https://github.com/capacitor-community/sqlite/blob/master/docs/Ionic-Vue-Usage.md#vue-sqlite-hook-definition
const init = async () => {
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
    const { uri } = await Filesystem.writeFile({ path: 'test_file', data: 'hello', directory: Directory.Data, encoding: Encoding.UTF8 })
    console.log('FILE SAVED HERE', uri)
    await getLocalDbFileUri(DB_FILE_NAME)
    /*
    const resJson = await sqlite.importFromJson(JSON.stringify(dbSchema))
    if (resJson.changes && resJson.changes.changes && resJson.changes.changes < 0) {
      throw new Error('importFromJson: "full" failed')
    }
    */
    const dir = await Filesystem.readdir({ path: '', directory: Directory.Cache })
    console.log('DIR', dir)
  } finally {
    initialized = true
  }
}

const getInstance = async (): Promise<SQLiteDBConnection> => {
  const dbName = 'fipe'
  if (db !== null) return db
  else if (!initialized) await init()
  const { result: isConsistent } = await sqlite.checkConnectionsConsistency()
  const { result: isConn } = await sqlite.isConnection(dbName)
  db = isConsistent && isConn
    ? await sqlite.retrieveConnection(dbName)
    : await sqlite.createConnection(dbName, false, 'no-encryption', 1)
  if (!await db.isDBOpen().then(({ result }) => result)) await db.open()
  return db
}

const close = async () => {
  if (db !== null) {
    await db.close()
    db = null
  }
}

const useSqlite = () => ({
  init,
  getInstance,
  close
})

export default useSqlite
