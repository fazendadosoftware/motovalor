// @ts-expect-error
import zipFile from '../assets/fipe.zip'
import { useEffect } from 'react'
import RNFS from 'react-native-fs'
import { Image } from 'react-native'
import { unzip } from 'react-native-zip-archive'
import Realm from 'realm'
import { Make, ModelYear } from 'datastore/src/model'

const ARCHIVE_FILENAME = 'fipe.zip'
const DATABASE_FILENAME = 'fipe.realm'
const ARCHIVE_FILE = `${RNFS.CachesDirectoryPath}/${ARCHIVE_FILENAME}`
const DATABASE_FILE = `${RNFS.DocumentDirectoryPath}/${DATABASE_FILENAME}`

let realm: Realm | null = null
let isSyncing: boolean = false

const databaseExists = async () => {
  const { uri: fileUri } = Image.resolveAssetSource(zipFile)
  const [, assetHash = null] = fileUri.match(/[?&]hash=([^&]+).*$/) ?? []
  return await RNFS.exists(ARCHIVE_FILE) && (assetHash === await RNFS.hash(ARCHIVE_FILE, 'md5') && await RNFS.exists(DATABASE_FILE))
}

const loadDatabaseFromAssets = async () => {
  const { uri: fileUri } = Image.resolveAssetSource(zipFile)
  fileUri.startsWith('file://')
    ? await RNFS.copyFile(fileUri, ARCHIVE_FILE)
    : await RNFS.downloadFile({ fromUrl: fileUri, toFile: ARCHIVE_FILE }).promise
  await unzip(ARCHIVE_FILE, RNFS.DocumentDirectoryPath)
  if (!await RNFS.exists(DATABASE_FILE)) throw Error(`could not open database file ${DATABASE_FILE}`)
}

const getInstance = async (): Promise<Realm> => {
  if (realm !== null) return realm
  else if (isSyncing) {
    await new Promise(resolve => {
      let interval: any
      interval = setInterval(() => {
        if (!isSyncing) {
          clearInterval(interval)
          interval = undefined
          resolve(undefined)
        }
      }, 500)
    })
  } else {
    isSyncing = true
    try {
      if (!await databaseExists()) await loadDatabaseFromAssets()
      realm = await Realm.open({ path: DATABASE_FILENAME, schema: [], readOnly: true })
    } finally {
      isSyncing = false
    }
  }
  if (realm === null) throw Error('could not open db')
  return realm
}

const close = async () => { if (!realm?.isClosed) realm?.close(); realm = null }

const useRealm = () => {
  useEffect(() => { getInstance() }, [])

  return {
    getInstance,
    close
  }
}

export default useRealm
