import React, { useState, useCallback, memo } from 'react'
import { FlatList, View, Text, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme, Icon, ListItem } from 'react-native-elements'
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

const MakeSelectionListHeaderSelectedItem: React.FC<{ make: Make, onPress: (make: Make) => void }> = memo(({ make, onPress }) => {
  const { theme } = useTheme()
  return (
    <Pressable
      key={ make.id }
      onPress={ () => onPress(make) }
      style={ {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 1,
        borderRadius: 5,
        borderColor: theme.colors?.greyOutline,
        backgroundColor: 'white',
        marginRight: 5,
        marginBottom: 5,
      } }>
      <Text style={ { fontSize: 14, marginLeft: 5 } }>{ make.name }</Text>
      <Icon
        name='close-circle'
        type='material-community'
        color={ theme.colors?.grey3 }
        size={ 18 }
        containerStyle={ { marginLeft: 5, paddingHorizontal: 5 } } />
    </Pressable>
  )
}, (prev, next) => prev.make.id === next.make.id)

const MakeSelectionListHeaderSelectedItems: React.FC<{ makes: Make[], onPress: (make: Make) => void}> = ({ makes, onPress }) => {
  const { theme } = useTheme()
  return makes.length === 0 ? null : (
    <View style={ { padding: 10, backgroundColor: theme.colors?.grey5 } }>
      <Text style={ { fontSize: 12, fontWeight: 'bold', marginBottom: 5 } }>Fabricantes selectionados:</Text>
      <View style={ { flexDirection: 'row', flexWrap: 'wrap' } }>
        { makes.map(make => <MakeSelectionListHeaderSelectedItem key={ make.id } make={ make } onPress={ onPress } />) }
      </View>
    </View>
  )
}

const MakeSelectionListHeader: React.FC<{ _: number }> = memo(() => {
  const fipeState = useFipeState()
  const { theme } = useTheme()
  const [query, setQuery] = useState('')

  const onPress = useCallback((make: Make) => {
    console.log('=========== DELETE SELECTED MAKE ========', make.name)
  }, [])

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
      <MakeSelectionListHeaderSelectedItems makes={ [...fipeState.state.modelYearFilter.selectedMakes.get().values()] } onPress={ onPress }/>
    </View>
  )
})

const MakeSelectionScreen = memo(() => {
  const fipeState = useFipeState()
  const { theme } = useTheme()

  const ListHeaderComponent = useCallback(() => <MakeSelectionListHeader _={ fipeContext.state.modelYearFilter._ } />, [fipeContext.state.modelYearFilter._])
  const ItemSeparatorComponent = useCallback(() => <View style={ { height: 1, width: '100%', backgroundColor: theme.colors?.greyOutline } } />, [])

  const onListItemPress = useCallback((make: Make) => {
    const isSelected = fipeState.state.modelYearFilter.selectedMakes.get().has(make.id)
    console.log('TOGGLE', make.name, isSelected)
  }, [fipeState.state.modelYearFilter.selectedMakes])

  const renderItem = useCallback(
    ({ item }: { item: Make }) => <MakeListItem
      make={ item }
      isSelected={ fipeState.state.modelYearFilter.selectedMakes.get().has(item.id) }
      onPress={ onListItemPress }/>,[])

  const keyExtractor = useCallback((item: Make) => item.id.toString(), [])
  const getItemLayout = useCallback((data: Make[] | null | undefined, index: number) => ({
    length: LIST_ITEM_HEIGHT,
    offset: LIST_ITEM_HEIGHT && index,
    index
  }), [])

  return (
    <SafeAreaView style={ { backgroundColor: theme.colors?.grey5 } }>
      <FlatList
        ListHeaderComponent={ ListHeaderComponent }
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
