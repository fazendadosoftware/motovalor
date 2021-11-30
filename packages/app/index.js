/**
 * @format
 */

import 'intl'
import 'intl/locale-data/jsonp/pt'
import { AppRegistry } from 'react-native'
import App from './src/App'
import { name as appName } from './app.json'
import 'react-native-gesture-handler'
import 'react-native-get-random-values'
import 'fast-text-encoding'

AppRegistry.registerComponent(appName, () => App)
