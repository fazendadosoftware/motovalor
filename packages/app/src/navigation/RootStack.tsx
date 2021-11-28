import React, { useCallback } from 'react'
import { createNativeStackNavigator, NativeStackNavigationProp, NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { useTheme, Icon } from 'react-native-elements'
import HomeTabs from './HomeTabs'
import FilterTabs from './FilterTabs'
import MakeSelectionScreen from '../screens/MakeSelectionScreen'
import { useFipeContext } from '../context/fipe'

export interface RootStackParamList {
  Home: undefined
  Filter: undefined
  MakeSelection: undefined
}

export type FilterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Filter'>
export type MakeSelectionScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MakeSelection'>

export default function RootStackNavigation() {
  const fipeContext = useFipeContext()
  const { theme } = useTheme()
  const RootStack = createNativeStackNavigator<RootStackParamList>()

  const screenOptions: NativeStackNavigationOptions = {
    headerTintColor: 'white',
    headerStyle: { backgroundColor: theme.colors?.primary },
    headerShadowVisible: false
  }

  const headerRightFilter = useCallback(() => <Icon
    name='delete'
    type='material-community'
    color='white'
    style={ { padding: 5 } }
    onPress={ fipeContext.actions.resetModelYearFilter }
  />, [fipeContext.actions.resetModelYearFilter])

  const headerRightMakeSelection = useCallback(() => <Icon
    name='delete'
    type='material-community'
    color='white'
    style={ { padding: 5 } }
    onPress={ fipeContext.actions.resetModelYearFilterMakeIds }
  />, [fipeContext.actions.resetModelYearFilterMakeIds])

  return (
    <RootStack.Navigator screenOptions={ screenOptions }>
      <RootStack.Screen name='Home' options={ { headerShown: false } }>
        { props => <HomeTabs screenOptions={ screenOptions } /> }
      </RootStack.Screen>
      <RootStack.Screen
        name='Filter'
        component={ FilterTabs }
        options={ { headerTitle: 'Filtrar', headerRight: headerRightFilter } }
      />
      <RootStack.Screen
        name='MakeSelection'
        component={ MakeSelectionScreen }
        options={ { headerTitle: 'Fabricantes', headerRight: headerRightMakeSelection } }
      />
    </RootStack.Navigator>
  )
}
