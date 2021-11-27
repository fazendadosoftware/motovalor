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
    case FipeActionType.ResetModelYearFilter:
      return { ...state, modelYearFilter: getModelYearFilterInitialState() }
    case FipeActionType.SetMakes:
      const makes = payload as Make[]
      return { ...state, makes }
    case FipeActionType.SetModelYearFilter:
      const modelYearFilter = payload as IModelYearFilter
      modelYearFilter._++
      return { ...state, modelYearFilter }
    default:
      return state
  }
}
