import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Icon, useTheme } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import { MakeSelectionScreenNavigationProp } from '@/navigation/RootStack'
import { Make } from 'datastore/src/model'

const makes: Make[] = [
  { id: 1, name: 'HARLEY-DAVIDSON' },
  { id: 2, name: 'TRIUMPH' },
  { id: 3, name: 'DUCATI' },
  { id: 4, name: 'SUZUKI' },
  { id: 5, name: 'ROYAL-ENFIELD' },
  { id: 6, name: 'HONDA' },
  { id: 7, name: 'KAWAZAKI' }
]

const MakeItem: React.FC<{ make: Make}> = ({ make }) => {
  const { theme } = useTheme()
  return (
    <View style={{ ...styles.itemContainer, backgroundColor: theme.colors?.white, borderColor: theme.colors?.greyOutline }}>
      <Text style={{ fontSize: 10 }}>{make.name}</Text>
    </View>
  )
}

const MakeFormGroup = () => {
  const navigation = useNavigation<MakeSelectionScreenNavigationProp>()
  return (
    <Pressable
      style={{ flexDirection: 'row', minHeight: 50 }}
      onPress={() => navigation.navigate('MakeSelection')}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 10 }}>
          Fabricantes
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {makes.map((make, i) => <MakeItem key={i} make={make} />)}
        </View> 
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Icon name='chevron-right' type='material-community' size={28} />
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    paddingTop: 3
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemContainer: {
    paddingHorizontal: 2,
    paddingVertical: 1,
    marginRight: 3,
    marginBottom: 3,
    borderWidth: 1,
    borderRadius: 3,
  }
})
export default MakeFormGroup
