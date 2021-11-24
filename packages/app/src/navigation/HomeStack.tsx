import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { useTheme } from 'react-native-elements'
import HomeTabs from './HomeTabs'
import FilterTabs from './FilterTabs'

export default function HomeStack() {
  const { theme } = useTheme()
  const Stack = createStackNavigator()

  const screenOptions = {
    headerTintColor: 'white',
    headerStyle: { backgroundColor: theme.colors?.primary }
  }

  return (
    <Stack.Navigator
      screenOptions={ screenOptions }>
      <Stack.Screen
        name='Home'
        options={ { headerShown: false } }>
        { props => <HomeTabs screenOptions={ screenOptions }  /> }
      </Stack.Screen>
      <Stack.Screen name='Filter' component={ FilterTabs } />
    </Stack.Navigator>
  )
}
