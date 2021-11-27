// @ts-ignore
import zipFile from '../../assets/fipe.zip'
import { IModelYearFilter, Make } from '../../types.d'
import RNFS from 'react-native-fs'
import { Image } from 'react-native'
import { unzip } from 'react-native-zip-archive'
import Realm from 'realm'
import { IFipeActions, IFipeReducer, FipeActionType } from './types.d'

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
  const realm = await Realm.open({ path: DATABASE_FILENAME, schema: [], readOnly: true })
  if (realm === null) throw Error('could not open db')
  return realm
}

export const initContext = async (reducer: IFipeReducer) => {
  const makes = await fetchMakes(reducer)
  reducer.dispatch?.({ type: FipeActionType.SetMakes, payload: makes })
}

export interface FetchMakesOptions {
  query?: string
  sorted?: string
}

export const fetchMakes = async (reducer: IFipeReducer, options?: FetchMakesOptions) => {
  const { sorted = 'name' } = options ?? {}
  const realm = await openRealm()
  const makes = realm?.objects(Make.schema.name).sorted(sorted).toJSON() as Make[]
  realm.close()
  return makes
}


export const setModelYearFilter = async (reducer: IFipeReducer, modelYearFilter: IModelYearFilter | null) => {
  const type = modelYearFilter === null ? FipeActionType.ResetModelYearFilter : FipeActionType.SetModelYearFilter
  reducer.dispatch?.({ type, payload: modelYearFilter })
}

const getActions: (reducer: IFipeReducer) => IFipeActions = reducer => ({
  openRealm,
  initContext: () => initContext(reducer),
  setModelYearFilter: (modelYearFilter: IModelYearFilter | null) => setModelYearFilter(reducer, modelYearFilter),
  fetchMakes: ({ query, sorted }: { query?: string, sorted?: string} = {}) => fetchMakes(reducer, { query, sorted })
})

export default getActions
