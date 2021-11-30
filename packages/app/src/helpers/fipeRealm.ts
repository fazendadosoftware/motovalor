// @ts-expect-error
import zipFile from '../assets/fipe.zip'
import RNFS from 'react-native-fs'
import { Image } from 'react-native'
import { unzip } from 'react-native-zip-archive'
import Realm from 'realm'
import { Make, Model, ModelYear } from '../hooks/useFipeState'

const ARCHIVE_FILENAME = 'fipe.zip'
const DATABASE_FILENAME = 'fipe.realm'
const ARCHIVE_FILE = `${RNFS.CachesDirectoryPath}/${ARCHIVE_FILENAME}`
const DATABASE_FILE = `${RNFS.DocumentDirectoryPath}/${DATABASE_FILENAME}`

export const databaseExists = async () => {
  const { uri: fileUri } = Image.resolveAssetSource(zipFile)
  const [, assetHash = null] = fileUri.match(/[?&]hash=([^&]+).*$/) ?? []
  return await RNFS.exists(ARCHIVE_FILE) && (assetHash === await RNFS.hash(ARCHIVE_FILE, 'md5') && await RNFS.exists(DATABASE_FILE))
}

export const loadDatabaseFromAssets = async () => {
  const { uri: fileUri } = Image.resolveAssetSource(zipFile)
  fileUri.startsWith('file://')
    ? await RNFS.copyFile(fileUri, ARCHIVE_FILE)
    : await RNFS.downloadFile({ fromUrl: fileUri, toFile: ARCHIVE_FILE }).promise
  await unzip(ARCHIVE_FILE, RNFS.DocumentDirectoryPath)
  if (!await RNFS.exists(DATABASE_FILE)) throw Error(`could not open database file ${DATABASE_FILE}`)
}

export const openRealm = async (): Promise<Realm> => {
  if (!await databaseExists()) await loadDatabaseFromAssets()
  const realm = await Realm.open({ path: DATABASE_FILENAME, schema: [Make, Model, ModelYear], readOnly: true })
  if (realm === null) throw Error('could not open db')
  return realm
}

export const closeRealm = (realm: Realm | null) => {
  realm?.close()
  realm = null
}

export default { openRealm, closeRealm }
