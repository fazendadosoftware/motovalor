import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NativeStackNavigationProp, NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { useTheme } from 'react-native-elements'
import HomeTabs from './HomeTabs'
import FilterTabs from './FilterTabs'
import MakeSelectionScreen from '../screens/MakeSelectionScreen'

export type RootStackParamList = {
  Home: undefined
  Filter: undefined
  MakeSelection: undefined
}

export type MakeSelectionScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MakeSelection'>

export default function RootStack() {
  const { theme } = useTheme()
  const RootStack = createNativeStackNavigator<RootStackParamList>()

  const screenOptions: NativeStackNavigationOptions = {
    headerTintColor: 'white',
    headerStyle: { backgroundColor: theme.colors?.primary },
    headerShadowVisible: true
  }

  return (
    <RootStack.Navigator screenOptions={screenOptions}>
      <RootStack.Screen name='Home' options={{ headerShown: false }}>
        {props => <HomeTabs screenOptions={screenOptions} /> }
      </RootStack.Screen>
      <RootStack.Screen name='Filter' component={FilterTabs} />
      <RootStack.Screen name='MakeSelection' component={MakeSelectionScreen} />
    </RootStack.Navigator>
  )
}
