import React, { useCallback } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTheme } from 'react-native-elements'
import { FilterScreenNavigationProp } from './RootStack'
import VehiclesMasterScreen from '../screens/VehiclesMasterScreen'
import AccountScreen from '../screens/AccountScreen'
import { Icon } from 'react-native-elements'

const HomeTabs: React.FC<{ screenOptions: any }> = ({ screenOptions }) => {
  const { theme } = useTheme()
  const navigation = useNavigation<FilterScreenNavigationProp>()
  const Tab = createBottomTabNavigator()

  const tabBarIconSearch = useCallback(({ color, size }) => <Icon name='magnify' type='material-community' size={size} color={color} />, [])
  const headerRight = useCallback(() => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 10 }}>
        <Icon name='sort-variant' type='material-community' color='white' style={{ padding: 5, marginRight: 5 }} />
        <Icon name='tune' type='material-community' color='white' style={{ padding: 5 }} onPress={() => navigation.navigate('Filter')} />
      </View>
    )
  }, [])
  const tabBarIconAccount = useCallback(({ color, size }) => <Icon name='account' type='material-community' size={size} color={color} />, [])

  return (
    <Tab.Navigator
      screenOptions={{ ...screenOptions, tabBarActiveTintColor: theme.colors?.primary }}>
      <Tab.Screen
        name='Search'
        component={ VehiclesMasterScreen }
        options={{ tabBarLabel: 'Buscar', tabBarIcon: tabBarIconSearch, headerTitle: 'Buscar', headerRight }}
      />
      <Tab.Screen
        name='Account'
        component={ AccountScreen }
        options={{ tabBarLabel: 'Conta', tabBarIcon: tabBarIconAccount }}
      />
    </Tab.Navigator>
  )
}

export default HomeTabs
