import React, { useState, useEffect, useCallback, memo } from 'react'
import { FlatList, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme, Icon } from 'react-native-elements'
import { useModelYearFilterState, useModelYearFilterDispatch, ModelYearFilterAction } from '../hooks/useModelYearFilter'
import SearchBar from '../components/SafeSearchBar'
import useFipe from '../hooks/useFipe'
import { Make } from 'datastore/src/model'

interface MakeListItemProps { make: Make, isSelected: boolean }

const MakeListItem: React.FC<MakeListItemProps> = memo(({ make, isSelected }) => {
  const modelYearFilter = useModelYearFilterState()
  const dispatch = useModelYearFilterDispatch()

  const { theme } = useTheme()

  const onPress = useCallback(() => {
    const { makeIndex } = modelYearFilter
    isSelected ? delete makeIndex[make.id] : makeIndex[make.id] = make
    dispatch?.({ type: ModelYearFilterAction.SetMakeIndex, payload: makeIndex })
  }, [isSelected])

  return (
    <TouchableOpacity
      style={[makeListItemStyles.container, { backgroundColor: 'white' }]}
      onPress={onPress}>
      <Text style={{ fontSize: 16 }}>{make.name}</Text>
      {isSelected ? <Icon name='check' type='material-community' color={theme.colors?.primary} size={16} /> : null}
    </TouchableOpacity>
  )
}, (prev: MakeListItemProps, next: MakeListItemProps) => prev.isSelected === next.isSelected)

const makeListItemStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    height: 60
  }
})

export interface MakeSelectionListHeaderProps {
  query: string
  onQueryChange: (text: string) => void
}

const MakeSelectionListHeader: React.FC<MakeSelectionListHeaderProps> = ({ query, onQueryChange }) => {
  const { theme } = useTheme()
  const modelYearFilter = useModelYearFilterState()
  const dispatch = useModelYearFilterDispatch()
  const [selectedMakes, setSelectedMakes] = useState<Make[]>([])

  useEffect(() => {
    const _selectedMakes = Object.values(modelYearFilter.makeIndex)
      .sort(({ name: A = '' }, { name: B = ''}) => A > B ? 1 : A < B ? -1 : 0)
    setSelectedMakes(_selectedMakes)
  }, [modelYearFilter])

  const onPress = useCallback((make: Make) => {
    delete modelYearFilter.makeIndex[make.id]
    dispatch?.({ type: ModelYearFilterAction.SetMakeIndex, payload: modelYearFilter.makeIndex })
  }, [])

  const selectedMakesComponent = useCallback(() => {
    if (selectedMakes.length === 0) return null
    return (
      <View style={{ backgroundColor: theme.colors?.grey5, padding: 10 }}>
        <Text style={{ fontSize: 12, marginBottom: 10 }}>Fabricantes selectionados:</Text>
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
                  backgroundColor: 'white',
                  marginRight: 10,
                  marginBottom: 10,
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

export interface MakeSelectionScreenProps {
  // makeIds: Set<number>
  // onUpdate: (makeIds: Set<number>) => void
}

const MakeSelectionScreen: React.FC<MakeSelectionScreenProps> = () => {
  const modelYearFilter = useModelYearFilterState()
  const { theme } = useTheme()
  const { getMakes } = useFipe()
  const [makes, setMakes] = useState<Make[]>([])
  const [query, setQuery] = useState('')

  useEffect(() => { getMakes().then(setMakes) }, [])

  const renderItem = useCallback(
    ({ item }: { item: Make }) => <MakeListItem make={item} isSelected={modelYearFilter.makeIndex[item.id] !== undefined} />,
    []
  )

  return (
    <SafeAreaView style={{ backgroundColor: theme.colors?.grey5 }}>
      <FlatList
        ListHeaderComponent={<MakeSelectionListHeader query={query} onQueryChange={setQuery}/>}
        stickyHeaderIndices={[0]}
        ItemSeparatorComponent={() => <View style={{ height: 1, width: '100%', backgroundColor: theme.colors?.greyOutline }}/>}
        removeClippedSubviews={true}
        data={makes}
        renderItem={renderItem}
        keyExtractor={({ id }) => id.toString()}
        showsVerticalScrollIndicator={false}
      />
       
    </SafeAreaView>
  )
}

export default MakeSelectionScreen
