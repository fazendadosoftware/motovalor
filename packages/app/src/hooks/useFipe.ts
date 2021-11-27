import { useEffect, useState, useCallback } from 'react'
import useRealm from './useRealm'
import useModelYearFilter from './useModelYearFilter'
import debounce from 'lodash.debounce'
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

const useFipe = () => {
  const { getInstance } = useRealm()
  const { modelYearFilter } = useModelYearFilter()
  const [filteredModelYears, setFilteredModelYears] = useState<ModelYear[]>([])

  const debouncedFn = useCallback(debounce(async () => {
    console.log('MODEL YEAR FILTER', modelYearFilter)
    const realm = await getInstance()
    const filteredModelYears = realm?.objects<ModelYear>(ModelYear.schema.name).filtered(getFilterQuery(modelYearFilter, 3)).toJSON() as ModelYear[]
    console.log('FILTERED', filteredModelYears.map(({ model: { name} }) => name))
    setFilteredModelYears(filteredModelYears)
  }, 1000), [getInstance, modelYearFilter, setFilteredModelYears])

  useEffect(() => { debouncedFn() }, [modelYearFilter])

  return {
    filteredModelYears
  }
}

export default useFipe
