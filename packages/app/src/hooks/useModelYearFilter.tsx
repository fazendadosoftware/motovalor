import { useEffect, useState,  useCallback } from 'react'
import debounce from 'lodash.debounce'
import { Make, ModelYear, IModelYearFilter } from '../types.d'
import useRealm from './useRealm'
import { useModelYearState, useModelYearDispatch, ModelYearFilterAction } from '../contexts/ModelYearFilter'

const getFilterQuery = (modelYearFilter: IModelYearFilter, limit?: number) => {
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
}

const getFilteredModelYears = async (getInstance: () => Promise<Realm>, modelYearFilter: IModelYearFilter) => {
  const realm = await getInstance()
  const filteredModelYears = realm?.objects<ModelYear>(ModelYear.schema.name).filtered(getFilterQuery(modelYearFilter, 3)).toJSON() as ModelYear[]
  return filteredModelYears
}

let init = false
const useModelYearFilter = () => {
  useEffect(() => {
    if (init === false) {
      console.log('=================================================================================')
      init = true
    }
  }, [])
  const modelYearFilter = useModelYearState()
  const dispatch = useModelYearDispatch()

  const { getInstance, closeRealm } = useRealm()
  const [filteredModelYears, setFilteredModelYears] = useState<ModelYear[]>([])

  const debounced = debounce(async () => {
    console.log('DEBOUNCED', new Date())
    console.log('MODEL YEAR', modelYearFilter)
    const _filteredModelYears = await getFilteredModelYears(getInstance, modelYearFilter)
    console.log('FILTEERED', _filteredModelYears.map(modelYear => modelYear.model.name))
    setFilteredModelYears(_filteredModelYears)
  }, 1000)

  useEffect(() => {
    (async () => {
      debounced()
      // console.log('MODEL YEAR', modelYearFilter)
      // const _filteredModelYears = await getFilteredModelYears(getInstance, modelYearFilter)
      // console.log('FILTEERED', _filteredModelYears.map(modelYear => modelYear.model.name))
      // setFilteredModelYears(_filteredModelYears)
    })()
  }, [modelYearFilter._, setFilteredModelYears])

  const setMakeIndex = useCallback((payload: Record<number, Make> | null) => dispatch?.({ type: ModelYearFilterAction.SetMakeIndex, payload }), [])
  const setFtsQuery = useCallback((query: string) => dispatch?.({ type: ModelYearFilterAction.SetFtsQuery, payload: query }), [])
  const setVehicleTypeId = useCallback((vehicleTypeCode: 1 | 2 | 3) => dispatch?.({ type: ModelYearFilterAction.SetVehicleTypeId, payload: vehicleTypeCode }), [])
  const setZeroKm = useCallback((zeroKm: boolean) => dispatch?.({ type: ModelYearFilterAction.SetZeroKm, payload: zeroKm }), [])
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
