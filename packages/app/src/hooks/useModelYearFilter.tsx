import React, { createContext, useContext, useReducer } from 'react'
import { Make } from 'datastore/src/model'

export interface IModelYearFilter {
  ftsQuery: string
  zeroKm: boolean
  vehicleTypeIds: Set<1 | 2 | 3>
  makeIndex: Record<number, Make>
}

export enum ModelYearFilterAction {
  Reset = 'RESET',
  SetFtsQuery = 'SET_FTS_QUERY',
  SetMakeIndex = 'SET_MAKE_INDEX',
  SetVehicleTypeId = 'SET_VEHICLE_TYPE_ID',
  SetZeroKm = 'SET_ZERO_KM'
}

type Action = {
  type: ModelYearFilterAction,
  payload: unknown
}

const INITIAL_STATE: IModelYearFilter = {
  ftsQuery: '',
  zeroKm: false,
  vehicleTypeIds: new Set(),
  makeIndex: {}
}

const ModelYearFilterStateContext = createContext(INITIAL_STATE)
const ModelYearFilterDispatchContext = createContext<React.Dispatch<Action> | null>(null)

export const ModelYearFilterProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(modelYearFilterReducer, INITIAL_STATE)
  return (
    <ModelYearFilterStateContext.Provider value={state}>
      <ModelYearFilterDispatchContext.Provider value={dispatch}>
        {children}
      </ModelYearFilterDispatchContext.Provider>
    </ModelYearFilterStateContext.Provider>
  )
}

const modelYearFilterReducer = (state: IModelYearFilter, action: Action) => {
  const { type, payload = null } = action
  let newState: IModelYearFilter = state
  switch (type) {
    case ModelYearFilterAction.Reset:
      newState = INITIAL_STATE
      break
    case ModelYearFilterAction.SetMakeIndex:
      const makeIndex = payload === null ? {} : payload as Record<number, Make>
      newState = { ...state, makeIndex }
      break
    case ModelYearFilterAction.SetVehicleTypeId:
      if (payload === null) newState = { ...state, vehicleTypeIds: new Set() }
      else if (typeof payload === 'number' && [1, 2, 3].includes(payload)) {
        const vehicleTypeId = payload as 1 | 2 | 3
        const vehicleTypeIds = new Set([...state.vehicleTypeIds])
        vehicleTypeIds.has(vehicleTypeId) ? vehicleTypeIds.delete(vehicleTypeId) : vehicleTypeIds.add(vehicleTypeId)
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

export const useModelYearFilterState = () => useContext(ModelYearFilterStateContext)
export const useModelYearFilterDispatch = () => useContext(ModelYearFilterDispatchContext)

const useModelYearFilter = () => {
  const modelYearFilter = useContext(ModelYearFilterStateContext)
  const dispatch = useContext(ModelYearFilterDispatchContext)

  const setFtsQuery = (query: string) => dispatch?.({ type: ModelYearFilterAction.SetFtsQuery, payload: query })
  const resetFilter = () => dispatch?.({ type: ModelYearFilterAction.Reset, payload: null })

  return {
    modelYearFilter,
    resetFilter,
    setFtsQuery
  }
}

export default useModelYearFilter
