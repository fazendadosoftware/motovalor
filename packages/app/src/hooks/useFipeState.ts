import { useEffect } from 'react'
import { createState, useState, State, none } from '@hookstate/core'
import murmurhash from 'murmurhash'
import debounce from 'lodash.debounce'
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
  modelYearFilterHash: number
  loadingModelYears: boolean
  filteredModelYears: ModelYear[]
  filteredModelYearsCount: number
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
    modelYearFilterHash: -1,
    loadingModelYears: false,
    filteredModelYears: [],
    filteredModelYearsCount: 0,
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

const fetchFilteredModelYears = (modelYearFilter: ModelYearFilter, limit?: number) => {
  if (realm === null) throw Error('realm is closed')
  const query = getModelYearFilterQuery(modelYearFilter)
  const realmObjects = realm.objects<ModelYear>(ModelYear.schema.name).filtered(query)
  console.log('MODELYEARS=-=====', realmObjects.length)
  return {
    nodes: [...realmObjects] as ModelYear[],
    totalCount: realmObjects.length
  }
}

const useActions = (state: State<FipeState>) => ({
  destroy: () => destroy(state),
  fetchMakes,
  resetModelYearFilter: () => resetModelYearFilter(state),
  resetModelYearFilterSelectedMakes: () => resetModelYearFilterSelectedMakes(state),
  toggleMakeSelection: (make: Make) => toggleMakeSelection(state, make),
  getModelYearFilterQuery,
  fetchFilteredModelYears
})

// STATE
const fipeState = createState(getInitialState())

const useFipeState = () => {
  const state = useState(fipeState)
  const actions = useActions(state)

  useEffect(() => { if (!state.promised && !state.isInitialized.get()) init(state) }, [state])

  useEffect(() => {
    if (!state.isInitialized.get()) return
    const nextModelYearFilterHash = murmurhash(JSON.stringify(state.modelYearFilter.get()))
    const prevModelYearFilterHash = state.modelYearFilterHash.get()
    if (nextModelYearFilterHash !== prevModelYearFilterHash) {
      (async() => {
        state.modelYearFilterHash.set(nextModelYearFilterHash)
        console.log('============== START ============ >>> TRIGGERING', nextModelYearFilterHash)
        const result = actions.fetchFilteredModelYears(state.modelYearFilter.get())
        state.filteredModelYears.set([...result?.nodes ?? []])
        state.filteredModelYearsCount.set(result?.totalCount ?? -1)
        console.log('===========GOT MODEL YERAS', result?.totalCount, state.modelYearFilterHash.get())
      })()
    }
  }, [actions, state.filteredModelYears, state.filteredModelYearsCount, state.isInitialized, state.modelYearFilter, state.modelYearFilterHash])

  return {
    state,
    actions
  }
}

export default useFipeState
