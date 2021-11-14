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

export default function ModelListItem () {
  return (
    <View style={ styles.container }>
      <View style={ styles.leftSection }>
        <VehicleTypeIcon vehicleTypeId={ 1 } size={ 50 } color="black" backgroundColor="#E5E5E5" />
      </View>
      <View style={ styles.middleSection }>
        <View>
          <Text style={ { fontSize: 10 } }>HARLEY-DAVIDSON</Text>
        </View>
        <View>
          <Text style={ { fontSize: 12, fontWeight: 'bold' } }>FAT BOY LOW/ SPECIAL FLSTFB</Text>
        </View>
        <View>
          <Text style={ { fontSize: 24 } }>2022</Text>
        </View>
        
      </View>
      <View style={ styles.rightSection }>
        <View style={ { flexDirection: 'row', justifyContent: 'center', borderColor: '#E5E5E5', borderBottomWidth: 1 } }>
          <Text style={ styles.vehiclePrice }>R$ 73.000</Text>
        </View>
        
        <View style={ { paddingHorizontal: 5 } }>
          <ModelTrendItem type="up" window="1M" value="5,5%" />
          <ModelTrendItem type="neutral" window="6M" value="0%" />
          <ModelTrendItem type="down" window="12M" value="-399,5%" />
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
