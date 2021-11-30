import React, { useState, useCallback, memo } from 'react'
import { FlatList, View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme, Icon, ListItem, Button } from 'react-native-elements'
import SearchBar from '../components/SafeSearchBar'
import useFipeState from '../hooks/useFipeState'
import { Make } from 'datastore/src/model'

interface MakeListItemProps { make: Make, isSelected: boolean, onPress: (make: Make) => void }

const LIST_ITEM_HEIGHT = 55

const MakeListItem: React.FC<MakeListItemProps> = memo(({ make, isSelected, onPress }) => {
  const { theme } = useTheme()
  return (
    <ListItem key={ make.id } onPress={ () => onPress(make) } containerStyle={ { height: LIST_ITEM_HEIGHT } }>
      <ListItem.Content>
        <ListItem.Title>
          { make.name }
        </ListItem.Title>
      </ListItem.Content>
      { isSelected ? <ListItem.Chevron iconProps={ { name: 'check', color: theme.colors?.primary } } /> : null }
    </ListItem>
  )
}, (prev, next) => prev.isSelected === next.isSelected)

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

const MakeSelectionListHeader: React.FC<{ _: number }> = memo(() => {
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
})

const MakeSelectionScreen = memo(() => {
  const fipeState = useFipeState()
  const { theme } = useTheme()

  const ItemSeparatorComponent = useCallback(() => <View style={ { height: 1, width: '100%', backgroundColor: theme.colors?.greyOutline } } />, [])

  const renderItem = useCallback(
    ({ item }: { item: Make }) => {
      return (
        <MakeListItem
          make={ item }
          isSelected={ !!fipeState.state.modelYearFilter.selectedMakeIndex.get()[item.id] }
          onPress={ fipeState.actions.toggleMakeSelection }/>
      )
    }, [fipeState.actions.toggleMakeSelection, fipeState.state.modelYearFilter.selectedMakeIndex])

  const keyExtractor = useCallback((item: Make) => item.id.toString(), [])
  const getItemLayout = useCallback((data: Make[] | null | undefined, index: number) => ({
    length: LIST_ITEM_HEIGHT,
    offset: LIST_ITEM_HEIGHT && index,
    index
  }), [])

  return (
    <SafeAreaView style={ { backgroundColor: theme.colors?.grey5 } }>
      <FlatList
        ListHeaderComponent={ MakeSelectionListHeader }
        stickyHeaderIndices={ [0] }
        ItemSeparatorComponent={ ItemSeparatorComponent }
        data={ fipeState.state.makes.get() }
        renderItem={ renderItem }
        keyExtractor={ keyExtractor }
        showsVerticalScrollIndicator={ false }
        removeClippedSubviews={ true }
        getItemLayout={ getItemLayout }
      />
    </SafeAreaView>
  )
})

export default MakeSelectionScreen
