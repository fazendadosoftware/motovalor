import React, { useEffect } from 'react'
import { useColorScheme } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { ThemeProvider } from 'react-native-elements'
import { useNoSleep } from 'react-native-no-sleep'
import RootStack from './navigation/RootStack'
import theme from './theme'
import useFipeState from './hooks/useFipeState'

const App: React.FC = () => {
  const fipeState = useFipeState()
  // eslint-disable-next-line react-hooks/rules-of-hooks
  if (__DEV__) useNoSleep()
  const colorScheme = useColorScheme()

  useEffect(() => { 
    return () => fipeState.actions.destroy()
  }, [])
  
  return (
    <GestureHandlerRootView style={ { flex: 1 } }>
      <ThemeProvider theme={ colorScheme === 'dark' ? theme.dark : theme.light }>
        <SafeAreaProvider>
          <NavigationContainer>
            <RootStack />
          </NavigationContainer>
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  )
}

export default App
