import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import percentageFilter from '../filters/percentage'

const ModelTrendItem: React.FC<{ window: string, value?: number }> = ({ window, value }) => {
  if (value === undefined) return null
  const [fontColor, setFontColor] = useState<string | undefined>()
  const [percentage, setPercentage] = useState<string | undefined>()
  useEffect(() => {
    setFontColor(value < 0 ? '#DC2626' : value > 0 ? '#22C55E' : '#F59E0B')
    setPercentage(percentageFilter(value))
  }, [value, window])


  return (
    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: fontColor }}>
          {percentage}
        </Text>
        <Text style={{ fontSize: 8, fontStyle: 'italic', lineHeight: 8 }}>
          /{window}
        </Text>
      </View>
    </View>
  )
}

export default ModelTrendItem
