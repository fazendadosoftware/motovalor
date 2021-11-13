import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import SearchStack from './navigation/SearchStack'
import AccountScreen from './screens/AccountScreen'
import { Icon } from 'react-native-elements'

const App = () => {
  const Tab = createBottomTabNavigator()

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={ {
          headerStyle: { backgroundColor: '#1D4ED8' },
          headerTitleStyle: { color: 'white' }
        } }>
        <Tab.Screen
          name='SearchStack'
          component={ SearchStack }
          options={ {
            tabBarLabel: 'Buscar',
            tabBarIcon: ({ color, size }) => <Icon name='magnify' type='material-community' size={ size } color={ color } />,
            headerShown: false
          } }
        />
        <Tab.Screen
          name='Account'
          component={ AccountScreen }
          options={ {
            tabBarLabel: 'Conta',
            tabBarIcon: ({ color, size }) => <Icon name='account' type='material-community' size={ size } color={ color } />
          } }
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default App
