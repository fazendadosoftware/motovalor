import React, { useContext, useEffect, useReducer, createContext, useState, useCallback } from 'react'
import { reducer, getInitialState } from './reducer'
import getActions from './actions'
import { FipeActionType, IFipeContext } from './types.d'

// @ts-expect-error
const FipeContext = createContext<IFipeContext>()

export const FipeProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, getInitialState())
  const [actions] = useState(() => getActions({ state, dispatch }))

  useEffect(() => { actions.initContext() }, [])

  // update filtered model years on modelYearFilter change
  useEffect(() => {
    (async () => {
      const filteredModelYears = await actions.fetchFilteredModelYears(state.modelYearFilter)
      dispatch({ type: FipeActionType.SetFilteredModelYears, payload: filteredModelYears })
    })()
  }, [state.modelYearFilter._, dispatch])

  return (
    <FipeContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </FipeContext.Provider>
  )
}

export const useFipeContext = () => useContext(FipeContext)