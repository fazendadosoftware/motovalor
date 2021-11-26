import React from 'react'
import { useColorScheme } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import { ThemeProvider } from 'react-native-elements'
import { useNoSleep } from 'react-native-no-sleep'
import RootStack from './navigation/RootStack'
import theme from './theme'
import { ModelYearFilterProvider } from './hooks/useModelYearFilter'

const App: React.FC = () => {
  // if (__DEV__) useNoSleep()
  useNoSleep()
  const colorScheme = useColorScheme()

  return (
    <ModelYearFilterProvider>
      <ThemeProvider theme={colorScheme === 'dark' ? theme.dark : theme.light}>
        <SafeAreaProvider>
          <NavigationContainer>
            <RootStack />
          </NavigationContainer>
        </SafeAreaProvider>
      </ThemeProvider>
    </ModelYearFilterProvider>
  )
}

export default App
