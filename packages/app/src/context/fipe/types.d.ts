import { Make, Action } from '../../types.d'
export { Make, Action }

export enum FipeActionType {
  Reset = 'RESET',
  SetMakes = 'SET_MAKES',
  SetModelYearFilter = 'SET_MODEL_YEAR_FILTER',
  ToggleModelYearFilterVehicleTypeId = 'TOGGLE_MODEL_YEAR_FILTER_VEHICLE_TYPE_ID',
  ResetModelYearFilter = 'RESET_MODEL_YEAR_FILTER',
  ResetModelYearFilterMakes = 'RESET_MODEL_YEAR_FILTER_MAKES',
  ResetModelYearFilterVehicleTypeIds = 'RESET_MODEL_YEAR_FILTER_VEHICLE_TYPE_IDS',
  SetModelYearFilterMakeIndex = 'SET_MODEL_YEAR_FILTER_MAKE_INDEX'
}

export type IFipeAction = Action<FipeActionType, unknown>

export interface IModelYearFilter {
  _: number
  zeroKm: boolean
  vehicleTypeIds: Set<1 | 2 | 3>
  makeIndex: Record<number, Make>
}

export interface IFipeState {
  _: number
  makes: Make[],
  modelYearFilter: IModelYearFilter
}

export interface IFipeActions {
  openRealm: () => Promise<Realm>
  initContext: () => Promise<void>
  setModelYearFilter: (modelYearFilter: IModelYearFilter) => Promise<void>
  resetModelYearFilter: () => Promise<void>
  resetModelYearFilterMakes: () => Promise<void>
  fetchMakes: ({ query, sorted }: { query?: string, sorted?: string }) => Promise<Make[]>
}

export interface IFipeReducer {
  state: IFipeState
  dispatch: React.Dispatch<IFipeAction> | null
}

export interface IFipeContext extends IFipeReducer {
  actions: IFipeActions
}
