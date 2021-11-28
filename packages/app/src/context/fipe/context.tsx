import React, { useContext, useEffect, useReducer, createContext, useState, useRef, useCallback } from 'react'
import { reducer, getInitialState } from './reducer'
import getActions, { openRealm, closeRealm, initContext } from './actions'
import { FipeActionType, IFipeContext } from './types.d'

// @ts-expect-error
const FipeContext = createContext<IFipeContext>()

export const FipeProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, getInitialState())
  const [actions] = useState(() => getActions({ state, dispatch }))

  // opens and closes the realm
  useEffect(() => {
    (async () => { await openRealm(); initContext({ state, dispatch }) })()
    return closeRealm()
  }, [])

  // update filtered model years on modelYearFilter change
  useEffect(() => {
    (async () => {
      const modelYears = Object.values(state.modelYearIndex).slice(0, 10)
      console.log('======================MODEL YEAR INDEX UPDATED=============================', Object.keys(state.modelYearIndex).length)
      dispatch({ type: FipeActionType.SetFilteredModelYears, payload: modelYears })
      // const filteredModelYears = await actions.fetchFilteredModelYears(state.modelYearFilter)
      // console.log('FILTERED MODEL YERAS', filteredModelYears)
      // dispatch({ type: FipeActionType.SetFilteredModelYears, payload: filteredModelYears })
    })()
  }, [state.modelYearIndex, state.modelYearFilter._])

  return (
    <FipeContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </FipeContext.Provider>
  )
}

export const useFipeContext = () => useContext(FipeContext)