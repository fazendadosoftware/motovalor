// @ts-ignore
import zipFile from '../assets/fipe.zip'
import React, { useReducer, createContext, useContext, useEffect } from 'react'
import { Make, IFipe, Action } from '../types.d'
import RNFS from 'react-native-fs'
import { Image } from 'react-native'
import { unzip } from 'react-native-zip-archive'
import Realm from 'realm'

const ARCHIVE_FILENAME = 'fipe.zip'
const DATABASE_FILENAME = 'fipe.realm'
const ARCHIVE_FILE = `${RNFS.CachesDirectoryPath}/${ARCHIVE_FILENAME}`
const DATABASE_FILE = `${RNFS.DocumentDirectoryPath}/${DATABASE_FILENAME}`

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

const openRealm = async (): Promise<Realm> => {
  if (!await databaseExists()) await loadDatabaseFromAssets()
  const realm = await Realm.open({ path: DATABASE_FILENAME, schema: [], readOnly: true })
  if (realm === null) throw Error('could not open db')
  return realm
}

export enum FipeAction {
  Reset = 'RESET',
  SetMakes = 'SET_MAKES',
}

export const getInitialState: () => IFipe = () => ({
  _: 0,
  makes: []
})

export interface FipeContextProps {
  state: IFipe
  dispatch: React.Dispatch<Action<FipeAction, unknown>> | null
  openRealm: () => Promise<Realm>
}

const FipeContext = createContext<FipeContextProps>({ state: getInitialState(), dispatch: null, openRealm })

const reducer = (state: IFipe, action: Action<FipeAction, unknown>) => {
  const { type, payload = null } = action
  switch (type) {
    case FipeAction.Reset:
      return getInitialState()
    case FipeAction.SetMakes:
      const makes = payload as Make[]
      return { ...state, makes }
    default:
      return state
  }
}

const fetchMakes = async () => {
  const realm = await openRealm()
  const makes = realm?.objects(Make.schema.name).toJSON() as Make[]
  realm.close()
  return makes
}

const initFipeContext = async(state: IFipe, dispatch: React.Dispatch<Action<FipeAction, unknown>>) => {
  dispatch({ type: FipeAction.SetMakes, payload: await fetchMakes() })
}

export const FipeContextProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, getInitialState())

  useEffect(() => {
    (async () => {
      await initFipeContext(state, dispatch)
    })()
  }, [])

  return (
    <FipeContext.Provider value={{ state, dispatch, openRealm }}>
      {children}
    </FipeContext.Provider>
  )
}

export const useFipeContext = () => useContext(FipeContext)
