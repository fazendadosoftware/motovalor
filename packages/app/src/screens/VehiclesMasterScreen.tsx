import React, { useEffect } from 'react'
import { FlatList } from 'react-native'
import { useTheme } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchBar from '../components/SafeSearchBar'
import ModelListItem from '../components/ModelListItem'
import useModelYearFilter from '../hooks/_useModelYearFilter'
import useFipe from '../hooks/useFipe'

export default function VehiclesMasterScreen () {
  const { modelYearFilter, setFtsQuery } = useModelYearFilter()
  const { filteredModelYears } = useFipe()
  const { theme } = useTheme()

  return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors?.grey5 }}>
        <SearchBar
          // @ts-expect-error
          lightTheme
          containerStyle={{ backgroundColor: theme.colors?.grey5, paddingHorizontal: 10 }}
          inputContainerStyle={{ borderRadius: 10 }}
          platform="default"
          value={modelYearFilter.ftsQuery}
          onChangeText={setFtsQuery}
          placeholder="Pesquisar modelos"
        />
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 10 }}
          data={filteredModelYears}
          renderItem={({ item }) => <ModelListItem modelYear={item} />}
          keyExtractor={({ id }) => id.toHexString()}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
  )
}
