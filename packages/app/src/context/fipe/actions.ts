// @ts-ignore
import zipFile from '../../assets/fipe.zip'
import RNFS from 'react-native-fs'
import { Image } from 'react-native'
import { unzip } from 'react-native-zip-archive'
import Realm from 'realm'
import debounce from 'lodash.debounce'
import { IFipeActions, IFipeReducer, FipeActionType, IModelYearFilter, Make, ModelYear } from './types.d'

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

const getFilterQuery = (modelYearFilter: IModelYearFilter, limit?: number) => {
  const { zeroKm, vehicleTypeIds, makeIndex } = modelYearFilter
  const makeIds = Object.values(makeIndex).map(({ id }) => id)

  const query = []
  // 0km
  query.push(zeroKm ? 'year == 32000' : 'year != 32000')
  // vehicleTypeIds
  if (vehicleTypeIds.size < 3 && vehicleTypeIds.size > 0) query.push(`(${[...vehicleTypeIds].map(id => `model.vehicleTypeCode == ${id}`).join(' OR ')})`)
  // makes
  // if (makeIds.length > 0) query.push(`model.make.id in ${JSON.stringify(makeIds)}`)
  if (makeIds.length > 0) query.push(`(${makeIds.map(id => `model.make.id == ${id}`).join(' OR ')})`)
  // limit

  let _query = query.join(' AND ')
  if (typeof limit === 'number') _query += ` LIMIT(${limit})`
  return _query
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

export const fetchModelYears = async (reducer: IFipeReducer, options?: FetchMakesOptions) => {
  const { sorted = 'model.name' } = options ?? {}
  const realm = await openRealm()
  const modelYears = realm?.objects(ModelYear.schema.name).sorted(sorted).toJSON() as ModelYear[]
  realm.close()
  return modelYears
}

export const fetchFilteredModelYears = async (reducer: IFipeReducer, modelYearFilter: IModelYearFilter) => {
  const query = getFilterQuery(modelYearFilter, 100)
  console.log('FETCHING', query, modelYearFilter)
  const realm = await openRealm()
  const modelYears = realm?.objects(ModelYear.schema.name).filtered(query).sorted('model.name').toJSON() as ModelYear[]
  realm.close()
  return modelYears
}
// const debouncedFetchFilteredModelYears = debounce(fetchFilteredModelYears, 1000) as (reducer: IFipeReducer) => Promise<ModelYear[]>

export const setModelYearFilter = async (reducer: IFipeReducer, modelYearFilter: IModelYearFilter) => {
  reducer.dispatch?.({ type: FipeActionType.SetModelYearFilter, payload: modelYearFilter })
}

export const resetModelYearFilter = async (reducer: IFipeReducer) => reducer.dispatch?.({ type: FipeActionType.ResetModelYearFilter, payload: null })

export const resetModelYearFilterMakes = async (reducer: IFipeReducer) => reducer.dispatch?.({ type: FipeActionType.ResetModelYearFilter, payload: null })

const getActions: (reducer: IFipeReducer) => IFipeActions = reducer => ({
  openRealm,
  initContext: () => initContext(reducer),
  setModelYearFilter: (modelYearFilter: IModelYearFilter) => setModelYearFilter(reducer, modelYearFilter),
  resetModelYearFilter: () => resetModelYearFilter(reducer),
  resetModelYearFilterMakes: () => resetModelYearFilterMakes(reducer),
  fetchMakes: ({ query, sorted }: { query?: string, sorted?: string} = {}) => fetchMakes(reducer, { query, sorted }),
  // fetchFilteredModelYears: () => debouncedFetchFilteredModelYears(reducer)
  fetchFilteredModelYears: (modelYearFilter: IModelYearFilter) => fetchFilteredModelYears(reducer, modelYearFilter)
})

export default getActions
