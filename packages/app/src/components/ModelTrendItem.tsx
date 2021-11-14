import React from 'react'
import { View, Text } from 'react-native'
import TrendIcon from './TrendIcon'

const ModelTrendItem: React.FC<{ type: 'up' | 'down' | 'neutral', window: string, value: string }> = ({ type, window, value }) => {
  return (
    <View style={ { flexDirection: 'row', alignItems: 'center' } }>
      <View style={ { flexBasis: 50, flexGrow: 1, flexDirection: 'row', justifyContent: 'flex-end' } }>
        <Text style={ { fontSize: 11, fontWeight: 'bold' } }>
          { value }
        </Text>
      </View>
      <View style={ { flexBasis: 25, flexDirection: 'row', justifyContent: 'center' } }>
        <TrendIcon type={ type } size={ 15 } />
      </View>
      <View style={ { flexBasis: 25, flexDirection: 'row', justifyContent: 'flex-end' } }>
        <Text style={ { fontSize: 11, fontWeight: 'bold' } }>
          { window }
        </Text>
      </View>
    </View>
  )
}

export default ModelTrendItem
