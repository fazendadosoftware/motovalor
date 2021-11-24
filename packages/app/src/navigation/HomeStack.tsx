import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import HomeTabs from './HomeTabs'
import FilterTabs from './FilterTabs'

export default function HomeStack() {
  const Stack = createStackNavigator()

  const screenOptions = {
    headerTintColor: 'white',
    headerStyle: { backgroundColor: '#1D4ED8' }
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
