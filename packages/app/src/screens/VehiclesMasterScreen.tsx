import React, { useEffect, useState } from 'react'
import { FlatList } from 'react-native'
import { useTheme } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchBar from '../components/SafeSearchBar'
import ModelListItem from '../components/ModelListItem'
import useFipe from '../hooks/useFipe'
import { ModelYear } from 'datastore/src/model'

export default function VehiclesMasterScreen () {
  const { theme } = useTheme()
  const { getModelYears } = useFipe()
  const [query, setQuery] = useState('')
  const [modelYears, setModelYears] = useState<ModelYear[] | null>(null)
  useEffect(() => { getModelYears().then(setModelYears) }, [])

  return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors?.grey5 }}>
        <SearchBar
          // @ts-expect-error
          lightTheme
          containerStyle={{ backgroundColor: theme.colors?.grey5, paddingHorizontal: 10 }}
          inputContainerStyle={{ borderRadius: 10 }}
          platform="default"
          value={query}
          onChangeText={setQuery}
          placeholder="Pesquisar modelos"
        />
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 10 }}
          data={modelYears}
          renderItem={({ item }) => <ModelListItem modelYear={item} />}
          keyExtractor={modelYear => `${modelYear.model.id}${modelYear.year}`}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
  )
}
