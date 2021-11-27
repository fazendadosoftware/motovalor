import { useEffect, useCallback } from 'react'
import useRealm from './useRealm'
import useModelYearFilter from './useModelYearFilter'
import { Make, ModelYear, IModelYearFilter } from '../types.d'

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

const useFipe = () => {
  const { getInstance } = useRealm()
  const { modelYearFilter } = useModelYearFilter()

  useEffect(() => {
    console.log('MODEL FILTER CHANGED', modelYearFilter)
  }, [modelYearFilter])

  return {
  }
}

export default useFipe
