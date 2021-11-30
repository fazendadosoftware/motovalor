import { useEffect } from 'react'
import { createState, useState, State, none } from '@hookstate/core'
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
  makes: Make[]
  modelYearFtsQuery: string
}

export const getModelYearFilterInitialState: () => ModelYearFilter = () => ({
  zeroKm: false,
  selectedVehicleTypeIndex: {},
  selectedMakeIndex: {}
})

let realm: Realm | null = null
const getInitialState = async (): Promise<FipeState> => {
  if (realm === null) realm = await openRealm()
  return {
    isInitialized: false,
    modelYearFilter: getModelYearFilterInitialState(),
    makes: [],
    modelYearFtsQuery: ''
  }
}

const init = (state: State<FipeState>) => {
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
const fetchMakes = () => [...realm?.objects<Make>(Make.schema.name).sorted('name') ?? []] as Make[]

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

const fetchFilteredModelYears = (state: State<FipeState>, limit?: number) => {
  if (state.promised) return []
  if (realm === null) throw Error('realm is null')
  const query = getModelYearFilterQuery(state.modelYearFilter.get(), limit)
  return realm?.objects<ModelYear>(ModelYear.schema.name).filtered(query)
}

const useActions = (state: State<FipeState>) => ({
  destroy: () => destroy(state),
  fetchMakes,
  resetModelYearFilter: () => resetModelYearFilter(state),
  resetModelYearFilterSelectedMakes: () => resetModelYearFilterSelectedMakes(state),
  toggleMakeSelection: (make: Make) => toggleMakeSelection(state, make),
  fetchFilteredModelYears: (limit?: number) => fetchFilteredModelYears(state, limit)
})

// STATE
const fipeState = createState(getInitialState())

const useFipeState = () => {
  const state = useState(fipeState)
  const actions = useActions(state)
  const isReady = !state.promised
  const modelYearFilter = !state.promised ? state.modelYearFilter : null

  useEffect(() => { if (!state.promised && !state.isInitialized.get()) init(state) }, [state])
  useEffect(() => {
    console.log('HAD CHANGED', modelYearFilter)
  }, [modelYearFilter])

  return {
    isReady,
    modelYearFilter,
    state,
    actions
  }
}

export default useFipeState
