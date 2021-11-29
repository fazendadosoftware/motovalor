import React from 'react'
import { useColorScheme } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import { ThemeProvider } from 'react-native-elements'
import { useNoSleep } from 'react-native-no-sleep'
import { Provider } from 'react-redux'
import{ store } from './store'
import RootStack from './navigation/RootStack'
import { FipeProvider } from './context/fipe'
import theme from './theme'

const App: React.FC = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  if (__DEV__) useNoSleep()
  const colorScheme = useColorScheme()

  return (
    <Provider store={ store }>
      <FipeProvider>
        <ThemeProvider theme={ colorScheme === 'dark' ? theme.dark : theme.light }>
          <SafeAreaProvider>
            <NavigationContainer>
              <RootStack />
            </NavigationContainer>
          </SafeAreaProvider>
        </ThemeProvider>
      </FipeProvider>
    </Provider>
  )
}

export default App
