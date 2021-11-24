import React from 'react'
import { useColorScheme } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import { ThemeProvider } from 'react-native-elements'
import HomeStack from './navigation/HomeStack'
import theme from './theme'

const App = () => {
  const colorScheme = useColorScheme()

  return (
    <ThemeProvider theme={colorScheme === 'dark' ? theme.dark : theme.light}>
      <SafeAreaProvider>
        <NavigationContainer>
          <HomeStack />
        </NavigationContainer>
      </SafeAreaProvider>
    </ThemeProvider>
  )
}

export default App
