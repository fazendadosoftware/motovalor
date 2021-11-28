import React, { useCallback, useState, useEffect } from 'react'
import { FlatList } from 'react-native'
import { useTheme } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchBar from '../components/SafeSearchBar'
import ModelListItem from '../components/ModelListItem'
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
    const modelYearCount = fipeContext.actions.fetchModelYears().filtered(query).length
    setModelYearCount(modelYearCount)
  }, [fipeContext.state.isInitialized, fipeContext.state.modelYearFilter._])

  useEffect(() => {
    if (!fipeContext.state.isInitialized) return
    const query = fipeContext.actions.getModelYearFilterQuery(fipeContext.state.modelYearFilter, 20)
    const modelYears = [...fipeContext.actions.fetchModelYears().filtered(query)]
    setModelYears(modelYears)
  }, [fipeContext.state.isInitialized, fipeContext.state.modelYearFilter._])


  const setFtsQuery = useCallback((query: string) => {
    fipeContext.dispatch?.({ type: FipeActionType.SetFTSQueryModelYears, payload: query })
  }, [])

  return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors?.grey5 }}>
        <SearchBar
          // @ts-expect-error
          lightTheme
          containerStyle={{ backgroundColor: theme.colors?.grey5, paddingHorizontal: 10 }}
          inputContainerStyle={{ borderRadius: 10 }}
          platform="default"
          value={fipeContext.state.ftsQueryModelYears}
          onChangeText={setFtsQuery}
          placeholder={`Pesquisar ${modelYearCount} preços`}
        />
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 10 }}
          data={modelYears}
          renderItem={({ item }) => <ModelListItem modelYear={item} />}
          keyExtractor={({ id }) => id.toHexString()}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
  )
}
