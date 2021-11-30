import React, { useCallback } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Icon, useTheme } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import { MakeSelectionScreenNavigationProp } from '../navigation/RootStack'
import useFipeState from '../hooks/useFipeState'
import { Make } from 'datastore/src/model'

const MakeItem: React.FC<{ make: Make}> = ({ make }) => {
  const { theme } = useTheme()
  return (
    <View style={ { ...styles.itemContainer, backgroundColor: theme.colors?.white, borderColor: theme.colors?.greyOutline } }>
      <Text style={ { fontSize: 10 } }>{ make.name }</Text>
    </View>
  )
}

const SelectedMakeSection: React.FC = () => {
  const fipeState = useFipeState()
  const selectedMakeSection = useCallback(() => Object.values(fipeState.state.modelYearFilter.selectedMakeIndex.get())
    .map(make => <MakeItem key={ make.id } make={ make } />)
  , [fipeState.state.modelYearFilter.selectedMakeIndex])

  return (
    <View style={ { flexDirection: 'row', flexWrap: 'wrap' } }>
      { selectedMakeSection() }
    </View>
  )
}
const MakeFormGroup = () => {
  const navigation = useNavigation<MakeSelectionScreenNavigationProp>()

  return (
    <Pressable
      style={ { flexDirection: 'row', minHeight: 50 } }
      onPress={ () => navigation.navigate('MakeSelection') }>
      <View style={ { flex: 1 } }>
        <Text style={ { fontSize: 12, fontWeight: 'bold', marginBottom: 10 } }>
          Fabricantes
        </Text>
        <SelectedMakeSection />
      </View>
      <View style={ { justifyContent: 'center', alignItems: 'center' } }>
        <Icon name='chevron-right' type='material-community' />
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
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
