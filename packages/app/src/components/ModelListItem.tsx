import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle
} from 'react-native'
import VehicleTypeIcon from './VehicleTypeIcon'
import ModelTrendItem from './ModelTrendItem'
import currencyFilter from '../filters/currency'

export interface ModelListItemProps {
  vehicleTypeId: 1 | 2 | 3
  make: string
  name: string
  modelYear: number
  price: number
  delta1M?: number
  delta6M?: number
  delta12M?: number
}
const ModelListItem: React.FC<ModelListItemProps> = props => {
  const { vehicleTypeId, make, name, modelYear, price, delta1M, delta6M, delta12M } = props
  console.log('PRICE', price, typeof price)
  const priceBRL = currencyFilter(price)
  
  return (
    <View style={ styles.container }>
      <View style={ styles.leftSection }>
        <VehicleTypeIcon vehicleTypeId={ vehicleTypeId } size={ 50 } color="black" backgroundColor="#E5E5E5" />
      </View>
      <View style={ styles.middleSection }>
        <View>
          <Text style={ { fontSize: 10 } }>
            { make }
          </Text>
        </View>
        <View>
          <Text style={ { fontSize: 12, fontWeight: 'bold' } }>
            { name }
          </Text>
        </View>
        <View>
          <Text style={ { fontSize: 24 } }>
            { modelYear }
          </Text>
        </View>
        
      </View>
      <View style={ styles.rightSection }>
        <View style={ { flexDirection: 'row', justifyContent: 'center', borderColor: '#E5E5E5', borderBottomWidth: 1 } }>
          <Text style={ styles.vehiclePrice }>
            { priceBRL }
          </Text>
        </View>
        
        <View style={ { paddingHorizontal: 5 } }>
          <ModelTrendItem window="1M" value={ delta1M } />
          <ModelTrendItem window="6M" value={ delta6M } />
          <ModelTrendItem window="12M" value={ delta12M } />
        </View>
        
      </View>
    </View>
  )
}

interface Styles {
  container: ViewStyle
  leftSection: ViewStyle
  middleSection: ViewStyle
  rightSection: ViewStyle
  vehiclePrice: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    height: 80,
    borderRadius: 10,
    backgroundColor: 'white',
    flexDirection: 'row'
  },
  leftSection: {
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginRight: 5,
    borderRightWidth: 1,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderColor: '#E5E5E5'
  },
  middleSection: {
    flex: 1,
    borderColor: '#E5E5E5',
    borderRightWidth: 1,
    paddingVertical: 5
  },
  rightSection: {
    borderRadius: 10,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0
  },
  vehiclePrice: {
    fontSize: 20,
    fontWeight: 'bold'
  }
})

export default ModelListItem
