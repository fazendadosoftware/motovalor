import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import HomeStack from './navigation/HomeStack'
import useRealm from './hooks/useRealm'

const App = () => {
  const { getInstance } = useRealm()
  useEffect(() => {
    getInstance()
      .then(realm => {
        console.log('GETTING REALM', realm)
        const makes = realm.objects('MAKE')
        console.log('MAKES', makes)
      })
  })
  return (
    <NavigationContainer>
      <HomeStack />
    </NavigationContainer>
  )
}

export default App
