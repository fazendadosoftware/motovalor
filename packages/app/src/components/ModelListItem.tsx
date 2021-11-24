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
import ModelYear from 'datastore/src/model/ModelYear'

const ModelListItem: React.FC<{ modelYear: ModelYear }> = props => {
  const { model: { name, vehicleTypeCode, make }, year, price, delta1M, delta6M, delta12M } = props.modelYear
  const priceBRL = currencyFilter(price)
  
  return (
    <View style={ styles.container }>
      <View style={ styles.leftSection }>
        <VehicleTypeIcon vehicleTypeCode={ vehicleTypeCode } size={ 35 } color="black" backgroundColor="#E5E5E5" />
      </View>
      <View style={ styles.middleSection }>
        <Text numberOfLines={ 2 } style={{ fontSize: 9, paddingBottom: 5 }}>
          { make?.name ?? 'n/a' }
        </Text>
        <Text numberOfLines={2} style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center', width: '100%' }}>
          {name}
        </Text>
        <Text style={{ fontSize: 18, fontWeight: '300', textAlign: 'right', width: '100%' }}>
          {year}
        </Text>
      </View>
      <View style={ styles.rightSection }>
        <View style={ { flexDirection: 'row', justifyContent: 'center', borderColor: '#E5E5E5', borderBottomWidth: 1, paddingVertical: 3 } }>
          <Text style={ styles.vehiclePrice }>
            { priceBRL }
          </Text>
        </View>
        
        <ModelTrendItem window="12M" value={delta12M} />
        
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
    flexDirection: 'row',
    marginBottom: 10
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
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    borderColor: '#E5E5E5',
    borderRightWidth: 1,
    paddingRight: 5
  },
  rightSection: {
    borderRadius: 10,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0
  },
  vehiclePrice: {
    fontSize: 18,
    paddingHorizontal: 5
  }
})

export default ModelListItem
