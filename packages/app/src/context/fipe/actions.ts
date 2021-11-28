// @ts-ignore
import zipFile from '../../assets/fipe.zip'
import RNFS from 'react-native-fs'
import { Image } from 'react-native'
import { unzip } from 'react-native-zip-archive'
import Realm from 'realm'
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

let realm: Realm | null = null

export const openRealm = async (): Promise<Realm> => {
  if (realm !== null) return realm
  if (!await databaseExists()) await loadDatabaseFromAssets()
  realm = await Realm.open({ path: DATABASE_FILENAME, schema: [], readOnly: true })
  if (realm === null) throw Error('could not open db')
  return realm
}

export const closeRealm = () => {
  realm?.close()
  realm = null
}

export const initContext = async (reducer: IFipeReducer) => {
  const { fetchMakes } = getActions(reducer)
  await Promise.all([
    new Promise(resolve => {
      const makeIndex = new Map<number, Make>()
      const makes = [...fetchMakes().sorted('name')]
      makes.forEach(make => makeIndex.set(make.id, make))
      reducer.dispatch?.({ type: FipeActionType.SetMakeIndex, payload: makeIndex })
      resolve(null)
    })
  ])
  reducer.dispatch?.({ type: FipeActionType.SetIsInitialized, payload: true })
}

const getModelYearFilterQuery = (modelYearFilter: IModelYearFilter, limit?: number) => {
  const { zeroKm, vehicleTypeIds, makeIds } = modelYearFilter

  const query = []
  // 0km
  query.push(zeroKm ? 'year == 32000' : 'year != 32000')
  // vehicleTypeIds
  if (vehicleTypeIds.size < 3 && vehicleTypeIds.size > 0) query.push(`(${[...vehicleTypeIds].map(id => `model.vehicleTypeCode == ${id}`).join(' OR ')})`)
  // makes
  // if (makeIds.length > 0) query.push(`model.make.id in ${JSON.stringify(makeIds)}`)
  if (makeIds.size > 0) query.push(`(${[...makeIds].map(id => `model.make.id == ${id}`).join(' OR ')})`)
  // limit

  let _query = query.join(' AND ')
  if (typeof limit === 'number') _query += ` LIMIT(${limit})`
  return _query
}

let makes: Realm.Results<Make & Realm.Object> | null = null
export const fetchMakes = () => {
  if (realm === null) throw Error('realm not opened')
  else if (makes === null) makes = realm.objects<Make>(Make.schema.name)
  return makes
}

let modelYears: Realm.Results<ModelYear & Realm.Object> | null = null
export const fetchModelYears = () => {
  if (realm === null) throw Error('realm not opened')
  else if (modelYears === null) modelYears = realm.objects<ModelYear>(ModelYear.schema.name)
  return modelYears
}

export const fetchFilteredModelYears = async (modelYearFilter: IModelYearFilter) => {
  const query = getModelYearFilterQuery(modelYearFilter, 100)
  console.log('FILTERED', query)
  const result = realm?.objects(ModelYear.schema.name).filtered(query).sorted('model.name')
  console.log('FETCHED', result?.length)
  return []
}
// const debouncedFetchFilteredModelYears = debounce(fetchFilteredModelYears, 1000) as (reducer: IFipeReducer) => Promise<ModelYear[]>

export const setModelYearFilter = async (reducer: IFipeReducer, modelYearFilter: IModelYearFilter) => {
  reducer.dispatch?.({ type: FipeActionType.SetModelYearFilter, payload: modelYearFilter })
}

export const resetModelYearFilter = async (reducer: IFipeReducer) => reducer.dispatch?.({ type: FipeActionType.ResetModelYearFilter, payload: null })

export const resetModelYearFilterMakeIds = async (reducer: IFipeReducer) => reducer.dispatch?.({ type: FipeActionType.ResetModelYearFilterMakeIds, payload: null })

const getActions: (reducer: IFipeReducer) => IFipeActions = reducer => ({
  openRealm,
  initContext: () => initContext(reducer),
  setModelYearFilter: (modelYearFilter: IModelYearFilter) => setModelYearFilter(reducer, modelYearFilter),
  resetModelYearFilter: () => resetModelYearFilter(reducer),
  resetModelYearFilterMakeIds: () => resetModelYearFilterMakeIds(reducer),
  fetchMakes,
  fetchModelYears,
  getModelYearFilterQuery
})

export default getActions
