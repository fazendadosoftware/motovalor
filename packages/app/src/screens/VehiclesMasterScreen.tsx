import React, { useCallback, useState, useEffect } from 'react'
import { FlatList } from 'react-native'
import { useTheme, ListItem } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchBar from '../components/SafeSearchBar'
import { useFipeContext } from '../context/fipe'
import { FipeActionType, ModelYear } from '../context/fipe/types.d'

export default function VehiclesMasterScreen () {
  const fipeContext = useFipeContext()
  const { theme } = useTheme()
  const [modelYears, setModelYears] = useState<ModelYear[]>([])
  const [modelYearCount, setModelYearCount] = useState<number | null>(null)

  useEffect(() => {
    if (!fipeContext.state.isInitialized) return
    const query = fipeContext.actions.getModelYearFilterQuery(fipeContext.state.modelYearFilter)
    const _modelYearCount = fipeContext.actions.fetchModelYears().filtered(query).length
    setModelYearCount(_modelYearCount)
  }, [fipeContext.actions, fipeContext.state.isInitialized, fipeContext.state.modelYearFilter])

  useEffect(() => {
    if (!fipeContext.state.isInitialized) return
    const query = fipeContext.actions.getModelYearFilterQuery(fipeContext.state.modelYearFilter, 20)
    const _modelYears = [...fipeContext.actions.fetchModelYears().filtered(query)]
    setModelYears(_modelYears)
  }, [fipeContext.actions, fipeContext.state.isInitialized, fipeContext.state.modelYearFilter])

  const setFtsQuery = useCallback((query: string) => {
    fipeContext.dispatch?.({ type: FipeActionType.SetFTSQueryModelYears, payload: query })
  }, [fipeContext])

  return (
    <SafeAreaView style={ { flex: 1, backgroundColor: theme.colors?.grey5 } }>
      <SearchBar
        // @ts-expect-error
        lightTheme
        containerStyle={ { backgroundColor: theme.colors?.primary, paddingHorizontal: 10 } }
        inputContainerStyle={ { borderRadius: 10 } }
        platform="default"
        value={ fipeContext.state.ftsQueryModelYears }
        onChangeText={ setFtsQuery }
        placeholder={ `Pesquisar ${modelYearCount ?? 0} preços` }
      />
      <FlatList
        data={ modelYears }
        renderItem={ ({ item }) => <ModelListItem modelYear={ item } /> }
        keyExtractor={ ({ id }) => id.toHexString() }
        showsVerticalScrollIndicator={ false }
      />
    </SafeAreaView>
  )
}

const ModelListItem = () => {
  return (
    <ListItem />
  )
}
