import { Make, IFipeState, IModelYearFilter, IFipeAction, FipeActionType, ModelYear } from './types.d'

export const getModelYearFilterInitialState: () => IModelYearFilter = () => ({
  _: 0,
  zeroKm: false,
  vehicleTypeIds: new Set([1, 2, 3]),
  makeIndex: {}
})

export const getInitialState: () => IFipeState = () => ({
  _: 0,
  isSyncing: false,
  makes: [],
  modelYearIndex: {},
  modelYearFilter: getModelYearFilterInitialState(),
  ftsQueryModelYears: '',
  ftsQueryMakes: '',
  filteredModelYears: []
})

export const reducer = (state: IFipeState, action: IFipeAction) => {
  const { type, payload = null } = action
  state._++
  switch (type) {
    case FipeActionType.Reset:
      return getInitialState()
    case FipeActionType.SetIsSyncing:
      const isSyncing = payload as boolean
      return { ...state, isSyncing }
    case FipeActionType.SetFTSQueryModelYears:
      return (() => {
        const ftsQueryModelYears = payload as string
        return { ...state, ftsQueryModelYears }
      })()
    case FipeActionType.SetFTSQueryMakes:
      return (() => {
        const ftsQueryMakes = payload as string
        return { ...state, ftsQueryMakes }
      })()
    case FipeActionType.SetMakes:
      return (() => {
        const makes = payload as Make[]
        return { ...state, makes }
      })()
    case FipeActionType.SetModelYearIndex:
      return (() => {
        const modelYearIndex = payload as Record<string, ModelYear>
        return { ...state, modelYearIndex } as IFipeState
      })()
    case FipeActionType.SetModelYearFilter:
      return (() => {
         const modelYearFilter = payload as IModelYearFilter
         modelYearFilter._++
         return { ...state, modelYearFilter }
      })()
    case FipeActionType.ResetModelYearFilter:
      return { ...state, modelYearFilter: getModelYearFilterInitialState() }
    case FipeActionType.ResetModelYearFilterMakes:
      return (() => {
        const { modelYearFilter } = state
        modelYearFilter.makeIndex = {}
        modelYearFilter._++
        return { ...state, modelYearFilter }
      })()
    case FipeActionType.ToggleModelYearFilterVehicleTypeId:
      return (() => {
        const vehicleTypeId = payload as 1 | 2 | 3
        const { modelYearFilter } = state
        let vehicleTypeIds = new Set([...modelYearFilter.vehicleTypeIds])
        vehicleTypeIds.has(vehicleTypeId) ? vehicleTypeIds.delete(vehicleTypeId) : vehicleTypeIds.add(vehicleTypeId)
        modelYearFilter._++
        return { ...state, modelYearFilter: { ...modelYearFilter, vehicleTypeIds } }
      })()
    case FipeActionType.ResetModelYearFilterVehicleTypeIds:
      const { modelYearFilter } = state
      const { vehicleTypeIds } = getModelYearFilterInitialState()
      modelYearFilter._++
      return { ...state, modelYearFilter: { ...modelYearFilter, vehicleTypeIds } } as IFipeState
    case FipeActionType.ResetModelYearFilterMakes:
      return (() => {
        const { modelYearFilter } = state
        modelYearFilter.makeIndex = {}
        modelYearFilter._++
        return { ...state, modelYearFilter }
      })()
    case FipeActionType.SetModelYearFilterMakeIndex:
      return (() => {
        const makeIndex = payload as Record<number, Make>
        const { modelYearFilter } = state
        modelYearFilter.makeIndex = makeIndex
        modelYearFilter._++
        return { ...state, modelYearFilter }
      })()
    case FipeActionType.SetFilteredModelYears:
      return (() => {
        const filteredModelYears = payload as ModelYear[]
        return { ...state, filteredModelYears }
      })()
    default:
      return state
  }
}
