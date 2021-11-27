import { useReducer, useEffect, useState,  useCallback, createContext, useContext } from 'react'
import { Make, ModelYear, IModelYearFilter, Action } from '../types.d'
import useRealm from './useRealm'

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

export const ModelYearFilterContext = createContext<IModelYearFilter>(getInitialState())

const reducer = (state: IModelYearFilter, action: Action<ModelYearFilterAction, unknown>) => {
  const { type, payload = null } = action
  let newState: IModelYearFilter = state
  switch (type) {
    case ModelYearFilterAction.Reset:
      newState = initialState
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
        if (vehicleTypeIds.size === 0) ({ vehicleTypeIds } = initialState)
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

    </ModelYearFilterContext.Provider>
  )
}

const useModelYearFilter = () => {
  const getFilterQuery = useCallback((modelYearFilter: IModelYearFilter, limit?: number) => {
    const { zeroKm, vehicleTypeIds, makeIndex } = modelYearFilter
    const makeIds = Object.values(makeIndex).map(({ id }) => id)

    const query = []
    // 0km
    query.push(zeroKm ? 'year == 32000' : 'year != 32000')
    // vehicleTypeIds
    if (vehicleTypeIds.size < 3 && vehicleTypeIds.size > 0) query.push([...vehicleTypeIds].map(id => `model.vehicleTypeCode == ${id}`).join(' OR '))
    // makes
    // if (makeIds.length > 0) query.push(`model.make.id in ${JSON.stringify(makeIds)}`)
    if (makeIds.length > 0) query.push(makeIds.map(id => `model.make.id == ${id}`).join(' OR '))
    // limit

    let _query = query.join(' AND ')
    if (typeof limit === 'number') _query += ` LIMIT(${limit})`
    return _query
  }, [])

  const modelYearFilterReducer = useCallback((state: IModelYearFilter, action: Action<ModelYearFilterAction, unknown>) => {
    const { type, payload = null } = action
    let newState: IModelYearFilter = state
    switch (type) {
      case ModelYearFilterAction.Reset:
        newState = initialState
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
          if (vehicleTypeIds.size === 0) ({ vehicleTypeIds } = initialState)
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
  }, [getInitialState()])

  const [modelYearFilter, dispatch] = useReducer(modelYearFilterReducer, getInitialState())
  const { getInstance, closeRealm } = useRealm()
  const [filteredModelYears, setFilteredModelYears] = useState<ModelYear[]>([])

  const getFilteredModelYears = useCallback(async (modelYearFilter: IModelYearFilter) => {
    const realm = await getInstance()
    const filteredModelYears = realm?.objects<ModelYear>(ModelYear.schema.name).filtered(getFilterQuery(modelYearFilter, 3)).toJSON() as ModelYear[]
    return filteredModelYears
  }, [getInstance])

  useEffect(() => {
    (async () => {
      console.log('MODEL YEAR', modelYearFilter)
      const _filteredModelYears = await getFilteredModelYears(modelYearFilter)
      console.log('FILTEERED', _filteredModelYears.map(modelYear => modelYear.model.name))
      setFilteredModelYears(_filteredModelYears)
      console.log('SET', filteredModelYears.map(modelYear => modelYear.model.name))
    })()
  }, [modelYearFilter])

  const setMakeIndex = useCallback((payload: Record<number, Make> | null) => dispatch({ type: ModelYearFilterAction.SetMakeIndex, payload }), [])
  const setFtsQuery = useCallback((query: string) => dispatch({ type: ModelYearFilterAction.SetFtsQuery, payload: query }), [])
  const setVehicleTypeId = useCallback((vehicleTypeCode: 1 | 2 | 3) => dispatch({ type: ModelYearFilterAction.SetVehicleTypeId, payload: vehicleTypeCode }), [])
  const setZeroKm = useCallback((zeroKm: boolean) => dispatch({ type: ModelYearFilterAction.SetZeroKm, payload: zeroKm }), [])
  const resetFilter = useCallback(() => dispatch?.({ type: ModelYearFilterAction.Reset, payload: null }), [])

  return {
    modelYearFilter,
    resetFilter,
    setFtsQuery,
    setMakeIndex,
    setVehicleTypeId,
    setZeroKm,
    filteredModelYears
  }
}

export default useModelYearFilter
