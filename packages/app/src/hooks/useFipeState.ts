import { useEffect } from 'react'
import { createState, useState, State, none } from '@hookstate/core'
import murmurhash from 'murmurhash'
import { openRealm, closeRealm } from '../helpers/fipeRealm'
import { Make, Model, ModelYear } from 'datastore/src/model'
export { Make, Model, ModelYear }

export type VehicleTypeCode = 1 | 2 | 3
export interface ModelYearFilter {
  zeroKm: boolean
  selectedVehicleTypeIndex: Partial<Record<VehicleTypeCode, true>>
  selectedMakeIndex: Record<number, Make>
}

export interface FipeState {
  isInitialized: boolean
  modelYearFilter: ModelYearFilter
  lastModelYearFilterQuery: number
  filteredModelYears: ModelYear[]
  makes: Make[]
  modelYearFtsQuery: string
}

export const getModelYearFilterInitialState: () => ModelYearFilter = () => ({
  zeroKm: false,
  selectedVehicleTypeIndex: {},
  selectedMakeIndex: {}
})

let realm: Realm | null = null
const getInitialState = (): FipeState => {
  return {
    isInitialized: false,
    modelYearFilter: getModelYearFilterInitialState(),
    lastModelYearFilterQuery: -1,
    filteredModelYears: [],
    makes: [],
    modelYearFtsQuery: ''
  }
}

const init = async (state: State<FipeState>) => {
  if (realm === null) realm = await openRealm()
  state.isInitialized.set(true);
  (async () => state.makes.set(fetchMakes()))()
}

// ACTIONS
const resetModelYearFilter = (state: State<FipeState>) => state.modelYearFilter.set(getModelYearFilterInitialState())
const resetModelYearFilterSelectedMakes = (state: State<FipeState>) => state.modelYearFilter.selectedMakeIndex.set({})
const destroy = (state: State<FipeState>) => {
  closeRealm(realm)
  realm = null
}
const fetchMakes = (): Make[] => [...realm?.objects<Make>(Make.schema.name).sorted('name') ?? []]

const toggleMakeSelection = (state: State<FipeState>, make: Make) => {
  const selectedMakeIndex = state.modelYearFilter.selectedMakeIndex
  const { [make.id]: selectedMake } = selectedMakeIndex.get()
  !selectedMake ? selectedMakeIndex.merge({ [make.id]: make }) : selectedMakeIndex[make.id].set(none)
}

const getModelYearFilterQuery = (modelYearFilter: ModelYearFilter, limit?: number) => {
  const { zeroKm, selectedVehicleTypeIndex, selectedMakeIndex } = modelYearFilter
  const selectedVehicleTypeCodes = Object.keys(selectedVehicleTypeIndex)
  const selectedMakeIds = Object.values(selectedMakeIndex).map(({ id }) => id)

  const query = []
  // 0km
  query.push(zeroKm ? 'year == 32000' : 'year != 32000')
  // vehicleTypeIds
  if (selectedVehicleTypeCodes.length < 3 && selectedVehicleTypeCodes.length > 0)
    query.push(`(${[...selectedVehicleTypeCodes].map(vehicleTypeCode => `model.vehicleTypeCode == ${vehicleTypeCode}`).join(' OR ')})`)
  
  // makes
  // if (makeIds.length > 0) query.push(`model.make.id in ${JSON.stringify(makeIds)}`)
  if (selectedMakeIds.length > 0) query.push(`(${selectedMakeIds.map(id => `model.make.id == ${id}`).join(' OR ')})`)
  // limit

  let _query = query.join(' AND ')
  if (typeof limit === 'number') _query += ` LIMIT(${limit})`
  return _query
}

const modelYearFilterQueryDidChange = (state: State<FipeState>) => {
  const currentQuery = murmurhash(getModelYearFilterQuery(state.modelYearFilter.get()))
  const areDifferent = currentQuery !== state.lastModelYearFilterQuery.get()
  if (areDifferent) state.lastModelYearFilterQuery.set(currentQuery)
  return areDifferent
}

const fetchFilteredModelYears = (state: State<FipeState>, limit?: number) => {
  if (realm === null) return []
  const query = getModelYearFilterQuery(state.modelYearFilter.get(), limit)
  return realm?.objects<ModelYear>(ModelYear.schema.name).filtered(query)
}

const useActions = (state: State<FipeState>) => ({
  destroy: () => destroy(state),
  fetchMakes,
  resetModelYearFilter: () => resetModelYearFilter(state),
  resetModelYearFilterSelectedMakes: () => resetModelYearFilterSelectedMakes(state),
  toggleMakeSelection: (make: Make) => toggleMakeSelection(state, make),
  getModelYearFilterQuery,
  fetchFilteredModelYears: (limit?: number) => fetchFilteredModelYears(state, limit),
  modelYearFilterQueryDidChange: () => modelYearFilterQueryDidChange(state)
})

// STATE
const fipeState = createState(getInitialState())

const useFipeState = () => {
  const state = useState(fipeState)
  const actions = useActions(state)

  useEffect(() => { if (!state.promised && !state.isInitialized.get()) init(state) }, [state])

  return {
    state,
    actions
  }
}

export default useFipeState
