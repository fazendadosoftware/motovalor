import Realm from 'realm'
import { Make, ModelYear, Action } from '../../types.d'
export { Make, ModelYear, Action }

export enum FipeActionType {
  Reset = 'RESET',
  SetIsInitialized = 'SET_IS_INITIALIZED',
  SetIsSyncing = 'SET_IS_SYNCING',
  SetFTSQueryModelYears = 'SET_FTS_QUERY_MODEL_YEARS',
  SetFTSQueryMakes = 'SET_FTS_QUERY_MAKES',
  SetMakeIndex = 'SET_MAKE_INDEX',
  SetModelYearIndex = 'SET_MODEL_YEAR_INDEX',
  SetModelYearFilter = 'SET_MODEL_YEAR_FILTER',
  ToggleModelYearFilterVehicleTypeId = 'TOGGLE_MODEL_YEAR_FILTER_VEHICLE_TYPE_ID',
  ResetModelYearFilter = 'RESET_MODEL_YEAR_FILTER',
  ResetModelYearFilterMakeIds = 'RESET_MODEL_YEAR_FILTER_MAKE_IDS',
  ResetModelYearFilterVehicleTypeIds = 'RESET_MODEL_YEAR_FILTER_VEHICLE_TYPE_IDS',
  SetModelYearFilterMakeId = 'SET_MODEL_YEAR_FILTER_MAKE_ID',
  DeleteModelYearFilterMakeId = 'DELETE_MODEL_YEAR_FILTER_MAKE_ID',
  SetFilteredModelYears = 'SET_FILTERED_MODEL_YEARS'
}

export type IFipeAction = Action<FipeActionType, unknown>

export interface IModelYearFilter {
  _: number
  zeroKm: boolean
  vehicleTypeIds: Set<1 | 2 | 3>
  makeIds: Set<number>
}
export interface IFipeState {
  _: number
  isInitialized: boolean
  isSyncing: boolean
  makeIndex: Map<number, Make>
  modelYearIndex: Record<string, ModelYear>
  modelYearFilter: IModelYearFilter
  ftsQueryModelYears: string
  ftsQueryMakes: string
  filteredModelYears: ModelYear[]
}

export interface IFipeActions {
  openRealm: () => Promise<Realm>
  initContext: (realm: Realm) => Promise<void>
  setModelYearFilter: (modelYearFilter: IModelYearFilter) => Promise<void>
  resetModelYearFilter: () => Promise<void>
  resetModelYearFilterMakeIds: () => Promise<void>
  fetchMakes: () => Realm.Results<Make & Realm.Object>
  fetchModelYears: () => Realm.Results<ModelYear & Realm.Object>
  getModelYearFilterQuery: (modelYearFilter: IModelYearFilter, limit?: number) => string
}

export interface IFipeReducer {
  state: IFipeState
  dispatch: React.Dispatch<IFipeAction> | null
}

export interface IFipeContext extends IFipeReducer {
  actions: IFipeActions
}
