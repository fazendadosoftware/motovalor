import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { View, Text, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'
import SearchScreen from '../screens/SearchScreen'
import FilterScreen from '../screens/FilterScreen'

const Stack = createStackNavigator()

export default function SearchStack() {
  return (
    <Stack.Navigator
      screenOptions={ {
        headerTintColor: 'white',
        headerStyle: { backgroundColor: '#1D4ED8' }
      } }>
      <Stack.Screen
        name='Search'
        component={ SearchScreen }
        options={ ({ navigation }) => ({
          headerRight: props => <View style={ { flexDirection: 'row' } }>
            <TouchableOpacity style={ { marginRight: 10 } }>
              <Icon name='sort-variant' type='material-community' size={ 24 } color='white' />
            </TouchableOpacity>
            <TouchableOpacity
              style={ { marginRight: 10 } }
              onPress={() => navigation.navigate('Filter') }>
              <Icon name='tune' type='material-community' size={ 24 } color='white' style={ { marginRight: 10 } } />
            </TouchableOpacity>
          </View>
        }) }
      />
      <Stack.Screen name='Filter' component={ FilterScreen } />
    </Stack.Navigator>
  )
}
