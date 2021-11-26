import React, { useState, useEffect, useCallback, memo } from 'react'
import { FlatList, View, Text, GestureResponderEvent, Pressable, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme, Icon } from 'react-native-elements'
import Realm from 'realm'
import SearchBar from '../components/SafeSearchBar'
import useFipe from '../hooks/useFipe'
import { Make } from 'datastore/src/model'

export interface MakeListItemProps {
  make: Make
  selected: boolean
  onPress: (make: Make, event?: GestureResponderEvent) => void
}

const MakeListItem: React.FC<MakeListItemProps> = memo(({ make, selected, onPress }) => {
  return (
    <Pressable
      style={[makeListItemStyles.container, { backgroundColor: 'white' }]}
      onPress={(event: GestureResponderEvent) => onPress(make, event)}>
      <Text style={{ fontSize: 18 }}>{make.name}</Text>
      <View>
        <Icon name={ selected ? 'checkbox-marked-outline' : 'checkbox-blank-outline' } type='material-community' size={28} />
      </View>
    </Pressable>
  )
})

const makeListItemStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    height: 60
  }
})

export interface MakeSelectionScreenProps {
  // makeIds: Set<number>
  // onUpdate: (makeIds: Set<number>) => void
}

const MakeSelectionScreen: React.FC<MakeSelectionScreenProps> = () => {
  const { theme } = useTheme()
  const { getMakes } = useFipe()
  const [makes, setMakes] = useState<Realm.Results<Make> | []>([])
  const [query, setQuery] = useState('')
  const [makeIds, setMakeIds] = useState<Set<number>>(new Set())
  useEffect(() => { getMakes().then(setMakes) }, [])

  const renderItem = useCallback(
    ({ item }: { item: Make }) => <MakeListItem make={item} selected={makeIds.has(item.id)} onPress={onListItemPress} />,
    []
  )

  const onListItemPress = useCallback(
    (make: Make) => {
      console.log('PRESSED', make.id)
      makeIds.has(make.id) ? makeIds.delete(make.id) : makeIds.add(make.id)
      setMakeIds(new Set([...makeIds]))
    },
    []
  )

  return (
    <SafeAreaView style={{ backgroundColor: theme.colors?.grey5 }}>
      <FlatList
        ListHeaderComponent={<SearchBar
          // @ts-expect-error
          lightTheme
          containerStyle={{ backgroundColor: theme.colors?.grey5, paddingHorizontal: 10 }}
          inputContainerStyle={{ borderRadius: 10 }}
          platform="default"
          value={query}
          onChangeText={setQuery}
          placeholder="Pesquisar fabricantes"
        />}
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
