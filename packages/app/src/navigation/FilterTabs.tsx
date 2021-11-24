import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import FilterForm from '../components/FilterForm'
import FilterList from '../components/FilterList'

const FilterTabs: React.FC = () => {
  const Tab = createMaterialTopTabNavigator()

  return (
    <Tab.Navigator>
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
