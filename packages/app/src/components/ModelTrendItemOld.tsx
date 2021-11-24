import React from 'react'
import { View, Text } from 'react-native'
import TrendIcon from './TrendIcon'

const ModelTrendItem: React.FC<{ window: string, value?: number }> = ({ window, value }) => {
  if (value === undefined) return null
  const _value = Math.round(value * 1E5)
  const type = value < 0 ? 'down' : value > 0 ? 'up' : 'neutral'
  const percentage = (_value / 1E3).toFixed(2) + '%'

  return (
    <View style={ { flexDirection: 'row', alignItems: 'center' } }>
      <View style={ { flexGrow: 1, flexDirection: 'row', justifyContent: 'flex-end' } }>
        <Text style={ { fontSize: 11, fontWeight: 'bold' } }>
          { percentage }
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
