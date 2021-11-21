import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import SearchBar from '../components/SearchBar'
import ModelListItem from '../components/ModelListItem'
import useRealm from '../hooks/useRealm'
import { ModelYear } from 'datastore/src/model'

export default function VehiclesMasterScreen () {
  const { getInstance } = useRealm()
  const [modelYear, setModelYear] = useState<ModelYear | null>(null)
  useEffect(() => {
    getInstance()
      .then(realm => {
        // https://docs.mongodb.com/realm-legacy/docs/javascript/latest/api/Realm.Results.html
        const results = realm.objects<ModelYear[]>(ModelYear.schema.name).filtered('model.make.name BEGINSWITH "HARLEY" AND year = 2011 LIMIT(1)')
        const [modelYear] = results.values()
        console.log('MODEL YEAR', modelYear)
        // setModelYears(_modelYears as ModelYear[])
      })
  })
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
