import React, { useContext, useEffect, useReducer, createContext, useState } from 'react'
import { reducer, getInitialState } from './reducer'
import getActions from './actions'
import { IFipeContext } from './types.d'

// @ts-expect-error
const FipeContext = createContext<IFipeContext>()

export const FipeProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, getInitialState())
  const [actions] = useState(() => getActions({ state, dispatch }))

  useEffect(() => { actions.initContext() }, [])

  return (
    <FipeContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </FipeContext.Provider>
  )
}

export const useFipeContext = () => useContext(FipeContext)