import { useReducer, createContext, useContext } from 'react'
import { Make, IModelYearFilter, Action } from '../types.d'

export enum ModelYearFilterAction {
  Reset = 'RESET',
  SetFtsQuery = 'SET_FTS_QUERY',
  SetMakeIndex = 'SET_MAKE_INDEX',
  SetVehicleTypeId = 'SET_VEHICLE_TYPE_ID',
  SetZeroKm = 'SET_ZERO_KM'
}

export const getInitialState: () => IModelYearFilter = () => ({
  ftsQuery: '',
  zeroKm: false,
  vehicleTypeIds: new Set([1, 2, 3]),
  makeIndex: {}
})

const ModelYearFilterContext = createContext<IModelYearFilter>(getInitialState())
const ModelYearFilterDispatch = createContext<React.Dispatch<Action<ModelYearFilterAction, unknown>> | null>(null)

const reducer = (state: IModelYearFilter, action: Action<ModelYearFilterAction, unknown>) => {
  const { type, payload = null } = action
  let newState: IModelYearFilter = state
  switch (type) {
    case ModelYearFilterAction.Reset:
      newState = getInitialState()
      break
    case ModelYearFilterAction.SetMakeIndex:
      const makeIndex = payload === null ? {} : payload as Record<number, Make>
      newState = { ...state, makeIndex }
      break
    case ModelYearFilterAction.SetVehicleTypeId:
      if (payload === null) newState = { ...state, vehicleTypeIds: new Set() }
      else if (typeof payload === 'number' && [1, 2, 3].includes(payload)) {
        const vehicleTypeId = payload as 1 | 2 | 3
        let vehicleTypeIds = new Set([...state.vehicleTypeIds])
        vehicleTypeIds.has(vehicleTypeId) ? vehicleTypeIds.delete(vehicleTypeId) : vehicleTypeIds.add(vehicleTypeId)
        if (vehicleTypeIds.size === 0) ({ vehicleTypeIds } = getInitialState())
        newState = { ...state, vehicleTypeIds }
      }
      break
    case ModelYearFilterAction.SetZeroKm:
      newState = { ...state, zeroKm: payload as boolean }
      break
    case ModelYearFilterAction.SetFtsQuery:
      newState = { ...state, ftsQuery: payload as string }
      break
  }
  return newState
}

export const ModelYearFilterProvider: React.FC = ({ children }) => {
  const [modelYearFilter, dispatch] = useReducer(reducer, getInitialState())
  return (
    <ModelYearFilterContext.Provider value={modelYearFilter}>
      <ModelYearFilterDispatch.Provider value={dispatch}>
        {children}
      </ModelYearFilterDispatch.Provider>
    </ModelYearFilterContext.Provider>
  )
}

export const useModelYearState = () => useContext(ModelYearFilterContext)
export const useModelYearDispatch = () => useContext(ModelYearFilterDispatch)
