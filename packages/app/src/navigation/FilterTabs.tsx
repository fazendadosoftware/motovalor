import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useTheme } from 'react-native-elements'
import FilterForm from '../components/FilterForm'
import FilterList from '../components/FilterList'

const FilterTabs: React.FC = () => {
  const { theme } = useTheme()
  const Tab = createMaterialTopTabNavigator()

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarIndicatorStyle: { backgroundColor: theme.colors?.primary }
      }}>
      <Tab.Screen
        name='Atuais'
        component={FilterForm}
      />
      <Tab.Screen
        name='Salvos'
        component={FilterList}
      />
    </Tab.Navigator>
  )
}

export default FilterTabs
