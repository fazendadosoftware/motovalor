import { Make, IFipeState, IModelYearFilter, IFipeAction, FipeActionType, ModelYear } from './types.d'

export const getModelYearFilterInitialState: () => IModelYearFilter = () => ({
  _: 0,
  zeroKm: false,
  vehicleTypeIds: new Set([1, 2, 3]),
  makeIds: new Set()
})

export const getInitialState: () => IFipeState = () => ({
  _: 0,
  isSyncing: false,
  makeIndex: new Map(),
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
    case FipeActionType.SetMakeIndex:
      return (() => {
        const makeIndex = payload as Map<number, Make>
        return { ...state, makeIndex }
      })()
    case FipeActionType.SetModelYearIndex:
      return (() => {
        const modelYearIndex = payload as Record<string, ModelYear>
        return { ...state, modelYearIndex }
      })()
    case FipeActionType.SetModelYearFilter:
      return (() => {
         const modelYearFilter = payload as IModelYearFilter
         modelYearFilter._++
         return { ...state, modelYearFilter }
      })()
    case FipeActionType.ResetModelYearFilter:
      return { ...state, modelYearFilter: getModelYearFilterInitialState() }
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
    case FipeActionType.ResetModelYearFilterMakeIds:
      return (() => {
        const { modelYearFilter } = state
        modelYearFilter.makeIds = new Set()
        modelYearFilter._++
        return { ...state, modelYearFilter }
      })()
    case FipeActionType.SetModelYearFilterMakeId:
      return (() => {
        const { modelYearFilter } = state
        const makeId = payload as number

        if (!modelYearFilter.makeIds.has(makeId)) {
          modelYearFilter.makeIds.add(makeId)
          modelYearFilter._++
        }
        return { ...state, modelYearFilter }
      })()
    case FipeActionType.DeleteModelYearFilterMakeId:
      return (() => {
        const { modelYearFilter } = state
        const makeId = payload as number
        if (modelYearFilter.makeIds.has(makeId)) {
          modelYearFilter.makeIds.delete(makeId)
          modelYearFilter._++
        }
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
