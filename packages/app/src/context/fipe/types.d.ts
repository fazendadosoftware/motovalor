import { Make, Action } from '../../types.d'
export { Make, Action }

export enum FipeActionType {
  Reset = 'RESET',
  ResetModelYearFilter = 'RESET_MODEL_YEAR_FILTER',
  SetMakes = 'SET_MAKES',
  SetModelYearFilter = 'SET_MODEL_YEAR_FILTER'
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
  fetchMakes: ({ query, sorted }: { query?: string, sorted?: string }) => Promise<Make[]>
}

export interface IFipeReducer {
  state: IFipeState
  dispatch: React.Dispatch<IFipeAction> | null
}

export interface IFipeContext extends IFipeReducer {
  actions: IFipeActions
}
