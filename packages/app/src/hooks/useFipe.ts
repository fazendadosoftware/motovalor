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
  const [loadingFilteredModelYears, setLoadingFilteredModelYears] = useState(false)

  const updateFilteredModelYears = useCallback(debounce(async (getInstance: () => Promise<Realm>, modelYearFilter: IModelYearFilter, setFilteredModelYears: any) => {
    const realm = await getInstance()
    const filteredModelYears = realm?.objects<ModelYear>(ModelYear.schema.name).filtered(getFilterQuery(modelYearFilter, 30)).toJSON() as ModelYear[]
    setFilteredModelYears(filteredModelYears)
  }, 500), [])

  useEffect(() => { updateFilteredModelYears(getInstance, modelYearFilter, setFilteredModelYears) }, [modelYearFilter])

  return {
    filteredModelYears
  }
}

export default useFipe
