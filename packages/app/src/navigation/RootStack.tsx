import React, { useCallback }from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NativeStackNavigationProp, NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { useTheme, Icon } from 'react-native-elements'
import HomeTabs from './HomeTabs'
import FilterTabs from './FilterTabs'
import MakeSelectionScreen from '../screens/MakeSelectionScreen'
import { useModelYearFilterDispatch, ModelYearFilterAction } from '../hooks/useModelYearFilter'

export type RootStackParamList = {
  Home: undefined
  Filter: undefined
  MakeSelection: undefined
}

export type FilterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Filter'>
export type MakeSelectionScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MakeSelection'>

export default function RootStack() {
  const dispatchModelYearFilter = useModelYearFilterDispatch()
  const { theme } = useTheme()
  const RootStack = createNativeStackNavigator<RootStackParamList>()

  const screenOptions: NativeStackNavigationOptions = {
    headerTintColor: 'white',
    headerStyle: { backgroundColor: theme.colors?.primary },
    headerShadowVisible: true
  }

  const headerRight = useCallback(() => <Icon
    name='delete'
    type='material-community'
    color='white'
    style={{ padding: 5 }}
    onPress={() => dispatchModelYearFilter?.({ type: ModelYearFilterAction.SetMakeIndex, payload: null })}
  />, [])

  return (
    <RootStack.Navigator screenOptions={screenOptions}>
      <RootStack.Screen name='Home' options={{ headerShown: false }}>
        {props => <HomeTabs screenOptions={screenOptions} /> }
      </RootStack.Screen>
      <RootStack.Screen name='Filter' component={FilterTabs} />
      <RootStack.Screen
        name='MakeSelection'
        component={MakeSelectionScreen}
        options={{ headerTitle: 'Fabricantes', headerRight }}
      />
    </RootStack.Navigator>
  )
}
