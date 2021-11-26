import React, { createContext, useContext, useReducer } from 'react'
import { Make } from 'datastore/src/model'

export interface IModelYearFilter {
  ftsQuery: string
  makeIndex: Record<number, Make>
}

export enum ModelYearFilterAction {
  SetMakeIndex = 'SET_MAKE_INDEX'
}

type Action = {
  type: ModelYearFilterAction,
  payload: unknown
}

const INITIAL_STATE: IModelYearFilter = {
  ftsQuery: '',
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
  let newState: IModelYearFilter
  switch (type) {
    case ModelYearFilterAction.SetMakeIndex:
      const makeIndex = payload === null ? {} : payload as Record<number, Make>
      console.log('SETTING', payload)
      newState = { ...state, makeIndex }
      break
    default:
      newState = state
  }
  console.log('NEW STATE', state, newState)
  return newState
}

export const useModelYearFilterState = () => useContext(ModelYearFilterStateContext)
export const useModelYearFilterDispatch = () => useContext(ModelYearFilterDispatchContext)