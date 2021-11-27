import { Make, IFipeState, IModelYearFilter, IFipeAction, FipeActionType } from './types.d'

export const getModelYearFilterInitialState: () => IModelYearFilter = () => ({
  _: 0,
  ftsQuery: '',
  zeroKm: false,
  vehicleTypeIds: new Set([1, 2, 3]),
  makeIndex: {}
})

export const getInitialState: () => IFipeState = () => ({
  _: 0,
  makes: [],
  modelYearFilter: getModelYearFilterInitialState()
})

export const reducer = (state: IFipeState, action: IFipeAction) => {
  const { type, payload = null } = action
  state._++
  switch (type) {
    case FipeActionType.Reset:
      return getInitialState()
    case FipeActionType.SetMakes:
      return (() => {
        const makes = payload as Make[]
        return { ...state, makes }
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
        if (vehicleTypeIds.size === 0) ({ vehicleTypeIds } = getModelYearFilterInitialState())
        modelYearFilter._++
        return { ...state, modelYearFilter: { ...modelYearFilter, vehicleTypeIds } }
      })()
    case FipeActionType.ResetModelYearFilterVehicleTypeIds:
      const { modelYearFilter } = state
      const { vehicleTypeIds } = getModelYearFilterInitialState()
      modelYearFilter._++
      return { ...state, modelYearFilter: { ...modelYearFilter, vehicleTypeIds } }
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
    default:
      return state
  }
}
