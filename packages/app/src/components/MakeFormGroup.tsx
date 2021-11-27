import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Icon, useTheme } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import { MakeSelectionScreenNavigationProp } from '../navigation/RootStack'
import useModelYearFilter from '../hooks/useModelYearFilter'
import { Make } from 'datastore/src/model'

const MakeItem: React.FC<{ make: Make}> = ({ make }) => {
  const { theme } = useTheme()
  return (
    <View style={{ ...styles.itemContainer, backgroundColor: theme.colors?.white, borderColor: theme.colors?.greyOutline }}>
      <Text style={{ fontSize: 10 }}>{make.name}</Text>
    </View>
  )
}

const MakeFormGroup = () => {
  const { modelYearFilter } = useModelYearFilter()
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
          {
            Object.values(modelYearFilter.makeIndex)
              .sort(({ name: A = '' }, { name: B = '' }) => A > B ? 1 : A < B ? -1 : 0)
              .map(make => <MakeItem key={make.id} make={make} />)
          }
        </View> 
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Icon name='chevron-right' type='material-community' />
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
