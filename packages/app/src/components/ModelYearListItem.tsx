import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useTheme, ListItem } from 'react-native-elements'
import VehicleTypeIcon from '../components/VehicleTypeIcon'
import ModelTrendItem from '../components/ModelTrendItem'
import currencyFilter from '../filters/currency'
import { ModelYear } from '../hooks/useFipeState'

const ModelYearListItem: React.FC<{ modelYear: ModelYear }> = ({ modelYear }) => {
  const { theme } = useTheme()
  const [priceBRL, setPriceBRL] = useState<string | undefined>()
  useEffect(() => {
    setPriceBRL(currencyFilter(modelYear.price))
  }, [modelYear.price])

  return (
    <ListItem.Swipeable>
      <ListItem.Content style={ { ...styles.container, backgroundColor: theme.colors?.grey4 } }>
        <View style={ styles.leftSection }>
          <VehicleTypeIcon vehicleTypeCode={ modelYear.model.vehicleTypeCode } size={ 40 } color="black" backgroundColor="#E5E5E5" />
        </View>
        <View style={ styles.middleSection }>
          <Text numberOfLines={ 2 } style={ { fontSize: 10, textAlign: 'center', width: '100%' } }>
            { modelYear.model.make?.name ?? 'n/a' }
          </Text>
          <Text numberOfLines={ 2 } style={ { fontSize: 15, fontWeight: 'bold', textAlign: 'center', width: '100%' } }>
            { modelYear.model.name }
          </Text>
          <Text style={ { fontSize: 18, fontWeight: '300', textAlign: 'center', width: '100%' } }>
            { modelYear.year }
          </Text>
        </View>
        <View style={ styles.rightSection }>
          <View style={ { flexDirection: 'row', justifyContent: 'center', borderColor: '#E5E5E5', borderBottomWidth: 1, paddingVertical: 3 } }>
            <Text style={ { fontSize: 18, paddingHorizontal: 5 } }>
              { priceBRL }
            </Text>
          </View>
          <ModelTrendItem window="12M" value={ modelYear.delta12M } />
        </View>
      </ListItem.Content>
    </ListItem.Swipeable>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'stretch'
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
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderColor: '#E5E5E5',
    borderRightWidth: 1,
    paddingRight: 5
  },
  rightSection: {
    borderRadius: 10,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0
  }
})

export default ModelYearListItem
