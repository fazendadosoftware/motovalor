import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { View, TouchableOpacity } from 'react-native'
import { useTheme } from 'react-native-elements'
import VehiclesMasterScreen from '../screens/VehiclesMasterScreen'
import AccountScreen from '../screens/AccountScreen'
import { Icon } from 'react-native-elements'

const HomeTabs: React.FC<{ screenOptions: any }> = ({ screenOptions }) => {
  const { theme } = useTheme()
  const Tab = createBottomTabNavigator()

  return (
    <Tab.Navigator
      screenOptions={{ ...screenOptions, tabBarActiveTintColor: theme.colors?.primary }}>
      <Tab.Screen
        name='Search'
        component={ VehiclesMasterScreen }
        options={ ({ navigation }) => ({
          tabBarLabel: 'Buscar',
          tabBarIcon: ({ color, size }) => <Icon name='magnify' type='material-community' size={ size } color={ color } />,
          headerTitle: 'Buscar',
          headerRight: () => <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={{ marginRight: 10 }}>
              <Icon name='sort-variant' type='material-community' size={24} color='white' style={{ padding: 5 }} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginRight: 10 }}
              onPress={ () => navigation.navigate('Filter') }>
              <Icon name='tune' type='material-community' size={ 24 } color='white' style={{ padding: 5 }} />
            </TouchableOpacity>
          </View>
        }) }
      />
      <Tab.Screen
        name='Account'
        component={ AccountScreen }
        options={ {
          tabBarLabel: 'Conta',
          tabBarIcon: ({ color, size }) => <Icon name='account' type='material-community' size={size} color={color} />
        } }
      />
    </Tab.Navigator>
  )
}

export default HomeTabs
