import React, { useEffect, useState } from 'react'
import { View, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchBar from '../components/SearchBar'
import ModelListItem from '../components/ModelListItem'
import useFipe from '../hooks/useFipe'
import { Results } from 'realm'
import { Make, ModelYear } from 'datastore/src/model'

export default function VehiclesMasterScreen () {
  const { getModelYears } = useFipe()
  const [modelYears, setModelYears] = useState<Results<ModelYear & Object> | null>(null)
  useEffect(() => {
    getModelYears()
      .then(modelYears => {
        // https://docs.mongodb.com/realm-legacy/docs/javascript/latest/api/Realm.Results.html
        setModelYears(modelYears)
      })
  })
  return (
    <SafeAreaView style={ { flex: 1, backgroundColor: '#E4E4E7',  } }>
      <View style={ { padding: 10, paddingBottom: 0 } }>
        <SearchBar />
      </View>
      <View style={{ flex: 1, padding: 10 }}>
        <FlatList
          data={ modelYears }
          renderItem={ ({ item }) => <ModelListItem modelYear={item} /> }
          keyExtractor={ modelYear => `${modelYear.model.id}${modelYear.year}`}
          showsVerticalScrollIndicator={false}/>
      </View>
    </SafeAreaView>
  )
}
