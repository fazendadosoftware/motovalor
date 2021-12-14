import React, { useCallback, memo } from 'react'
import { useWindowDimensions } from 'react-native'
import { useTheme } from 'react-native-elements'
import { RecyclerListView, DataProvider, LayoutProvider, RecyclerListViewProps } from 'recyclerlistview'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useIsFocused } from '@react-navigation/native'
import SearchBar from '../components/SafeSearchBar'
import useFipeState, { ModelYear } from '../hooks/useFipeState'
import { defaultBorderRadius } from '../theme/index'
import ModelYearListItem from '../components/ModelYearListItem'

export default function VehiclesMasterScreen () {
  const fipeState = useFipeState()
  const { theme } = useTheme()
  const isFocused = useIsFocused()
  const { width } = useWindowDimensions()
  const modelYears = fipeState.state.filteredModelYears.get()

  const dataProvider = new DataProvider(
    // FIXME:
    // Create the data provider and provide method which takes in two rows of data and return if those two are different or not.
    // THIS IS VERY IMPORTANT, FORGET PERFORMANCE IF THIS IS MESSED UP
    (r1: ModelYear, r2: ModelYear) => false).cloneWithRows(modelYears)
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
