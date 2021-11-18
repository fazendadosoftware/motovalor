import React from 'react'
import { View } from 'react-native'
import SearchBar from '../components/SearchBar'
import ModelListItem from '../components/ModelListItem'

export default function VehiclesMasterScreen () {
  return (
    <View style={ { flex: 1, backgroundColor: '#E4E4E7',  } }>
      <View style={ { padding: 10, paddingBottom: 0 } }>
        <SearchBar />
      </View>
      <View style={ { flex: 1, padding: 10 } }>
        <ModelListItem
          vehicleTypeId={ 1 }
          make="HARLEY-DAVIDSON"
          name="FAT BOY BLA CLAJIFOEJFIOEWJIOF  FEJFIOWEJFIOj"
          modelYear={ 2012 }
          price={ 73000 }
          delta1M={ 0 }
          delta6M={ 0.08026257157325745 }
          delta12M={ -2.07171680778265 }/>
      </View>
    </View>
  )
}
