import React from 'react'
import { View } from 'react-native'
import Svg, { Path } from 'react-native-svg'

const TrendIcon: React.FC<{ type: 'up' | 'down' | 'neutral', size?: number }> = props => {
  let element
  const { type, size = 50 } = props
  switch (type) {
  case 'up':
    element = <Svg width="100%" height="100%" viewBox="0 0 12 8">
      <Path d="M8.4 0L9.774 1.374L6.846 4.302L4.446 1.902L0 6.354L0.846 7.2L4.446 3.6L6.846 6L10.626 2.226L12 3.6V0H8.4Z" fill="#22C55E" />
    </Svg>

    break
  case 'down':
    element = <Svg width="100%" height="100%" viewBox="0 0 12 8">
      <Path d="M8.4 7.2L9.774 5.826L6.846 2.898L4.446 5.298L0 0.846L0.846 0L4.446 3.6L6.846 1.2L10.626 4.974L12 3.6V7.2H8.4Z" fill="#DC2626" />
    </Svg>

    break
  case 'neutral':
    element = <Svg width="100%" height="100%" viewBox="0 0 12 6">
      <Path d="M12 2.52632L9.47368 0V1.89474H0V3.15789H9.47368V5.05263L12 2.52632Z" fill="#F59E0B" />
    </Svg>

    break
  }
  const style = { width: size, height: size }
  return <View style={ style }>{ element }</View>
}

export default TrendIcon
