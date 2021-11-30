import { useEffect } from 'react'
import { createState, useState, State } from '@hookstate/core'
import { openRealm, closeRealm } from '../helpers/fipeRealm'
import { Make, ModelYearFilter } from '../types/fipe.d'

export interface FipeState {
  _: number
  isInitialized: boolean
  modelYearFilter: ModelYearFilter
  makes: Make[]
  modelYearFtsQuery: string
}

export const getModelYearFilterInitialState: () => ModelYearFilter = () => ({
  _: 0,
  isReady: false,
  zeroKm: false,
  selectedVehicleTypeIndex: {},
  selectedMakeIndex: {}
})

let realm: Realm | null = null
const getInitialState = async (): Promise<FipeState> => {
  if (realm === null) realm = await openRealm()
  return {
    _: 0,
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
const fetchMakes = () => {
  const makes = [...realm?.objects<Make>(Make.schema.name) ?? []] as Make[]
  console.log(`GOT ${makes?.length ?? 'null'} makes`)
  return makes
}

const useActions = (state: State<FipeState>) => ({
  destroy: () => destroy(state),
  fetchMakes,
  resetModelYearFilter: () => resetModelYearFilter(state),
  resetModelYearFilterSelectedMakes: () => resetModelYearFilterSelectedMakes(state)
})

// STATE
const fipeState = createState(getInitialState())

setInterval(() => fipeState._.set(v => v + 1), 1000)

const useFipeState = () => {
  const state = useState(fipeState)
  const actions = useActions(state)
  const isReady = !state.promised

  useEffect(() => { if (!state.promised && !state.isInitialized.get()) init(state) }, [state])

  return {
    isReady,
    state,
    actions
  }
}

export default useFipeState
