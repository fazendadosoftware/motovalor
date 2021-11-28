import React, { useState, useEffect, useCallback, memo } from 'react'
import { FlatList, View, Text, TouchableOpacity, LayoutChangeEvent } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme, Icon, ListItem } from 'react-native-elements'
import SearchBar from '../components/SafeSearchBar'
import { useFipeContext } from '../context/fipe'
import { Make } from 'datastore/src/model'
import { FipeActionType } from '../context/fipe/types.d'

interface MakeListItemProps { make: Make, isSelected: boolean, onPress: (make: Make) => void }

const LIST_ITEM_HEIGHT = 55
let count = 0
const MakeListItem: React.FC<MakeListItemProps> = memo(({ make, isSelected, onPress }) => {
  const { theme } = useTheme()
  count++
  console.log('RENDERING', make.name, count)
  const onLayout = (evt: LayoutChangeEvent) => {
    console.log('HEIGHT', evt.nativeEvent.layout.height)
  }

  return (
    <ListItem key={make.id} onPress={() => onPress(make)} onLayout={onLayout} containerStyle={{ height: LIST_ITEM_HEIGHT }}>
      <ListItem.Content>
        <ListItem.Title>
          {make.name}
        </ListItem.Title>
      </ListItem.Content>
      {isSelected ? <ListItem.Chevron iconProps={{ name: 'check', color: theme.colors?.primary }} /> : null}
    </ListItem>
  )
}, (prev: MakeListItemProps, next: MakeListItemProps) => prev.isSelected === next.isSelected)

export interface MakeSelectionListHeaderProps {
  query: string
  onQueryChange: (text: string) => void
}

const MakeSelectionListHeader: React.FC<MakeSelectionListHeaderProps> = ({ query, onQueryChange }) => {
  const { theme } = useTheme()
  const fipeContext = useFipeContext()
  const [selectedMakes, setSelectedMakes] = useState<Make[]>([])

  useEffect(() => {
    const _selectedMakes = Object.values(fipeContext.state.modelYearFilter.makeIndex)
      .sort(({ name: A = '' }, { name: B = ''}) => A > B ? 1 : A < B ? -1 : 0)
    setSelectedMakes(_selectedMakes)
  }, [fipeContext.state.modelYearFilter._])

  const onPress = useCallback((make: Make) => {
    const { makeIndex } = fipeContext.state.modelYearFilter
    delete makeIndex[make.id]
    fipeContext.dispatch?.({ type: FipeActionType.SetModelYearFilterMakeIndex, payload: makeIndex })
  }, [fipeContext.state.modelYearFilter._])

  const selectedMakesComponent = useCallback(() => {
    if (selectedMakes.length === 0) return null
    return (
      <View style={{ backgroundColor: theme.colors?.grey5, padding: 10 }}>
        <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>Fabricantes selectionados:</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {selectedMakes.map(make => {
            return (
              <TouchableOpacity
                key={make.id}
                onPress={() => onPress(make)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 1,
                  borderRadius: 5,
                  borderColor: theme.colors?.greyOutline,
                  backgroundColor: 'white',
                  marginRight: 5,
                  marginBottom: 5,
                }}>
                <Text style={{ fontSize: 14, marginLeft: 5 }}>{make.name}</Text>
                <Icon
                  name='close-circle'
                  type='material-community'
                  color={theme.colors?.grey3}
                  size={18}
                  containerStyle={{ marginLeft: 5, paddingHorizontal: 5 }} />
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    )
  }, [selectedMakes])

  return (
    <View>
      <SearchBar
        // @ts-expect-error
        lightTheme
        containerStyle={{ backgroundColor: theme.colors?.grey5, paddingHorizontal: 10, borderRadius: 0 }}
        inputContainerStyle={{ borderRadius: 10 }}
        platform="default"
        value={query}
        onChangeText={onQueryChange}
        placeholder="Pesquisar fabricantes"
      />
      { selectedMakesComponent() }
    </View>
  )
}

const MakeSelectionScreen = memo(() => {
  const fipeContext = useFipeContext()
  const { theme } = useTheme()
  const [query, setQuery] = useState('')

  const ListHeaderComponent = useCallback(() => <MakeSelectionListHeader query={query} onQueryChange={setQuery} />, [])
  const ItemSeparatorComponent = useCallback(() => <View style={{ height: 1, width: '100%', backgroundColor: theme.colors?.greyOutline }} />, [])

  const onListItemPress = useCallback((make: Make) => {
    const { makeIndex } = fipeContext.state.modelYearFilter
    const isSelected = makeIndex[make.id] !== undefined
    isSelected ? delete makeIndex[make.id] : makeIndex[make.id] = make
    fipeContext.dispatch?.({ type: FipeActionType.SetModelYearFilterMakeIndex, payload: makeIndex })
  }, [])

  const renderItem = useCallback(
    ({ item }: { item: Make }) => <MakeListItem
      make={item}
      isSelected={fipeContext.state.modelYearFilter.makeIndex[item.id] !== undefined}
      onPress={onListItemPress}/>,
    []
  )
  const keyExtractor = useCallback((item: Make) => item.id.toString(), [])
  const getItemLayout = useCallback((data: Make[] | null | undefined, index: number) => ({
    length: LIST_ITEM_HEIGHT,
    offset: LIST_ITEM_HEIGHT & index,
    index
  }), [])

  return (
    <SafeAreaView style={{ backgroundColor: theme.colors?.grey5 }}>
      <FlatList
        ListHeaderComponent={ListHeaderComponent}
        stickyHeaderIndices={[0]}
        ItemSeparatorComponent={ItemSeparatorComponent}
        data={fipeContext.state.makes}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        getItemLayout={getItemLayout}
      />
    </SafeAreaView>
  )
})

export default MakeSelectionScreen
