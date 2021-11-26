import React, { createContext, useContext, useReducer } from 'react'
import { Make } from 'datastore/src/model'

interface ModelYearFilter {
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

const INITIAL_STATE: ModelYearFilter = {
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

const modelYearFilterReducer = (state: ModelYearFilter, action: Action) => {
  const { type, payload } = action
  let newState: ModelYearFilter
  switch (type) {
    case ModelYearFilterAction.SetMakeIndex:
      const makeIndex = payload as Record<number, Make>
      newState = { ...state, makeIndex }
  }
  return newState
}

export const useModelYearFilterState = () => useContext(ModelYearFilterStateContext)
export const useModelYearFilterDispatch = () => useContext(ModelYearFilterDispatchContext)