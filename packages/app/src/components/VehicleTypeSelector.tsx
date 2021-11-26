import React from 'react'
import { View, ViewStyle, TouchableOpacity, Appearance } from 'react-native'
import { useTheme, Theme } from 'react-native-elements'
import VehicleTypeIcon from './VehicleTypeIcon'

type VehicleType = 1 | 2 | 3

const getVehicleTypeIconProps = (vehicleTypeCode: VehicleType, vehicleTypes: Set<VehicleType>, theme: Theme) => {
  const isDark = Appearance.getColorScheme() === 'dark'
  const containerStyle: ViewStyle = {
    marginRight: 15,
    borderWidth: 1,
    borderColor: theme.colors?.primary
  }
  const color = vehicleTypes.has(vehicleTypeCode) ? 'white' : theme.colors?.primary
  const backgroundColor = vehicleTypes.has(vehicleTypeCode) ? theme.colors?.primary : 'white'
  return { vehicleTypeCode, containerStyle, color, backgroundColor, size: 45 }
}

export interface VehicleTypeSelectorProps {
  vehicleTypes: Set<VehicleType>
  onPress: (vehicleType: VehicleType) => void
}

const VehicleTypeSelector: React.FC<VehicleTypeSelectorProps> = props => {
  const { vehicleTypes, onPress } = props
  const { theme } = useTheme()
  const vehicleTypeIndexes = [...new Array(3).keys()].map(i => i + 1) as VehicleType[]

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
      { vehicleTypeIndexes
        .map(i => <TouchableOpacity key={i} onPress={() => onPress(i)}>
          <VehicleTypeIcon {...getVehicleTypeIconProps(i, vehicleTypes, theme)} />
        </TouchableOpacity>)
      }
    </View>
  )
}

export default VehicleTypeSelector
