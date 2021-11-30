import React, { useCallback, useEffect, useState, memo } from 'react'
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native'
import { useTheme, ListItem } from 'react-native-elements'
import { RecyclerListView, DataProvider, LayoutProvider, RecyclerListViewProps } from 'recyclerlistview'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useIsFocused } from '@react-navigation/native'
import SearchBar from '../components/SafeSearchBar'
import VehicleTypeIcon from '../components/VehicleTypeIcon'
import ModelTrendItem from '../components/ModelTrendItem'
import currencyFilter from '../filters/currency'
import useFipeState, { ModelYear } from '../hooks/useFipeState'
import { defaultBorderRadius } from '../theme/index'

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

export default function VehiclesMasterScreen () {
  const fipeState = useFipeState()
  const { theme } = useTheme()
  const isFocused = useIsFocused()
  const { width } = useWindowDimensions()

  const dataProvider = new DataProvider((r1: ModelYear, r2: ModelYear) => r1.id.equals(r2.id)).cloneWithRows(fipeState.state.filteredModelYears.get())
  const layoutProvider = new LayoutProvider(
    () => 0,
    (type, dim) => {
      dim.width = width
      dim.height = 100
    }
  )
  const rowRenderer = useCallback((type: string | number, data: ModelYear) => <ModelYearListItem modelYear={ data } />, [])

  const MemoizedRecyclerListView: React.FC<RecyclerListViewProps & { hash: number }> = memo(
    props => <RecyclerListView { ...props } />, ((next, prev) => next.hash === prev.hash)
  )

  return (
    <SafeAreaView style={ { flex: 1, backgroundColor: theme.colors?.grey5 } }>
      <SearchBar
        platform="default"
        containerStyle={ {
          backgroundColor: theme.colors?.primary,
          paddingHorizontal: 10,
          borderRadius: 0,
          borderBottomColor: 'transparent',
          borderTopColor: 'transparent'
        } }
        inputContainerStyle= { {
          borderRadius: defaultBorderRadius
        } }
        value={ fipeState.state.modelYearFtsQuery.get() }
        onChangeText={ fipeState.state.modelYearFtsQuery.set }
        placeholder={ `Pesquisar ${fipeState.state.filteredModelYearsCount.get()} preços` }
      />
      {
        (isFocused && fipeState.state.filteredModelYears.get().length) ?
          <MemoizedRecyclerListView
            rowRenderer={ rowRenderer }
            layoutProvider={ layoutProvider }
            dataProvider={ dataProvider }
            hash={ fipeState.state.modelYearFilterHash.get() }
          />
          : null
      }    
    </SafeAreaView>
  )
}
