import React from 'react'
import {
  Text,
  View
} from 'react-native'
import SearchBar from '../components/SearchBar'
import ModelListItem from '../components/ModelListItem'

export default function VehiclesMasterScreen () {
  return (
    <View style={ { flex: 1, backgroundColor: '#E4E4E7',  } }>
      <View style={ { padding: 10, paddingBottom: 0 } }>
        <SearchBar />
      </View>
      <View style={ { flex: 1, padding: 10 } }>
        <ModelListItem />
      </View>
    </View>
  )
}
