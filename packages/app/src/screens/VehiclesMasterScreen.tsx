import React, { useEffect, useState } from 'react'
import { View, FlatList } from 'react-native'
import SearchBar from '../components/SearchBar'
import ModelListItem from '../components/ModelListItem'
import useRealm from '../hooks/useRealm'
import { Make, ModelYear } from 'datastore/src/model'

export default function VehiclesMasterScreen () {
  const { getInstance } = useRealm()
  const [modelYears, setModelYears] = useState<ModelYear[] | null>(null)
  useEffect(() => {
    getInstance()
      .then(realm => {
        // https://docs.mongodb.com/realm-legacy/docs/javascript/latest/api/Realm.Results.html
        const results: ModelYear[] = realm.objects<ModelYear>(ModelYear.schema.name).filtered('model.make.name BEGINSWITH "HARLEY" LIMIT (10)').toJSON()
        setModelYears(results)
      })
  })
  return (
    <View style={ { flex: 1, backgroundColor: '#E4E4E7',  } }>
      <View style={ { padding: 10, paddingBottom: 0 } }>
        <SearchBar />
      </View>
      <View style={ { flex: 1, padding: 10 } }>
        <FlatList
          data={ modelYears }
          renderItem={ ({ item }) => <ModelListItem modelYear={item} /> }
          keyExtractor={ modelYear => `${modelYear.model.id}${modelYear.year}`}/>
      </View>
    </View>
  )
}
