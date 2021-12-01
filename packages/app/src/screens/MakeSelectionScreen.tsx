import React, { useState, useCallback, memo } from 'react'
import { View, Text, useWindowDimensions } from 'react-native'
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme, Button, ListItem } from 'react-native-elements'
import SearchBar from '../components/SafeSearchBar'
import useFipeState from '../hooks/useFipeState'
import { Make } from 'datastore/src/model'

interface MakeListItemProps { make: Make, isSelected: boolean, onPress: (make: Make) => void }

const LIST_ITEM_HEIGHT = 55

const MakeListItem: React.FC<MakeListItemProps> = ({ make, isSelected }) => {
  const { theme } = useTheme()
  const fipeState = useFipeState()
  const onPress = useCallback(
    () => fipeState.actions.toggleMakeSelection({ id: make.id, name: make.name }),
    [fipeState.actions, make]
  )
  return (
    <ListItem onPress={ onPress } containerStyle={ { height: LIST_ITEM_HEIGHT } }>
      <ListItem.Content>
        <ListItem.Title>
          { make.name }
        </ListItem.Title>
      </ListItem.Content>
      { isSelected ? <ListItem.Chevron iconProps={ { name: 'check', color: theme.colors?.primary } } /> : null }
    </ListItem>
    
  )
}

export interface MakeSelectionListHeaderProps {
  query: string
  onQueryChange: (text: string) => void
}

const MakeSelectionListHeaderSelectedItem: React.FC<{ make: Make }> = memo(({ make }) => {
  const { theme } = useTheme()
  const fipeState = useFipeState()
  return (
    <Button
      type='outline'
      containerStyle={ { marginRight: 5, marginBottom: 5 } }
      buttonStyle={ { padding: 0, paddingRight: 5 } }
      titleStyle={ { fontSize: 12 } }
      title={ make.name }
      onPress={ () => fipeState.actions.toggleMakeSelection(make) }
      iconRight={ true }
      icon={ { name: 'close-circle', type: 'material-community', color: theme.colors?.primary, size: 18 } }
    />
  )
}, (prev, next) => prev.make.id === next.make.id)

const MakeSelectionListHeaderSelectedItems = () => {
  const fipeState = useFipeState()
  const { theme } = useTheme()
  const selectedMakes = Object.values(fipeState.state.modelYearFilter.selectedMakeIndex.get())
    .sort(({ name: A = '' }, { name: B = '' }) => A > B ? 1 : A < B ? -1 : 0)

  return selectedMakes.length === 0 ? null : (
    <View style={ { padding: 10, backgroundColor: theme.colors?.grey5 } }>
      <Text style={ { fontSize: 12, fontWeight: 'bold', marginBottom: 5 } }>Fabricantes selectionados:</Text>
      <View style={ { flexDirection: 'row', flexWrap: 'wrap', marginBottom: -5, marginRight: -5 } }>
        { selectedMakes.map(make => <MakeSelectionListHeaderSelectedItem key={ make.id } make={ make } />) }
      </View>
    </View>
  )
}

const MakeSelectionListHeader = () => {
  const { theme } = useTheme()
  const [query, setQuery] = useState('')

  return (
    <View>
      <SearchBar
        // @ts-expect-error
        lightTheme
        containerStyle={ { backgroundColor: theme.colors?.grey5, paddingHorizontal: 10, borderRadius: 0 } }
        inputContainerStyle={ { borderRadius: 10 } }
        platform="default"
        value={ query }
        onChangeText={ setQuery }
        placeholder="Pesquisar fabricantes"
      />
      <MakeSelectionListHeaderSelectedItems />
    </View>
  )
}

const MakeSelectionScreen = memo(() => {
  const fipeState = useFipeState()
  const { theme } = useTheme()
  const { width } = useWindowDimensions()

  const dataProvider = new DataProvider(
    // FIXME:
    // Create the data provider and provide method which takes in two rows of data and return if those two are different or not.
    // THIS IS VERY IMPORTANT, FORGET PERFORMANCE IF THIS IS MESSED UP
    (r1: Make, r2: Make) => r1.id !== r2.id).cloneWithRows(fipeState.state.makes.get())
  const layoutProvider = new LayoutProvider(
    () => 0,
    (type, dim) => {
      dim.width = width
      dim.height = LIST_ITEM_HEIGHT
    }
  )

  const rowRenderer = useCallback(
    (type: string | number, data: Make) => <MakeListItem
      make={ data }
      isSelected={ !!fipeState.state.modelYearFilter.selectedMakeIndex.get()[data.id] }
      onPress={ fipeState.actions.toggleMakeSelection } />,
    [fipeState.actions, fipeState.state.modelYearFilter.selectedMakeIndex])

  return (
    <SafeAreaView style={ { flex: 1, backgroundColor: theme.colors?.grey5 } }>
      <MakeSelectionListHeader />
      <RecyclerListView
        rowRenderer={ rowRenderer }
        layoutProvider={ layoutProvider }
        dataProvider={ dataProvider }
      />
    </SafeAreaView>
  )
})

export default MakeSelectionScreen
